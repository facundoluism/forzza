// Tipos generados por supabase gen types
// Este archivo se regenera con: pnpm db:types
// NO EDITAR A MANO

// Placeholder hasta que la DB esté configurada (Fase 2)
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
