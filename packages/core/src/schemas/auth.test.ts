import { describe, it, expect } from "vitest";
import { loginSchema, signupSchema, isMinor } from "./auth";

describe("loginSchema", () => {
  it("valida email y contraseña correctos", () => {
    const result = loginSchema.safeParse({ email: "test@test.com", password: "password123" });
    expect(result.success).toBe(true);
  });

  it("rechaza email inválido", () => {
    const result = loginSchema.safeParse({ email: "no-es-email", password: "password123" });
    expect(result.success).toBe(false);
  });

  it("rechaza contraseña corta", () => {
    const result = loginSchema.safeParse({ email: "test@test.com", password: "abc" });
    expect(result.success).toBe(false);
  });
});

describe("signupSchema", () => {
  it("rechaza contraseñas distintas", () => {
    const result = signupSchema.safeParse({
      email: "test@test.com",
      password: "password123",
      confirmPassword: "diferente456",
    });
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toBe("Las contraseñas no coinciden");
  });

  it("acepta contraseñas iguales", () => {
    const result = signupSchema.safeParse({
      email: "test@test.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
  });
});

describe("isMinor", () => {
  it("detecta menor de 18", () => {
    const today = new Date();
    const minor = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    const isoDate = minor.toISOString().slice(0, 10);
    expect(isMinor(isoDate)).toBe(true);
  });

  it("detecta mayor de 18", () => {
    const today = new Date();
    const adult = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
    const isoDate = adult.toISOString().slice(0, 10);
    expect(isMinor(isoDate)).toBe(false);
  });

  it("exactamente 18 años NO es menor", () => {
    const today = new Date();
    const exactly18 = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const isoDate = exactly18.toISOString().slice(0, 10);
    expect(isMinor(isoDate)).toBe(false);
  });
});
