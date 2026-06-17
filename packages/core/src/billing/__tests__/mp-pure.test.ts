/**
 * mp-pure.test.ts — Tests unitarios puros para lógica de MP.
 *
 * Sin red. Sin DB. Sin Deno. Corre con Vitest en Node.js.
 * Cubre: parseo de firma, mapeo de status, generación de firma, validación.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  parseMpSignatureHeader,
  buildMpSignedMessage,
  computeHmacSha256Hex,
  constantTimeEqual,
  validateMpSignature,
  generateMpSignatureHeader,
  mapMpStatus,
  extractMpEventId,
  MP_STATUS_MAP,
} from "../mp.js";
import { MockMercadoPago } from "../mock-mercadopago.js";

// ─── parseMpSignatureHeader ───────────────────────────────────────────────────

describe("parseMpSignatureHeader", () => {
  it("parsea un header válido", () => {
    const result = parseMpSignatureHeader("ts=1704067200,v1=abcdef1234");
    expect(result).toEqual({ ts: "1704067200", v1: "abcdef1234" });
  });

  it("parsea header con espacios alrededor del = y ,", () => {
    // MP puede enviar ligeras variaciones de formato
    const result = parseMpSignatureHeader("ts=111,v1=222");
    expect(result).toEqual({ ts: "111", v1: "222" });
  });

  it("devuelve null si falta ts", () => {
    expect(parseMpSignatureHeader("v1=abcdef")).toBeNull();
  });

  it("devuelve null si falta v1", () => {
    expect(parseMpSignatureHeader("ts=1704067200")).toBeNull();
  });

  it("devuelve null si el string está vacío", () => {
    expect(parseMpSignatureHeader("")).toBeNull();
  });

  it("devuelve null si el formato es completamente diferente", () => {
    expect(parseMpSignatureHeader("nope")).toBeNull();
  });

  it("parsea correctamente cuando hay más de 2 partes", () => {
    // Futuras versiones de MP podrían agregar más campos
    const result = parseMpSignatureHeader("ts=123,v1=abc,extra=xyz");
    expect(result).toEqual({ ts: "123", v1: "abc" });
  });
});

// ─── buildMpSignedMessage ─────────────────────────────────────────────────────

describe("buildMpSignedMessage", () => {
  // Test de regresión: fija el formato exacto del manifest correcto de MP.
  // Si este test falla, el manifest está roto y NINGÚN webhook real de MP pasará.
  it("REGRESION: formato exacto id:X;request-id:Y;ts:Z; con todos los campos presentes", () => {
    const msg = buildMpSignedMessage("12345678", "req-abc-123", "1704067200");
    expect(msg).toBe("id:12345678;request-id:req-abc-123;ts:1704067200;");
  });

  it("lowercase de dataId si es alfanumérico", () => {
    const msg = buildMpSignedMessage("AbCdEf123", "req-xyz", "999");
    expect(msg).toBe("id:abcdef123;request-id:req-xyz;ts:999;");
  });

  it("omite el segmento id: si dataId es null", () => {
    const msg = buildMpSignedMessage(null, "req-abc-123", "1704067200");
    expect(msg).toBe("request-id:req-abc-123;ts:1704067200;");
  });

  it("omite el segmento request-id: si requestId es null", () => {
    const msg = buildMpSignedMessage("12345678", null, "1704067200");
    expect(msg).toBe("id:12345678;ts:1704067200;");
  });

  it("REGRESION: solo ts si dataId y requestId son null (siempre incluye ts)", () => {
    const msg = buildMpSignedMessage(null, null, "1704067200");
    expect(msg).toBe("ts:1704067200;");
  });
});

// ─── computeHmacSha256Hex ─────────────────────────────────────────────────────

describe("computeHmacSha256Hex", () => {
  it("devuelve un hash hexadecimal de 64 caracteres", async () => {
    const hash = await computeHmacSha256Hex("secret", "message");
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]+$/);
  });

  it("es determinístico — mismo input mismo output", async () => {
    const h1 = await computeHmacSha256Hex("s", "m");
    const h2 = await computeHmacSha256Hex("s", "m");
    expect(h1).toBe(h2);
  });

  it("cambia con diferente secret", async () => {
    const h1 = await computeHmacSha256Hex("secret1", "message");
    const h2 = await computeHmacSha256Hex("secret2", "message");
    expect(h1).not.toBe(h2);
  });

  it("cambia con diferente message", async () => {
    const h1 = await computeHmacSha256Hex("secret", "message1");
    const h2 = await computeHmacSha256Hex("secret", "message2");
    expect(h1).not.toBe(h2);
  });

  it("produce el hash conocido para un vector de prueba", async () => {
    // Vector calculado independientemente: HMAC-SHA256("key", "The quick brown fox")
    // Verificable con: node -e "require('crypto').createHmac('sha256','key').update('The quick brown fox').digest('hex')" | node
    const hash = await computeHmacSha256Hex(
      "key",
      "The quick brown fox"
    );
    expect(hash).toBe(
      "203d1e5cedd2d18f8c5a3beff0bd9c1ebcb97097dfcb288c46b00c9227fde2c0"
    );
  });
});

// ─── constantTimeEqual ────────────────────────────────────────────────────────

describe("constantTimeEqual", () => {
  it("devuelve true para strings idénticos", () => {
    expect(constantTimeEqual("abc", "abc")).toBe(true);
  });

  it("devuelve false si los strings difieren", () => {
    expect(constantTimeEqual("abc", "abd")).toBe(false);
  });

  it("devuelve false si los strings tienen diferente longitud", () => {
    expect(constantTimeEqual("abc", "ab")).toBe(false);
    expect(constantTimeEqual("ab", "abc")).toBe(false);
  });

  it("devuelve true para strings vacíos", () => {
    expect(constantTimeEqual("", "")).toBe(true);
  });
});

// ─── validateMpSignature ──────────────────────────────────────────────────────

describe("validateMpSignature", () => {
  const SECRET = "test-webhook-secret-12345";

  it("valida una firma correcta con dataId, requestId y ts (manifest completo)", async () => {
    const ts = "1704067200";
    const dataId = "12345678";
    const requestId = "req-abc-123";
    const signedMessage = buildMpSignedMessage(dataId, requestId, ts);
    const hash = await computeHmacSha256Hex(SECRET, signedMessage);
    const xSignature = `ts=${ts},v1=${hash}`;

    const valid = await validateMpSignature(SECRET, xSignature, requestId, dataId);
    expect(valid).toBe(true);
  });

  it("valida firma con dataId ausente (solo request-id y ts)", async () => {
    const ts = "1704067200";
    const requestId = "req-abc-123";
    const signedMessage = buildMpSignedMessage(null, requestId, ts);
    const hash = await computeHmacSha256Hex(SECRET, signedMessage);
    const xSignature = `ts=${ts},v1=${hash}`;

    const valid = await validateMpSignature(SECRET, xSignature, requestId, null);
    expect(valid).toBe(true);
  });

  it("rechaza firma con hash incorrecto", async () => {
    const valid = await validateMpSignature(
      SECRET,
      "ts=1704067200,v1=0000000000000000000000000000000000000000000000000000000000000000",
      "req-abc-123",
      "12345678"
    );
    expect(valid).toBe(false);
  });

  it("rechaza cuando falta x-signature", async () => {
    const valid = await validateMpSignature(SECRET, null, "req-abc-123", "12345678");
    expect(valid).toBe(false);
  });

  it("rechaza x-signature con formato inválido (sin ts o v1)", async () => {
    const valid = await validateMpSignature(SECRET, "invalid-format", "req-id", "12345678");
    expect(valid).toBe(false);
  });

  it("lanza error si el secret está vacío", async () => {
    await expect(
      validateMpSignature("", "ts=1,v1=abc", "req-id", "12345678")
    ).rejects.toThrow("MP_WEBHOOK_SECRET is not configured");
  });

  it("rechaza firma con secret diferente", async () => {
    const ts = "1704067200";
    const dataId = "12345678";
    const requestId = "req-abc-123";
    const signedMessage = buildMpSignedMessage(dataId, requestId, ts);
    const hash = await computeHmacSha256Hex("wrong-secret", signedMessage);
    const xSignature = `ts=${ts},v1=${hash}`;

    const valid = await validateMpSignature(SECRET, xSignature, requestId, dataId);
    expect(valid).toBe(false);
  });

  it("rechaza si dataId difiere del usado en la firma (ataque de sustitución)", async () => {
    const ts = "1704067200";
    const dataId = "12345678";
    const requestId = "req-abc-123";
    const signedMessage = buildMpSignedMessage(dataId, requestId, ts);
    const hash = await computeHmacSha256Hex(SECRET, signedMessage);
    const xSignature = `ts=${ts},v1=${hash}`;

    // Intentar validar con un dataId diferente
    const valid = await validateMpSignature(SECRET, xSignature, requestId, "99999999");
    expect(valid).toBe(false);
  });
});

// ─── generateMpSignatureHeader ────────────────────────────────────────────────

describe("generateMpSignatureHeader", () => {
  it("genera un header que validateMpSignature acepta (manifest completo)", async () => {
    const SECRET = "mi-secreto-de-test";
    const dataId = "12345678";
    const requestId = "req-test-999";
    const ts = "1704067200";

    const xSignature = await generateMpSignatureHeader(SECRET, dataId, requestId, ts);
    const valid = await validateMpSignature(SECRET, xSignature, requestId, dataId);

    expect(valid).toBe(true);
  });

  it("genera un header que validateMpSignature acepta (sin dataId)", async () => {
    const SECRET = "mi-secreto-de-test";
    const requestId = "req-test-999";
    const ts = "1704067200";

    const xSignature = await generateMpSignatureHeader(SECRET, null, requestId, ts);
    const valid = await validateMpSignature(SECRET, xSignature, requestId, null);

    expect(valid).toBe(true);
  });

  it("el formato del header es ts=...,v1=...", async () => {
    const xSig = await generateMpSignatureHeader("s", "dataid", "reqid", "123");
    expect(xSig).toMatch(/^ts=123,v1=[0-9a-f]{64}$/);
  });
});

// ─── mapMpStatus ──────────────────────────────────────────────────────────────

describe("mapMpStatus", () => {
  it("authorized → active", () => {
    expect(mapMpStatus("authorized")).toBe("active");
  });

  it("paused → past_due", () => {
    expect(mapMpStatus("paused")).toBe("past_due");
  });

  it("cancelled → canceled (una sola l en Forzza)", () => {
    expect(mapMpStatus("cancelled")).toBe("canceled");
  });

  it("pending → trialing", () => {
    expect(mapMpStatus("pending")).toBe("trialing");
  });

  it("status desconocido → trialing (fallback seguro)", () => {
    expect(mapMpStatus("unknown_status")).toBe("trialing");
    expect(mapMpStatus("")).toBe("trialing");
    expect(mapMpStatus("AUTHORIZED")).toBe("trialing"); // case-sensitive
  });

  it("cubre todos los status del mapa MP_STATUS_MAP", () => {
    const allMpStatuses = Object.keys(MP_STATUS_MAP);
    expect(allMpStatuses).toHaveLength(4);
    for (const status of allMpStatuses) {
      const result = mapMpStatus(status);
      expect(["active", "past_due", "canceled", "trialing"]).toContain(result);
    }
  });
});

// ─── extractMpEventId ─────────────────────────────────────────────────────────

describe("extractMpEventId", () => {
  it("extrae id del campo id (número)", () => {
    expect(extractMpEventId({ id: 12345 })).toBe("12345");
  });

  it("extrae id del campo id (string)", () => {
    expect(extractMpEventId({ id: "abc-123" })).toBe("abc-123");
  });

  it("extrae id del campo data.id cuando body.id no existe", () => {
    expect(extractMpEventId({ data: { id: "data-id-456" } })).toBe(
      "data-id-456"
    );
  });

  it("prefiere body.id sobre data.id", () => {
    expect(
      extractMpEventId({ id: "top-level", data: { id: "nested" } })
    ).toBe("top-level");
  });

  it("devuelve null si no hay id en ningún lado", () => {
    expect(extractMpEventId({})).toBeNull();
    expect(extractMpEventId({ type: "preapproval" })).toBeNull();
    expect(extractMpEventId({ data: {} })).toBeNull();
  });
});

// ─── MockMercadoPago ──────────────────────────────────────────────────────────

describe("MockMercadoPago", () => {
  let mp: MockMercadoPago;

  beforeEach(() => {
    mp = new MockMercadoPago("test-secret-abc");
    mp.reset();
  });

  describe("createPreapprovalPlan", () => {
    it("devuelve id e init_point", () => {
      const result = mp.createPreapprovalPlan({
        reason: "Forzza PRO",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 9999,
          currency_id: "ARS",
        },
        payer_email: "test@example.com",
        back_url: "https://forzza.app/upgrade",
      });

      expect(result.id).toMatch(/^mock_preapproval_/);
      expect(result.init_point).toContain("mock.mercadopago.com");
      expect(result.init_point).toContain(result.id);
    });

    it("cada llamada genera un id único", () => {
      const r1 = mp.createPreapprovalPlan({
        reason: "test",
        auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: 100, currency_id: "ARS" },
        payer_email: "a@test.com",
        back_url: "https://forzza.app",
      });
      const r2 = mp.createPreapprovalPlan({
        reason: "test2",
        auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: 200, currency_id: "ARS" },
        payer_email: "b@test.com",
        back_url: "https://forzza.app",
      });
      expect(r1.id).not.toBe(r2.id);
    });
  });

  describe("getPreapproval", () => {
    it("devuelve status pending para un plan recién creado", () => {
      const plan = mp.createPreapprovalPlan({
        reason: "Forzza PRO",
        auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: 9999, currency_id: "ARS" },
        payer_email: "test@example.com",
        back_url: "https://forzza.app",
      });

      const preapproval = mp.getPreapproval(plan.id);
      expect(preapproval.id).toBe(plan.id);
      expect(preapproval.status).toBe("pending");
      expect(preapproval.date_created).toBeTruthy();
    });

    it("devuelve pending para id desconocido", () => {
      const result = mp.getPreapproval("unknown-id-999");
      expect(result.status).toBe("pending");
    });
  });

  describe("setPreapprovalStatus", () => {
    it("actualiza el status del preapproval", () => {
      const plan = mp.createPreapprovalPlan({
        reason: "test",
        auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: 100, currency_id: "ARS" },
        payer_email: "x@test.com",
        back_url: "https://forzza.app",
      });

      mp.setPreapprovalStatus(plan.id, "authorized");
      expect(mp.getPreapproval(plan.id).status).toBe("authorized");

      mp.setPreapprovalStatus(plan.id, "paused");
      expect(mp.getPreapproval(plan.id).status).toBe("paused");
    });
  });

  describe("generateWebhookHeaders", () => {
    it("genera headers que pasan validateMpSignature (manifest completo)", async () => {
      const dataId = "12345678";
      const { xSignature, xRequestId, dataId: retDataId } =
        await mp.generateWebhookHeaders(dataId);

      const valid = await validateMpSignature(
        mp.getWebhookSecret(),
        xSignature,
        xRequestId,
        retDataId
      );

      expect(valid).toBe(true);
    });

    it("xRequestId usa el prefijo req- por defecto", async () => {
      const { xRequestId } = await mp.generateWebhookHeaders("evt-abc");
      expect(xRequestId).toBe("req-evt-abc");
    });

    it("dataId retornado coincide con el dataId pasado", async () => {
      const { dataId: retDataId } = await mp.generateWebhookHeaders("99999");
      expect(retDataId).toBe("99999");
    });

    it("con requestId y ts explícitos genera un header determinístico", async () => {
      const { xSignature: s1 } = await mp.generateWebhookHeaders("evt", "req-custom", "123");
      const { xSignature: s2 } = await mp.generateWebhookHeaders("evt", "req-custom", "123");
      expect(s1).toBe(s2);
    });
  });

  describe("reset", () => {
    it("limpia todos los preapprovals del almacén", () => {
      const plan = mp.createPreapprovalPlan({
        reason: "test",
        auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: 100, currency_id: "ARS" },
        payer_email: "x@test.com",
        back_url: "https://forzza.app",
      });
      mp.setPreapprovalStatus(plan.id, "authorized");

      mp.reset();

      // Después del reset, el id ya no está en el almacén → devuelve "pending" por defecto
      expect(mp.getPreapproval(plan.id).status).toBe("pending");
    });

    it("reinicia el contador de ids", () => {
      const p1 = mp.createPreapprovalPlan({
        reason: "r",
        auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: 1, currency_id: "ARS" },
        payer_email: "a@b.com",
        back_url: "https://x.com",
      });

      mp.reset();

      const p2 = mp.createPreapprovalPlan({
        reason: "r",
        auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: 1, currency_id: "ARS" },
        payer_email: "a@b.com",
        back_url: "https://x.com",
      });

      // Después del reset los ids vuelven a empezar desde 1 → mismo id
      expect(p1.id).toBe(p2.id);
    });
  });
});
