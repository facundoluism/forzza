export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          payload: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          payload?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          payload?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      body_metrics: {
        Row: {
          body_fat_pct: number | null
          created_at: string
          height_mm: number | null
          id: string
          notes: string | null
          recorded_at: string
          student_id: string
          weight_g: number | null
        }
        Insert: {
          body_fat_pct?: number | null
          created_at?: string
          height_mm?: number | null
          id?: string
          notes?: string | null
          recorded_at?: string
          student_id: string
          weight_g?: number | null
        }
        Update: {
          body_fat_pct?: number | null
          created_at?: string
          height_mm?: number | null
          id?: string
          notes?: string | null
          recorded_at?: string
          student_id?: string
          weight_g?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "body_metrics_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      checkin_responses: {
        Row: {
          answers: Json
          assignment_id: string
          id: string
          student_id: string
          submitted_at: string
          template_id: string
        }
        Insert: {
          answers?: Json
          assignment_id: string
          id?: string
          student_id: string
          submitted_at?: string
          template_id: string
        }
        Update: {
          answers?: Json
          assignment_id?: string
          id?: string
          student_id?: string
          submitted_at?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkin_responses_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "coach_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkin_responses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkin_responses_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checkin_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      checkin_templates: {
        Row: {
          active: boolean
          coach_id: string
          created_at: string
          id: string
          questions: Json
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          coach_id: string
          created_at?: string
          id?: string
          questions?: Json
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          coach_id?: string
          created_at?: string
          id?: string
          questions?: Json
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkin_templates_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_assignments: {
        Row: {
          coach_id: string
          created_at: string
          ended_at: string | null
          id: string
          package_id: string
          payment_id: string | null
          refunded_at: string | null
          routine_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["assignment_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          ended_at?: string | null
          id?: string
          package_id: string
          payment_id?: string | null
          refunded_at?: string | null
          routine_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["assignment_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          ended_at?: string | null
          id?: string
          package_id?: string
          payment_id?: string | null
          refunded_at?: string | null
          routine_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["assignment_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_assignments_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_assignments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "coach_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_assignments_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_assignments_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_feedback: {
        Row: {
          coach_id: string
          created_at: string
          feedback_text: string
          id: string
          student_id: string
          target_id: string
          target_type: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          feedback_text: string
          id?: string
          student_id: string
          target_id: string
          target_type: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          feedback_text?: string
          id?: string
          student_id?: string
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_feedback_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_feedback_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_packages: {
        Row: {
          active: boolean
          coach_id: string
          country: Database["public"]["Enums"]["country_code"]
          created_at: string
          description: string | null
          id: string
          price: number
          tier: Database["public"]["Enums"]["package_tier"]
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          coach_id: string
          country?: Database["public"]["Enums"]["country_code"]
          created_at?: string
          description?: string | null
          id?: string
          price: number
          tier: Database["public"]["Enums"]["package_tier"]
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          coach_id?: string
          country?: Database["public"]["Enums"]["country_code"]
          created_at?: string
          description?: string | null
          id?: string
          price?: number
          tier?: Database["public"]["Enums"]["package_tier"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_packages_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_profiles: {
        Row: {
          active_student_count: number
          alias_cbu: string | null
          avatar_url: string | null
          avg_rating: number
          bank_account: string | null
          billing_model: Database["public"]["Enums"]["billing_model"]
          bio: string | null
          cbu: string | null
          constancia_path: string | null
          country: Database["public"]["Enums"]["country_code"]
          created_at: string
          display_name: string
          fiscal_id: string | null
          id: string
          legal_entity_type:
            | Database["public"]["Enums"]["legal_entity_type"]
            | null
          rating_count: number
          specialties: string[] | null
          status: Database["public"]["Enums"]["coach_status"]
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          active_student_count?: number
          alias_cbu?: string | null
          avatar_url?: string | null
          avg_rating?: number
          bank_account?: string | null
          billing_model?: Database["public"]["Enums"]["billing_model"]
          bio?: string | null
          cbu?: string | null
          constancia_path?: string | null
          country?: Database["public"]["Enums"]["country_code"]
          created_at?: string
          display_name: string
          fiscal_id?: string | null
          id?: string
          legal_entity_type?:
            | Database["public"]["Enums"]["legal_entity_type"]
            | null
          rating_count?: number
          specialties?: string[] | null
          status?: Database["public"]["Enums"]["coach_status"]
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          active_student_count?: number
          alias_cbu?: string | null
          avatar_url?: string | null
          avg_rating?: number
          bank_account?: string | null
          billing_model?: Database["public"]["Enums"]["billing_model"]
          bio?: string | null
          cbu?: string | null
          constancia_path?: string | null
          country?: Database["public"]["Enums"]["country_code"]
          created_at?: string
          display_name?: string
          fiscal_id?: string | null
          id?: string
          legal_entity_type?:
            | Database["public"]["Enums"]["legal_entity_type"]
            | null
          rating_count?: number
          specialties?: string[] | null
          status?: Database["public"]["Enums"]["coach_status"]
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_ratings: {
        Row: {
          coach_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          student_id: string
          updated_at: string
        }
        Insert: {
          coach_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          student_id: string
          updated_at?: string
        }
        Update: {
          coach_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_ratings_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_ratings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      country_config: {
        Row: {
          active: boolean
          commission_rate: number
          country: Database["public"]["Enums"]["country_code"]
          created_at: string
          currency: string
          currency_code: string
          currency_symbol: string
          min_coach_price: number
          pro_monthly_price_cents: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          commission_rate?: number
          country: Database["public"]["Enums"]["country_code"]
          created_at?: string
          currency: string
          currency_code?: string
          currency_symbol: string
          min_coach_price: number
          pro_monthly_price_cents?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          commission_rate?: number
          country?: Database["public"]["Enums"]["country_code"]
          created_at?: string
          currency?: string
          currency_code?: string
          currency_symbol?: string
          min_coach_price?: number
          pro_monthly_price_cents?: number
          updated_at?: string
        }
        Relationships: []
      }
      deletion_queue: {
        Row: {
          anonymize_at: string
          processed_at: string | null
          requested_at: string
          user_id: string
        }
        Insert: {
          anonymize_at?: string
          processed_at?: string | null
          requested_at?: string
          user_id: string
        }
        Update: {
          anonymize_at?: string
          processed_at?: string | null
          requested_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deletion_queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_library: {
        Row: {
          common_errors_en: Json
          common_errors_es: Json
          content_verified: boolean
          created_at: string
          description: string | null
          description_en: string | null
          description_es: string | null
          difficulty: string | null
          equipment: string[] | null
          execution_steps_en: Json
          execution_steps_es: Json
          icon_id: string | null
          id: string
          movement_pattern: string | null
          muscle_groups: string[] | null
          name: string
          name_en: string | null
          primary_group: string | null
          primary_muscles: string[]
          pro_tip_en: string | null
          pro_tip_es: string | null
          secondary_muscles: string[]
          slug: string | null
          source: string | null
          svg_icon: string | null
          tags: string[]
          tertiary_muscles: string[]
          video_url: string | null
        }
        Insert: {
          common_errors_en?: Json
          common_errors_es?: Json
          content_verified?: boolean
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_es?: string | null
          difficulty?: string | null
          equipment?: string[] | null
          execution_steps_en?: Json
          execution_steps_es?: Json
          icon_id?: string | null
          id?: string
          movement_pattern?: string | null
          muscle_groups?: string[] | null
          name: string
          name_en?: string | null
          primary_group?: string | null
          primary_muscles?: string[]
          pro_tip_en?: string | null
          pro_tip_es?: string | null
          secondary_muscles?: string[]
          slug?: string | null
          source?: string | null
          svg_icon?: string | null
          tags?: string[]
          tertiary_muscles?: string[]
          video_url?: string | null
        }
        Update: {
          common_errors_en?: Json
          common_errors_es?: Json
          content_verified?: boolean
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_es?: string | null
          difficulty?: string | null
          equipment?: string[] | null
          execution_steps_en?: Json
          execution_steps_es?: Json
          icon_id?: string | null
          id?: string
          movement_pattern?: string | null
          muscle_groups?: string[] | null
          name?: string
          name_en?: string | null
          primary_group?: string | null
          primary_muscles?: string[]
          pro_tip_en?: string | null
          pro_tip_es?: string | null
          secondary_muscles?: string[]
          slug?: string | null
          source?: string | null
          svg_icon?: string | null
          tags?: string[]
          tertiary_muscles?: string[]
          video_url?: string | null
        }
        Relationships: []
      }
      exercise_videos: {
        Row: {
          channel_id: string | null
          channel_title: string
          created_at: string
          duration_seconds: number | null
          exercise_id: string
          id: string
          lang: string
          score: number
          score_breakdown: Json | null
          status: string
          title: string
          updated_at: string
          youtube_id: string
        }
        Insert: {
          channel_id?: string | null
          channel_title: string
          created_at?: string
          duration_seconds?: number | null
          exercise_id: string
          id?: string
          lang: string
          score: number
          score_breakdown?: Json | null
          status?: string
          title: string
          updated_at?: string
          youtube_id: string
        }
        Update: {
          channel_id?: string | null
          channel_title?: string
          created_at?: string
          duration_seconds?: number | null
          exercise_id?: string
          id?: string
          lang?: string
          score?: number
          score_breakdown?: Json | null
          status?: string
          title?: string
          updated_at?: string
          youtube_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_videos_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercise_library"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          country: Database["public"]["Enums"]["country_code"] | null
          created_at: string
          email: string
          id: string
          source: string | null
        }
        Insert: {
          country?: Database["public"]["Enums"]["country_code"] | null
          created_at?: string
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          country?: Database["public"]["Enums"]["country_code"] | null
          created_at?: string
          email?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
      live_sessions: {
        Row: {
          assignment_id: string | null
          coach_id: string
          created_at: string
          id: string
          reminded_at: string | null
          room_url: string
          scheduled_at: string
          status: string
          student_id: string
          title: string
        }
        Insert: {
          assignment_id?: string | null
          coach_id: string
          created_at?: string
          id?: string
          reminded_at?: string | null
          room_url: string
          scheduled_at: string
          status?: string
          student_id: string
          title: string
        }
        Update: {
          assignment_id?: string | null
          coach_id?: string
          created_at?: string
          id?: string
          reminded_at?: string | null
          room_url?: string
          scheduled_at?: string
          status?: string
          student_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_sessions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "coach_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_sessions_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          assignment_id: string
          content: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          assignment_id: string
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          assignment_id?: string
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "coach_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          email_enabled: boolean
          id: string
          push_enabled: boolean
          push_token: string | null
          quiet_end: number
          quiet_start: number
          updated_at: string
          user_id: string
        }
        Insert: {
          email_enabled?: boolean
          id?: string
          push_enabled?: boolean
          push_token?: string | null
          quiet_end?: number
          quiet_start?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          email_enabled?: boolean
          id?: string
          push_enabled?: boolean
          push_token?: string | null
          quiet_end?: number
          quiet_start?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json | null
          id: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json | null
          id?: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          assignment_id: string | null
          coach_id: string | null
          created_at: string
          currency: string
          gateway: string
          gateway_payment_id: string | null
          id: string
          metadata: Json | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          assignment_id?: string | null
          coach_id?: string | null
          created_at?: string
          currency: string
          gateway: string
          gateway_payment_id?: string | null
          id?: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          assignment_id?: string | null
          coach_id?: string | null
          created_at?: string
          currency?: string
          gateway?: string
          gateway_payment_id?: string | null
          id?: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_assignment_id_fk"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "coach_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      processed_events: {
        Row: {
          event_id: string
          gateway: string
          id: string
          processed_at: string
        }
        Insert: {
          event_id: string
          gateway: string
          id?: string
          processed_at?: string
        }
        Update: {
          event_id?: string
          gateway?: string
          id?: string
          processed_at?: string
        }
        Relationships: []
      }
      progress_photos: {
        Row: {
          assignment_id: string | null
          created_at: string
          id: string
          notes: string | null
          recorded_at: string
          storage_path: string
          student_id: string
        }
        Insert: {
          assignment_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          recorded_at?: string
          storage_path: string
          student_id: string
        }
        Update: {
          assignment_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          recorded_at?: string
          storage_path?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_photos_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "coach_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_photos_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      promoter_payouts: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          paid_at: string | null
          promoter_id: string
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          id?: string
          paid_at?: string | null
          promoter_id: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          promoter_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "promoter_payouts_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoters"
            referencedColumns: ["id"]
          },
        ]
      }
      promoters: {
        Row: {
          active: boolean
          commission_rate: number
          created_at: string
          id: string
          referral_code: string
          user_id: string
        }
        Insert: {
          active?: boolean
          commission_rate?: number
          created_at?: string
          id?: string
          referral_code: string
          user_id: string
        }
        Update: {
          active?: boolean
          commission_rate?: number
          created_at?: string
          id?: string
          referral_code?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promoters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string
          id: string
          promoter_id: string
          referred_user_id: string
        }
        Insert: {
          converted_at?: string | null
          created_at?: string
          id?: string
          promoter_id: string
          referred_user_id: string
        }
        Update: {
          converted_at?: string | null
          created_at?: string
          id?: string
          promoter_id?: string
          referred_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "promoters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_schedule: {
        Row: {
          assignment_id: string
          coach_id: string
          created_at: string
          id: string
          notes: string | null
          routine_id: string
          scheduled_date: string
          student_id: string
          updated_at: string
        }
        Insert: {
          assignment_id: string
          coach_id: string
          created_at?: string
          id?: string
          notes?: string | null
          routine_id: string
          scheduled_date: string
          student_id: string
          updated_at?: string
        }
        Update: {
          assignment_id?: string
          coach_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          routine_id?: string
          scheduled_date?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_schedule_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "coach_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_schedule_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_schedule_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_schedule_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      routines: {
        Row: {
          active: boolean
          coach_id: string | null
          created_at: string
          description: string | null
          exercises: Json
          id: string
          student_id: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          coach_id?: string | null
          created_at?: string
          description?: string | null
          exercises?: Json
          id?: string
          student_id: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          coach_id?: string | null
          created_at?: string
          description?: string | null
          exercises?: Json
          id?: string
          student_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "routines_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routines_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      settlements: {
        Row: {
          coach_id: string
          commission: number
          created_at: string
          currency: string
          gross_amount: number
          id: string
          invoice_number: string | null
          invoice_path: string | null
          invoice_rejection_reason: string | null
          net_amount: number
          period_end: string
          period_start: string
          status: Database["public"]["Enums"]["settlement_status"]
          transferred_at: string | null
          updated_at: string
        }
        Insert: {
          coach_id: string
          commission: number
          created_at?: string
          currency: string
          gross_amount: number
          id?: string
          invoice_number?: string | null
          invoice_path?: string | null
          invoice_rejection_reason?: string | null
          net_amount: number
          period_end: string
          period_start: string
          status?: Database["public"]["Enums"]["settlement_status"]
          transferred_at?: string | null
          updated_at?: string
        }
        Update: {
          coach_id?: string
          commission?: number
          created_at?: string
          currency?: string
          gross_amount?: number
          id?: string
          invoice_number?: string | null
          invoice_path?: string | null
          invoice_rejection_reason?: string | null
          net_amount?: number
          period_end?: string
          period_start?: string
          status?: Database["public"]["Enums"]["settlement_status"]
          transferred_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlements_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          display_name: string | null
          goals: string[] | null
          id: string
          level: string | null
          parental_consent_at: string | null
          parental_email: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          display_name?: string | null
          goals?: string[] | null
          id?: string
          level?: string | null
          parental_consent_at?: string | null
          parental_email?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          display_name?: string | null
          goals?: string[] | null
          id?: string
          level?: string | null
          parental_consent_at?: string | null
          parental_email?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          gateway: string
          gateway_subscription_id: string | null
          id: string
          plan: string
          platform: string
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          gateway: string
          gateway_subscription_id?: string | null
          id?: string
          plan?: string
          platform: string
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          gateway?: string
          gateway_subscription_id?: string | null
          id?: string
          plan?: string
          platform?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          body: string
          created_at: string
          id: string
          resolved_at: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          resolved_at?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          resolved_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          country: Database["public"]["Enums"]["country_code"]
          created_at: string
          deleted_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          country?: Database["public"]["Enums"]["country_code"]
          created_at?: string
          deleted_at?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          country?: Database["public"]["Enums"]["country_code"]
          created_at?: string
          deleted_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      workout_sessions: {
        Row: {
          client_uuid: string
          completed_at: string | null
          created_at: string
          id: string
          routine_id: string | null
          sets_data: Json
          started_at: string
          status: Database["public"]["Enums"]["workout_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          client_uuid: string
          completed_at?: string | null
          created_at?: string
          id?: string
          routine_id?: string | null
          sets_data?: Json
          started_at?: string
          status?: Database["public"]["Enums"]["workout_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          client_uuid?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          routine_id?: string | null
          sets_data?: Json
          started_at?: string
          status?: Database["public"]["Enums"]["workout_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_coach_profile_id: { Args: never; Returns: string }
      auth_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      coach_has_active_assignment: {
        Args: { p_coach_id: string; p_student_id: string }
        Returns: boolean
      }
      student_has_pro_or_elite_package: {
        Args: { p_coach_id: string; p_student_id: string }
        Returns: boolean
      }
    }
    Enums: {
      assignment_status:
        | "pending"
        | "active"
        | "completed"
        | "refunded"
        | "canceled"
      billing_model: "fixed" | "comision"
      coach_status: "pending" | "approved" | "rejected" | "suspended"
      country_code: "AR" | "CL"
      legal_entity_type:
        | "monotributo"
        | "responsable_inscripto"
        | "empresa"
        | "otro"
      notification_channel: "push" | "email" | "in_app"
      package_tier: "starter" | "pro" | "elite"
      payment_status:
        | "pending"
        | "approved"
        | "rejected"
        | "refunded"
        | "in_process"
      settlement_status:
        | "pending"
        | "pending_invoice"
        | "invoiced"
        | "transferred"
        | "approved"
        | "rejected"
      subscription_status: "active" | "past_due" | "canceled" | "trialing"
      user_role: "student" | "coach" | "owner" | "promoter"
      workout_status: "in_progress" | "completed" | "abandoned"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      assignment_status: [
        "pending",
        "active",
        "completed",
        "refunded",
        "canceled",
      ],
      billing_model: ["fixed", "comision"],
      coach_status: ["pending", "approved", "rejected", "suspended"],
      country_code: ["AR", "CL"],
      legal_entity_type: [
        "monotributo",
        "responsable_inscripto",
        "empresa",
        "otro",
      ],
      notification_channel: ["push", "email", "in_app"],
      package_tier: ["starter", "pro", "elite"],
      payment_status: [
        "pending",
        "approved",
        "rejected",
        "refunded",
        "in_process",
      ],
      settlement_status: [
        "pending",
        "pending_invoice",
        "invoiced",
        "transferred",
        "approved",
        "rejected",
      ],
      subscription_status: ["active", "past_due", "canceled", "trialing"],
      user_role: ["student", "coach", "owner", "promoter"],
      workout_status: ["in_progress", "completed", "abandoned"],
    },
  },
} as const

// Alias de conveniencia de los enums de la DB.
// DERIVADOS de Database para no perderlos ni driftear al regenerar tipos (pnpm db:types).
export type UserRole = Database["public"]["Enums"]["user_role"];
export type CountryCode = Database["public"]["Enums"]["country_code"];
export type SubscriptionStatus = Database["public"]["Enums"]["subscription_status"];
export type BillingModel = Database["public"]["Enums"]["billing_model"];
export type CoachStatus = Database["public"]["Enums"]["coach_status"];
export type PackageTier = Database["public"]["Enums"]["package_tier"];
export type AssignmentStatus = Database["public"]["Enums"]["assignment_status"];
export type PaymentStatus = Database["public"]["Enums"]["payment_status"];
export type SettlementStatus = Database["public"]["Enums"]["settlement_status"];
export type WorkoutStatus = Database["public"]["Enums"]["workout_status"];
export type LegalEntityType = Database["public"]["Enums"]["legal_entity_type"];
export type NotificationChannel = Database["public"]["Enums"]["notification_channel"];
// No existe enum en DB: plan de suscripción es un literal de dominio.
export type SubscriptionPlan = "free" | "pro" | "elite";

