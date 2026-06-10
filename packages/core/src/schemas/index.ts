import { z } from "zod";

// Schemas Zod compartidos — TODO: expandir en Fase 3
export const emailSchema = z.string().email();

export const userRoleSchema = z.enum(["student", "coach", "owner", "promoter"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const countrySchema = z.enum(["AR", "CL"]);
export type Country = z.infer<typeof countrySchema>;
