// Tipos del schema de Forzza
// FUENTE DE VERDAD: supabase/migrations/ — este archivo debe ser consistente con ellas.
// Se regenera con: pnpm db:types (requiere Supabase local corriendo)
// Última sincronización: migración 20260615000001_add_missing_columns.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// =============================================================================
// ENUMS (deben coincidir EXACTAMENTE con los CREATE TYPE de las migraciones)
// =============================================================================

export type UserRole = "student" | "coach" | "owner" | "promoter";
export type CountryCode = "AR" | "CL";
export type SubscriptionStatus = "active" | "past_due" | "canceled" | "trialing";
export type BillingModel = "fixed" | "comision";
export type CoachStatus = "pending" | "approved" | "rejected" | "suspended";
export type PackageTier = "starter" | "pro" | "elite";
export type AssignmentStatus = "pending" | "active" | "completed" | "refunded" | "canceled";
export type PaymentStatus = "pending" | "approved" | "rejected" | "refunded" | "in_process";
export type SettlementStatus = "pending" | "pending_invoice" | "invoiced" | "transferred";
export type WorkoutStatus = "in_progress" | "completed" | "abandoned";
export type LegalEntityType = "monotributo" | "responsable_inscripto" | "empresa" | "otro";
export type NotificationChannel = "push" | "email" | "in_app";

// Tipos derivados (no son enums de DB pero se usan en código)
export type SubscriptionPlan = "free" | "pro" | "elite";

export type Database = {
  public: {
    Tables: {
      // =========================================================================
      // users — extiende auth.users, sin email ni full_name (están en auth.users)
      // =========================================================================
      users: {
        Row: {
          id: string;
          role: UserRole;
          country: CountryCode;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          role?: UserRole;
          country?: CountryCode;
          deleted_at?: string | null;
        };
        Update: {
          role?: UserRole;
          country?: CountryCode;
          deleted_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      // =========================================================================
      // student_profiles
      // =========================================================================
      student_profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          birth_date: string | null;
          parental_consent_at: string | null;
          parental_email: string | null;
          goals: string[];
          level: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name?: string | null;
          birth_date?: string | null;
          parental_consent_at?: string | null;
          parental_email?: string | null;
          goals?: string[];
          level?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          display_name?: string | null;
          birth_date?: string | null;
          parental_consent_at?: string | null;
          parental_email?: string | null;
          goals?: string[];
          level?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      // =========================================================================
      // coach_profiles
      // Columnas originales + cbu, alias_cbu, years_experience (migración 20260615)
      // constancia_url NO existe en DB — es una URL firmada calculada en runtime
      // =========================================================================
      coach_profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string;
          bio: string | null;
          specialties: string[];
          avatar_url: string | null;
          status: CoachStatus;
          country: CountryCode;
          legal_entity_type: LegalEntityType | null;
          fiscal_id: string | null;
          bank_account: string | null;
          constancia_path: string | null;
          cbu: string | null;
          alias_cbu: string | null;
          billing_model: BillingModel;
          years_experience: number | null;
          active_student_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name: string;
          bio?: string | null;
          specialties?: string[];
          avatar_url?: string | null;
          status?: CoachStatus;
          country?: CountryCode;
          legal_entity_type?: LegalEntityType | null;
          fiscal_id?: string | null;
          bank_account?: string | null;
          constancia_path?: string | null;
          cbu?: string | null;
          alias_cbu?: string | null;
          billing_model?: BillingModel;
          years_experience?: number | null;
          active_student_count?: number;
        };
        Update: {
          display_name?: string;
          bio?: string | null;
          specialties?: string[];
          avatar_url?: string | null;
          status?: CoachStatus;
          country?: CountryCode;
          legal_entity_type?: LegalEntityType | null;
          fiscal_id?: string | null;
          bank_account?: string | null;
          constancia_path?: string | null;
          cbu?: string | null;
          alias_cbu?: string | null;
          billing_model?: BillingModel;
          years_experience?: number | null;
          active_student_count?: number;
          updated_at?: string;
        };
        Relationships: [];
      };

      // =========================================================================
      // coach_packages — columnas exactas de la migración: tier, title, price, active, country
      // NO tiene: name, price_cents, billing_type, features, is_active
      // =========================================================================
      coach_packages: {
        Row: {
          id: string;
          coach_id: string;
          tier: PackageTier;
          title: string;
          description: string | null;
          price: number;
          country: CountryCode;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          coach_id: string;
          tier: PackageTier;
          title: string;
          description?: string | null;
          price: number;
          country?: CountryCode;
          active?: boolean;
        };
        Update: {
          tier?: PackageTier;
          title?: string;
          description?: string | null;
          price?: number;
          country?: CountryCode;
          active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };

      // =========================================================================
      // country_config — PK es 'country' (no country_code)
      // + pro_monthly_price_cents y currency_code (migración 20260615)
      // =========================================================================
      country_config: {
        Row: {
          country: CountryCode;
          commission_rate: number;
          currency: string;
          currency_symbol: string;
          currency_code: string;
          min_coach_price: number;
          pro_monthly_price_cents: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          country: CountryCode;
          commission_rate?: number;
          currency: string;
          currency_symbol: string;
          currency_code?: string;
          min_coach_price: number;
          pro_monthly_price_cents?: number;
          active?: boolean;
        };
        Update: {
          commission_rate?: number;
          currency?: string;
          currency_symbol?: string;
          currency_code?: string;
          min_coach_price?: number;
          pro_monthly_price_cents?: number;
          active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };

      // =========================================================================
      // subscriptions — columnas exactas de la migración
      // + plan (migración 20260615) — gateway y platform existían en original
      // NO tiene: provider, provider_subscription_id, started_at, expires_at
      // =========================================================================
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: SubscriptionPlan;
          status: SubscriptionStatus;
          platform: string;
          gateway: string;
          gateway_subscription_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          canceled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan?: SubscriptionPlan;
          status?: SubscriptionStatus;
          platform: string;
          gateway: string;
          gateway_subscription_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          canceled_at?: string | null;
        };
        Update: {
          plan?: SubscriptionPlan;
          status?: SubscriptionStatus;
          platform?: string;
          gateway?: string;
          gateway_subscription_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          canceled_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      // =========================================================================
      // payments — columnas exactas de la migración
      // NO tiene: payer_id, payee_id, amount_cents, currency_code, provider, provider_payment_id
      // USA: user_id, coach_id, amount, currency, gateway, gateway_payment_id, metadata
      // =========================================================================
      payments: {
        Row: {
          id: string;
          user_id: string;
          coach_id: string | null;
          assignment_id: string | null;
          amount: number;
          currency: string;
          status: PaymentStatus;
          gateway: string;
          gateway_payment_id: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          coach_id?: string | null;
          assignment_id?: string | null;
          amount: number;
          currency: string;
          status?: PaymentStatus;
          gateway: string;
          gateway_payment_id?: string | null;
          metadata?: Json;
        };
        Update: {
          status?: PaymentStatus;
          gateway_payment_id?: string | null;
          metadata?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };

      // =========================================================================
      // coach_assignments
      // NO tiene routine_id (no está en la migración)
      // =========================================================================
      coach_assignments: {
        Row: {
          id: string;
          student_id: string;
          coach_id: string;
          package_id: string;
          payment_id: string | null;
          status: AssignmentStatus;
          started_at: string | null;
          ended_at: string | null;
          refunded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          coach_id: string;
          package_id: string;
          payment_id?: string | null;
          status?: AssignmentStatus;
          started_at?: string | null;
          ended_at?: string | null;
          refunded_at?: string | null;
        };
        Update: {
          status?: AssignmentStatus;
          started_at?: string | null;
          ended_at?: string | null;
          refunded_at?: string | null;
          payment_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      // =========================================================================
      // settlements — columnas exactas de la migración (sin _cents en los nombres)
      // =========================================================================
      settlements: {
        Row: {
          id: string;
          coach_id: string;
          period_start: string;
          period_end: string;
          gross_amount: number;
          commission: number;
          net_amount: number;
          currency: string;
          status: SettlementStatus;
          invoice_number: string | null;
          invoice_path: string | null;
          transferred_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          coach_id: string;
          period_start: string;
          period_end: string;
          gross_amount: number;
          commission: number;
          net_amount: number;
          currency: string;
          status?: SettlementStatus;
          invoice_number?: string | null;
          invoice_path?: string | null;
          transferred_at?: string | null;
        };
        Update: {
          status?: SettlementStatus;
          invoice_number?: string | null;
          invoice_path?: string | null;
          transferred_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      // =========================================================================
      // exercise_library — columnas exactas: muscle_groups TEXT[], equipment TEXT[]
      // =========================================================================
      exercise_library: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          muscle_groups: string[];
          equipment: string[];
          video_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          muscle_groups?: string[];
          equipment?: string[];
          video_url?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
          muscle_groups?: string[];
          equipment?: string[];
          video_url?: string | null;
        };
        Relationships: [];
      };

      // =========================================================================
      // routines — title (no name), exercises JSONB, active BOOLEAN
      // student_id es NOT NULL; coach_id es nullable
      // =========================================================================
      routines: {
        Row: {
          id: string;
          student_id: string;
          coach_id: string | null;
          title: string;
          description: string | null;
          exercises: Json;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          coach_id?: string | null;
          title: string;
          description?: string | null;
          exercises?: Json;
          active?: boolean;
        };
        Update: {
          coach_id?: string | null;
          title?: string;
          description?: string | null;
          exercises?: Json;
          active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };

      // =========================================================================
      // workout_sessions — client_uuid para idempotencia offline; sets_data JSONB
      // NO tiene: finished_at, notes (tiene completed_at, sets_data)
      // =========================================================================
      workout_sessions: {
        Row: {
          id: string;
          student_id: string;
          routine_id: string | null;
          client_uuid: string;
          status: WorkoutStatus;
          started_at: string;
          completed_at: string | null;
          sets_data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          routine_id?: string | null;
          client_uuid: string;
          status?: WorkoutStatus;
          started_at?: string;
          completed_at?: string | null;
          sets_data?: Json;
        };
        Update: {
          status?: WorkoutStatus;
          completed_at?: string | null;
          sets_data?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };

      // =========================================================================
      // body_metrics (existía en migración, faltaba en db-types)
      // =========================================================================
      body_metrics: {
        Row: {
          id: string;
          student_id: string;
          weight_g: number | null;
          height_mm: number | null;
          body_fat_pct: number | null;
          notes: string | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          weight_g?: number | null;
          height_mm?: number | null;
          body_fat_pct?: number | null;
          notes?: string | null;
          recorded_at?: string;
        };
        Update: {
          weight_g?: number | null;
          height_mm?: number | null;
          body_fat_pct?: number | null;
          notes?: string | null;
        };
        Relationships: [];
      };

      // =========================================================================
      // progress_photos (existía en migración, faltaba en db-types)
      // =========================================================================
      progress_photos: {
        Row: {
          id: string;
          student_id: string;
          assignment_id: string | null;
          storage_path: string;
          notes: string | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          assignment_id?: string | null;
          storage_path: string;
          notes?: string | null;
          recorded_at?: string;
        };
        Update: {
          storage_path?: string;
          notes?: string | null;
        };
        Relationships: [];
      };

      // =========================================================================
      // checkin_templates
      // =========================================================================
      checkin_templates: {
        Row: {
          id: string;
          coach_id: string;
          title: string;
          questions: Json;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          coach_id: string;
          title: string;
          questions?: Json;
          active?: boolean;
        };
        Update: {
          title?: string;
          questions?: Json;
          active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };

      // =========================================================================
      // checkin_responses
      // =========================================================================
      checkin_responses: {
        Row: {
          id: string;
          template_id: string;
          student_id: string;
          assignment_id: string;
          answers: Json;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          template_id: string;
          student_id: string;
          assignment_id: string;
          answers?: Json;
          submitted_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };

      // =========================================================================
      // messages — assignment_id (no conversation_id), content (no body)
      // =========================================================================
      messages: {
        Row: {
          id: string;
          assignment_id: string;
          sender_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          sender_id: string;
          content: string;
          read_at?: string | null;
        };
        Update: {
          read_at?: string | null;
        };
        Relationships: [];
      };

      // =========================================================================
      // notifications — columna 'data' (no metadata)
      // =========================================================================
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          data: Json;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          data?: Json;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          data?: Json;
          read_at?: string | null;
        };
        Relationships: [];
      };

      // =========================================================================
      // notification_preferences
      // =========================================================================
      notification_preferences: {
        Row: {
          id: string;
          user_id: string;
          push_enabled: boolean;
          email_enabled: boolean;
          push_token: string | null;
          quiet_start: number;
          quiet_end: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          push_enabled?: boolean;
          email_enabled?: boolean;
          push_token?: string | null;
          quiet_start?: number;
          quiet_end?: number;
        };
        Update: {
          push_enabled?: boolean;
          email_enabled?: boolean;
          push_token?: string | null;
          quiet_start?: number;
          quiet_end?: number;
          updated_at?: string;
        };
        Relationships: [];
      };

      // =========================================================================
      // promoters — referral_code (no code); no total_referrals en migración
      // =========================================================================
      promoters: {
        Row: {
          id: string;
          user_id: string;
          referral_code: string;
          commission_rate: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          referral_code: string;
          commission_rate?: number;
          active?: boolean;
        };
        Update: {
          referral_code?: string;
          commission_rate?: number;
          active?: boolean;
        };
        Relationships: [];
      };

      // =========================================================================
      // referrals
      // =========================================================================
      referrals: {
        Row: {
          id: string;
          promoter_id: string;
          referred_user_id: string;
          converted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          promoter_id: string;
          referred_user_id: string;
          converted_at?: string | null;
        };
        Update: {
          converted_at?: string | null;
        };
        Relationships: [];
      };

      // =========================================================================
      // promoter_payouts
      // =========================================================================
      promoter_payouts: {
        Row: {
          id: string;
          promoter_id: string;
          amount: number;
          currency: string;
          status: string;
          paid_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          promoter_id: string;
          amount: number;
          currency: string;
          status?: string;
          paid_at?: string | null;
        };
        Update: {
          status?: string;
          paid_at?: string | null;
        };
        Relationships: [];
      };

      // =========================================================================
      // tickets
      // =========================================================================
      tickets: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          body: string;
          status: string;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          body: string;
          status?: string;
          resolved_at?: string | null;
        };
        Update: {
          subject?: string;
          body?: string;
          status?: string;
          resolved_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      // =========================================================================
      // leads (capturados en landing)
      // =========================================================================
      leads: {
        Row: {
          id: string;
          email: string;
          source: string | null;
          country: CountryCode | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string | null;
          country?: CountryCode | null;
        };
        Update: {
          email?: string;
          source?: string | null;
          country?: CountryCode | null;
        };
        Relationships: [];
      };

      // =========================================================================
      // processed_events — columnas exactas: event_id, gateway, processed_at
      // NO tiene: provider, event_type, payload
      // =========================================================================
      processed_events: {
        Row: {
          id: string;
          event_id: string;
          gateway: string;
          processed_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          gateway: string;
          processed_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };

      // =========================================================================
      // audit_log — APPEND-ONLY, columna 'payload' (no metadata separada)
      // =========================================================================
      audit_log: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          payload: Json;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          payload?: Json;
          ip_address?: string | null;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      auth_role: {
        Args: Record<string, never>;
        Returns: UserRole;
      };
      coach_has_active_assignment: {
        Args: { p_coach_id: string; p_student_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      country_code: CountryCode;
      subscription_status: SubscriptionStatus;
      billing_model: BillingModel;
      coach_status: CoachStatus;
      package_tier: PackageTier;
      assignment_status: AssignmentStatus;
      payment_status: PaymentStatus;
      settlement_status: SettlementStatus;
      workout_status: WorkoutStatus;
      legal_entity_type: LegalEntityType;
      notification_channel: NotificationChannel;
    };
  };
};

// Re-export convenience types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
