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
