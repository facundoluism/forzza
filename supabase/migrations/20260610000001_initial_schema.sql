-- =============================================================================
-- FORZZA — Schema inicial
-- Migración: 20260610000001_initial_schema.sql
-- NUNCA editar una migración aplicada. Para cambios: nueva migración.
-- =============================================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE user_role AS ENUM ('student', 'coach', 'owner', 'promoter');
CREATE TYPE country_code AS ENUM ('AR', 'CL');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'trialing');
CREATE TYPE billing_model AS ENUM ('fixed', 'comision');
CREATE TYPE coach_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE package_tier AS ENUM ('starter', 'pro', 'elite');
CREATE TYPE assignment_status AS ENUM ('pending', 'active', 'completed', 'refunded', 'canceled');
CREATE TYPE payment_status AS ENUM ('pending', 'approved', 'rejected', 'refunded', 'in_process');
CREATE TYPE settlement_status AS ENUM ('pending', 'pending_invoice', 'invoiced', 'transferred');
CREATE TYPE notification_channel AS ENUM ('push', 'email', 'in_app');
CREATE TYPE workout_status AS ENUM ('in_progress', 'completed', 'abandoned');
CREATE TYPE legal_entity_type AS ENUM ('monotributo', 'responsable_inscripto', 'empresa', 'otro');

-- =============================================================================
-- TABLA: country_config
-- Configuración por país (commission_rate, precios, pisos)
-- =============================================================================

CREATE TABLE country_config (
  country           country_code PRIMARY KEY,
  commission_rate   NUMERIC(5,4) NOT NULL DEFAULT 0.2000,
  currency          TEXT NOT NULL,
  currency_symbol   TEXT NOT NULL,
  min_coach_price   INTEGER NOT NULL, -- en centavos/enteros
  active            BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: users (extiende auth.users de Supabase)
-- =============================================================================

CREATE TABLE users (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role              user_role NOT NULL DEFAULT 'student',
  country           country_code NOT NULL DEFAULT 'AR',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at        TIMESTAMPTZ -- soft delete
);

-- =============================================================================
-- TABLA: student_profiles
-- =============================================================================

CREATE TABLE student_profiles (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  display_name          TEXT,
  birth_date            DATE,
  parental_consent_at   TIMESTAMPTZ, -- si < 18 años, obligatorio para checkout coach
  parental_email        TEXT,
  goals                 TEXT[] DEFAULT '{}',
  level                 TEXT, -- principiante, intermedio, avanzado
  avatar_url            TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: coach_profiles
-- =============================================================================

CREATE TABLE coach_profiles (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  display_name          TEXT NOT NULL,
  bio                   TEXT,
  specialties           TEXT[] DEFAULT '{}',
  avatar_url            TEXT,
  status                coach_status NOT NULL DEFAULT 'pending',
  country               country_code NOT NULL DEFAULT 'AR',
  legal_entity_type     legal_entity_type,
  fiscal_id             TEXT, -- CUIT (AR) o RUT (CL)
  bank_account          TEXT, -- CBU/alias (AR) o cuenta+RUT (CL)
  -- constancia PDF/JPG en bucket privado fiscal-docs
  constancia_path       TEXT,
  billing_model         billing_model NOT NULL DEFAULT 'fixed',
  active_student_count  INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: coach_packages
-- =============================================================================

CREATE TABLE coach_packages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id      UUID NOT NULL REFERENCES coach_profiles(id) ON DELETE CASCADE,
  tier          package_tier NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  price         INTEGER NOT NULL, -- en centavos/enteros
  country       country_code NOT NULL DEFAULT 'AR',
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: subscriptions (PRO del alumno)
-- =============================================================================

CREATE TABLE subscriptions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status                subscription_status NOT NULL DEFAULT 'trialing',
  platform              TEXT NOT NULL, -- 'ios', 'android', 'web'
  gateway               TEXT NOT NULL, -- 'revenuecat', 'mercadopago'
  gateway_subscription_id TEXT UNIQUE,
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  canceled_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: payments
-- =============================================================================

CREATE TABLE payments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id),
  coach_id              UUID REFERENCES coach_profiles(id),
  assignment_id         UUID, -- se completa en migración de coach_assignments
  amount                INTEGER NOT NULL, -- en centavos
  currency              TEXT NOT NULL,
  status                payment_status NOT NULL DEFAULT 'pending',
  gateway               TEXT NOT NULL,
  gateway_payment_id    TEXT UNIQUE, -- idempotencia
  metadata              JSONB DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: coach_assignments
-- =============================================================================

CREATE TABLE coach_assignments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id        UUID NOT NULL REFERENCES users(id),
  coach_id          UUID NOT NULL REFERENCES coach_profiles(id),
  package_id        UUID NOT NULL REFERENCES coach_packages(id),
  payment_id        UUID REFERENCES payments(id),
  status            assignment_status NOT NULL DEFAULT 'pending',
  started_at        TIMESTAMPTZ,
  ended_at          TIMESTAMPTZ,
  refunded_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- FK diferida: payments.assignment_id → coach_assignments
ALTER TABLE payments ADD CONSTRAINT payments_assignment_id_fk
  FOREIGN KEY (assignment_id) REFERENCES coach_assignments(id);

-- =============================================================================
-- TABLA: settlements (liquidaciones quincenales)
-- =============================================================================

CREATE TABLE settlements (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id          UUID NOT NULL REFERENCES coach_profiles(id),
  period_start      DATE NOT NULL,
  period_end        DATE NOT NULL,
  gross_amount      INTEGER NOT NULL,
  commission        INTEGER NOT NULL,
  net_amount        INTEGER NOT NULL,
  currency          TEXT NOT NULL,
  status            settlement_status NOT NULL DEFAULT 'pending',
  invoice_number    TEXT, -- UNIQUE por coach (ver constraint abajo)
  invoice_path      TEXT, -- en bucket privado invoices
  transferred_at    TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sin factura aprobada, no existe "transferido" (constraint a nivel aplicación + trigger)
-- invoice_number único por coach
CREATE UNIQUE INDEX settlements_invoice_number_per_coach
  ON settlements(coach_id, invoice_number)
  WHERE invoice_number IS NOT NULL;

-- =============================================================================
-- TABLA: exercise_library
-- =============================================================================

CREATE TABLE exercise_library (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  description   TEXT,
  muscle_groups TEXT[] DEFAULT '{}',
  equipment     TEXT[] DEFAULT '{}',
  video_url     TEXT, -- en bucket privado videos
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: routines
-- =============================================================================

CREATE TABLE routines (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coach_id      UUID REFERENCES coach_profiles(id),
  title         TEXT NOT NULL,
  description   TEXT,
  exercises     JSONB NOT NULL DEFAULT '[]',
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: workout_sessions
-- =============================================================================

CREATE TABLE workout_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  routine_id      UUID REFERENCES routines(id),
  client_uuid     TEXT NOT NULL UNIQUE, -- idempotencia offline
  status          workout_status NOT NULL DEFAULT 'in_progress',
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  sets_data       JSONB NOT NULL DEFAULT '[]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: body_metrics
-- =============================================================================

CREATE TABLE body_metrics (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weight_g      INTEGER, -- en gramos (sin floats)
  height_mm     INTEGER, -- en milímetros
  body_fat_pct  INTEGER, -- en décimas de % (ej: 154 = 15.4%)
  notes         TEXT,
  recorded_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: progress_photos
-- =============================================================================

CREATE TABLE progress_photos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES coach_assignments(id), -- si fue pedida por coach
  storage_path  TEXT NOT NULL, -- en bucket privado progress-photos
  notes         TEXT,
  recorded_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: checkin_templates
-- =============================================================================

CREATE TABLE checkin_templates (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id      UUID NOT NULL REFERENCES coach_profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  questions     JSONB NOT NULL DEFAULT '[]',
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: checkin_responses
-- =============================================================================

CREATE TABLE checkin_responses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id     UUID NOT NULL REFERENCES checkin_templates(id),
  student_id      UUID NOT NULL REFERENCES users(id),
  assignment_id   UUID NOT NULL REFERENCES coach_assignments(id),
  answers         JSONB NOT NULL DEFAULT '[]',
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: messages (chat 1:1 por assignment)
-- =============================================================================

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id   UUID NOT NULL REFERENCES coach_assignments(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES users(id),
  content         TEXT NOT NULL,
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: notifications
-- =============================================================================

CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          TEXT NOT NULL, -- N1, N2, ..., N22
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  data          JSONB DEFAULT '{}',
  read_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: notification_preferences
-- =============================================================================

CREATE TABLE notification_preferences (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  push_enabled  BOOLEAN NOT NULL DEFAULT true,
  email_enabled BOOLEAN NOT NULL DEFAULT true, -- email de dinero no es opt-out-able
  push_token    TEXT,
  quiet_start   INTEGER NOT NULL DEFAULT 22, -- hora local
  quiet_end     INTEGER NOT NULL DEFAULT 8,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: promoters (tablas SÍ, UI NO en V1)
-- =============================================================================

CREATE TABLE promoters (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL UNIQUE REFERENCES users(id),
  referral_code   TEXT NOT NULL UNIQUE,
  commission_rate NUMERIC(5,4) NOT NULL DEFAULT 0.05,
  active          BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: referrals
-- =============================================================================

CREATE TABLE referrals (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promoter_id       UUID NOT NULL REFERENCES promoters(id),
  referred_user_id  UUID NOT NULL UNIQUE REFERENCES users(id), -- 1 referido = 1 promotor
  converted_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: promoter_payouts (tablas SÍ, UI NO en V1)
-- =============================================================================

CREATE TABLE promoter_payouts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promoter_id     UUID NOT NULL REFERENCES promoters(id),
  amount          INTEGER NOT NULL,
  currency        TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending',
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: tickets (soporte)
-- =============================================================================

CREATE TABLE tickets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id),
  subject       TEXT NOT NULL,
  body          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'open',
  resolved_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: leads (capturados en la landing)
-- =============================================================================

CREATE TABLE leads (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT NOT NULL,
  source        TEXT,
  country       country_code DEFAULT 'AR',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: processed_events (idempotencia de webhooks)
-- =============================================================================

CREATE TABLE processed_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id        TEXT NOT NULL UNIQUE, -- gateway_payment_id o webhook event ID
  gateway         TEXT NOT NULL,
  processed_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- TABLA: audit_log (append-only, registra toda acción financiera o de validación)
-- =============================================================================

CREATE TABLE audit_log (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id      UUID REFERENCES users(id),
  action        TEXT NOT NULL, -- 'payment.approved', 'settlement.transferred', etc.
  entity_type   TEXT NOT NULL,
  entity_id     UUID,
  payload       JSONB DEFAULT '{}',
  ip_address    INET,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- audit_log es APPEND-ONLY
REVOKE UPDATE, DELETE ON audit_log FROM authenticated, anon, service_role;
REVOKE UPDATE, DELETE ON processed_events FROM authenticated, anon, service_role;
