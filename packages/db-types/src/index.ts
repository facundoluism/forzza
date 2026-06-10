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
export type SubscriptionStatus = "active" | "past_due" | "canceled" | "trialing";
export type BillingModel = "fixed" | "comision";
export type CoachStatus = "pending" | "approved" | "rejected" | "suspended";
export type PackageTier = "starter" | "pro" | "elite";
export type AssignmentStatus = "pending" | "active" | "completed" | "refunded" | "canceled";
export type PaymentStatus = "pending" | "approved" | "rejected" | "refunded" | "in_process";
export type SettlementStatus = "pending" | "pending_invoice" | "invoiced" | "transferred";
export type WorkoutStatus = "in_progress" | "completed" | "abandoned";

export interface Tables {
  users: {
    Row: {
      id: string;
      role: UserRole;
      country: CountryCode;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
    Insert: Omit<Tables["users"]["Row"], "created_at" | "updated_at">;
    Update: Partial<Tables["users"]["Insert"]>;
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
    Insert: Omit<Tables["student_profiles"]["Row"], "id" | "created_at" | "updated_at">;
    Update: Partial<Tables["student_profiles"]["Insert"]>;
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
      billing_model: BillingModel;
      active_student_count: number;
      created_at: string;
      updated_at: string;
    };
    Insert: Omit<Tables["coach_profiles"]["Row"], "id" | "created_at" | "updated_at">;
    Update: Partial<Tables["coach_profiles"]["Insert"]>;
  };
  country_config: {
    Row: {
      country: CountryCode;
      commission_rate: number;
      currency: string;
      currency_symbol: string;
      min_coach_price: number;
      active: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: Omit<Tables["country_config"]["Row"], "created_at" | "updated_at">;
    Update: Partial<Tables["country_config"]["Insert"]>;
  };
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
    Insert: Omit<Tables["audit_log"]["Row"], "id" | "created_at">;
    Update: never; // append-only
  };
}

export interface Database {
  public: {
    Tables: Tables;
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
    };
  };
}
