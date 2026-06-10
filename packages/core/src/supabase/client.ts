// Supabase client — helper tipado compartido
// La instancia real la crean las apps (no crear instancia aquí)

export type SupabaseClientConfig = {
  url: string;
  anonKey: string;
};
