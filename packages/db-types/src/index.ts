// Tipos del schema de Forzza
// Se regenera con: pnpm db:types (requiere Supabase local corriendo)
// Este archivo es una aproximación manual hasta que la DB esté activa.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "student" | "coach" | "owner" | "promoter";
export type CountryCode = "AR" | "CL";
export type SubscriptionStatus = "active" | "past_due" | "canceled" | "trialing" | "pending" | "suspended" | "expired" | "cancelled";
export type BillingModel = "fixed" | "comision";
export type CoachStatus = "pending" | "approved" | "rejected" | "suspended";
export type BillingType = "mensual" | "paquete";
export type PaymentProvider = "mercadopago";
export type PackageTier = "starter" | "pro" | "elite";
export type AssignmentStatus = "pending" | "active" | "completed" | "refunded" | "canceled";
export type PaymentStatus = "pending" | "approved" | "rejected" | "refunded" | "in_process";
export type SettlementStatus = "pending" | "pending_invoice" | "invoiced" | "transferred";
export type WorkoutStatus = "in_progress" | "completed" | "abandoned";
export type QuestionType = "text" | "number" | "boolean" | "photo";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type Database = {
  public: {
    Tables: {
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
          country: CountryCode;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          role?: UserRole;
          country?: CountryCode;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
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
          user_id?: string;
          display_name?: string | null;
          birth_date?: string | null;
          parental_consent_at?: string | null;
          parental_email?: string | null;
          goals?: string[];
          level?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
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
          legal_entity_type: string | null;
          fiscal_id: string | null;
          bank_account: string | null;
          constancia_path: string | null;
          constancia_url: string | null;
          cbu: string | null;
          alias_cbu: string | null;
          billing_model: BillingModel;
          years_experience: number | null;
          active_student_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          display_name: string;
          bio?: string | null;
          specialties?: string[];
          avatar_url?: string | null;
          status?: CoachStatus;
          country: CountryCode;
          legal_entity_type?: string | null;
          fiscal_id?: string | null;
          bank_account?: string | null;
          constancia_path?: string | null;
          constancia_url?: string | null;
          cbu?: string | null;
          alias_cbu?: string | null;
          billing_model?: BillingModel;
          years_experience?: number | null;
          active_student_count?: number;
        };
        Update: {
          user_id?: string;
          display_name?: string;
          bio?: string | null;
          specialties?: string[];
          avatar_url?: string | null;
          status?: CoachStatus;
          country?: CountryCode;
          legal_entity_type?: string | null;
          fiscal_id?: string | null;
          bank_account?: string | null;
          constancia_path?: string | null;
          constancia_url?: string | null;
          cbu?: string | null;
          alias_cbu?: string | null;
          billing_model?: BillingModel;
          years_experience?: number | null;
          active_student_count?: number;
        };
        Relationships: [];
      };
      coach_packages: {
        Row: {
          id: string;
          coach_id: string;
          name: string;
          description: string | null;
          price_cents: number;
          billing_type: BillingType;
          features: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          coach_id: string;
          name: string;
          description?: string | null;
          price_cents: number;
          billing_type: BillingType;
          features?: string[];
          is_active?: boolean;
        };
        Update: {
          id?: string;
          coach_id?: string;
          name?: string;
          description?: string | null;
          price_cents?: number;
          billing_type?: BillingType;
          features?: string[];
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          payer_id: string;
          payee_id: string;
          amount_cents: number;
          currency_code: string;
          status: PaymentStatus;
          provider: PaymentProvider;
          provider_payment_id: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          payer_id: string;
          payee_id: string;
          amount_cents: number;
          currency_code: string;
          status?: PaymentStatus;
          provider: PaymentProvider;
          provider_payment_id?: string | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          payer_id?: string;
          payee_id?: string;
          amount_cents?: number;
          currency_code?: string;
          status?: PaymentStatus;
          provider?: PaymentProvider;
          provider_payment_id?: string | null;
          metadata?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      country_config: {
        Row: {
          country_code: CountryCode;
          commission_rate: number;
          currency: string;
          currency_code: string;
          currency_symbol: string;
          min_coach_price: number;
          pro_monthly_price_cents: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          country_code: CountryCode;
          commission_rate: number;
          currency: string;
          currency_code: string;
          currency_symbol: string;
          min_coach_price: number;
          pro_monthly_price_cents?: number;
          active?: boolean;
        };
        Update: {
          country_code?: CountryCode;
          commission_rate?: number;
          currency?: string;
          currency_code?: string;
          currency_symbol?: string;
          min_coach_price?: number;
          pro_monthly_price_cents?: number;
          active?: boolean;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: "free" | "pro" | "elite";
          status: SubscriptionStatus;
          provider: "mercadopago" | "revenuecat" | "manual";
          provider_subscription_id: string | null;
          started_at: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: "free" | "pro" | "elite";
          status?: SubscriptionStatus;
          provider: "mercadopago" | "revenuecat" | "manual";
          provider_subscription_id?: string | null;
          started_at?: string | null;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: "free" | "pro" | "elite";
          status?: SubscriptionStatus;
          provider?: "mercadopago" | "revenuecat" | "manual";
          provider_subscription_id?: string | null;
          started_at?: string | null;
          expires_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      processed_events: {
        Row: {
          id: string;
          event_id: string;
          provider: "mercadopago" | "revenuecat";
          event_type: string | null;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          provider: "mercadopago" | "revenuecat";
          event_type?: string | null;
          payload?: Json;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      coach_assignments: {
        Row: {
          id: string;
          coach_id: string;
          student_id: string;
          package_id: string | null;
          routine_id: string | null;
          status: AssignmentStatus;
          started_at: string | null;
          ended_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          coach_id: string;
          student_id: string;
          package_id?: string | null;
          routine_id?: string | null;
          status?: AssignmentStatus;
          started_at?: string | null;
          ended_at?: string | null;
        };
        Update: {
          id?: string;
          coach_id?: string;
          student_id?: string;
          package_id?: string | null;
          routine_id?: string | null;
          status?: AssignmentStatus;
          started_at?: string | null;
          ended_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      exercise_library: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          muscle_group: string | null;
          equipment: string | null;
          video_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          muscle_group?: string | null;
          equipment?: string | null;
          video_url?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          muscle_group?: string | null;
          equipment?: string | null;
          video_url?: string | null;
        };
        Relationships: [];
      };
      routines: {
        Row: {
          id: string;
          coach_id: string;
          student_id: string | null;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          coach_id: string;
          student_id?: string | null;
          name: string;
        };
        Update: {
          id?: string;
          coach_id?: string;
          student_id?: string | null;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      routine_exercises: {
        Row: {
          id: string;
          routine_id: string;
          exercise_id: string;
          order: number;
          sets: number | null;
          reps: number | null;
          duration_seconds: number | null;
          rest_seconds: number | null;
        };
        Insert: {
          id?: string;
          routine_id: string;
          exercise_id: string;
          order: number;
          sets?: number | null;
          reps?: number | null;
          duration_seconds?: number | null;
          rest_seconds?: number | null;
        };
        Update: {
          id?: string;
          routine_id?: string;
          exercise_id?: string;
          order?: number;
          sets?: number | null;
          reps?: number | null;
          duration_seconds?: number | null;
          rest_seconds?: number | null;
        };
        Relationships: [];
      };
      checkin_templates: {
        Row: {
          id: string;
          coach_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          coach_id: string;
          name: string;
        };
        Update: {
          id?: string;
          coach_id?: string;
          name?: string;
        };
        Relationships: [];
      };
      checkin_questions: {
        Row: {
          id: string;
          template_id: string;
          label: string;
          question_type: QuestionType;
          required: boolean;
          order: number;
        };
        Insert: {
          id?: string;
          template_id: string;
          label: string;
          question_type: QuestionType;
          required?: boolean;
          order: number;
        };
        Update: {
          id?: string;
          template_id?: string;
          label?: string;
          question_type?: QuestionType;
          required?: boolean;
          order?: number;
        };
        Relationships: [];
      };
      checkin_responses: {
        Row: {
          id: string;
          template_id: string;
          student_id: string;
          submitted_at: string;
          answers: Json;
        };
        Insert: {
          id?: string;
          template_id: string;
          student_id: string;
          submitted_at?: string;
          answers?: Json;
        };
        Update: {
          id?: string;
          template_id?: string;
          student_id?: string;
          submitted_at?: string;
          answers?: Json;
        };
        Relationships: [];
      };
      workout_sessions: {
        Row: {
          id: string;
          student_id: string;
          routine_id: string | null;
          status: WorkoutStatus;
          started_at: string;
          finished_at: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          routine_id?: string | null;
          status?: WorkoutStatus;
          started_at?: string;
          finished_at?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          student_id?: string;
          routine_id?: string | null;
          status?: WorkoutStatus;
          started_at?: string;
          finished_at?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      settlements: {
        Row: {
          id: string;
          coach_id: string;
          period_start: string;
          period_end: string;
          gross_amount_cents: number;
          commission_amount_cents: number;
          net_amount_cents: number;
          status: SettlementStatus;
          invoice_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          coach_id: string;
          period_start: string;
          period_end: string;
          gross_amount_cents: number;
          commission_amount_cents: number;
          net_amount_cents: number;
          status?: SettlementStatus;
          invoice_url?: string | null;
        };
        Update: {
          id?: string;
          coach_id?: string;
          period_start?: string;
          period_end?: string;
          gross_amount_cents?: number;
          commission_amount_cents?: number;
          net_amount_cents?: number;
          status?: SettlementStatus;
          invoice_url?: string | null;
        };
        Relationships: [];
      };
      tickets: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          body: string | null;
          status: TicketStatus;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          body?: string | null;
          status?: TicketStatus;
          assigned_to?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject?: string;
          body?: string | null;
          status?: TicketStatus;
          assigned_to?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      ticket_messages: {
        Row: {
          id: string;
          ticket_id: string;
          sender_id: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          sender_id: string;
          body: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      promoters: {
        Row: {
          id: string;
          user_id: string;
          code: string;
          commission_rate: number;
          total_referrals: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          code: string;
          commission_rate?: number;
          total_referrals?: number;
          active?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          code?: string;
          commission_rate?: number;
          total_referrals?: number;
          active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_log: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          payload: Json;
          metadata: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          payload?: Json;
          metadata?: Json | null;
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
      billing_type: BillingType;
      coach_status: CoachStatus;
      package_tier: PackageTier;
      assignment_status: AssignmentStatus;
      payment_status: PaymentStatus;
      payment_provider: PaymentProvider;
      settlement_status: SettlementStatus;
      workout_status: WorkoutStatus;
      question_type: QuestionType;
      ticket_status: TicketStatus;
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
