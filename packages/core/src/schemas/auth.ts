import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const onboardingStudentSchema = z.object({
  display_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  goals: z.array(z.string()).min(1, "Elegí al menos un objetivo"),
  level: z.enum(["principiante", "intermedio", "avanzado"]),
});

export const parentalConsentSchema = z.object({
  parental_email: z.string().email("Email del adulto inválido"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "El adulto debe aceptar los términos" }),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type OnboardingStudentInput = z.infer<typeof onboardingStudentSchema>;
export type ParentalConsentInput = z.infer<typeof parentalConsentSchema>;

// Regla: menor de 18 necesita consentimiento parental
export function isMinor(birthDate: string): boolean {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 < 18;
  }
  return age < 18;
}
