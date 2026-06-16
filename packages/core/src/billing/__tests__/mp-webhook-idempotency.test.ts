/**
 * mp-webhook-idempotency.test.ts — Tests de integración del handler del webhook MP.
 *
 * ESTRUCTURA:
 *   describe #1 "Firma HMAC-SHA256"                   — puro, siempre corre
 *   describe #2 "Mapeo de status MP → Forzza"         — stub DB, siempre corre
 *   describe #3 "Idempotencia real contra Postgres"   — opt-in con RUN_DB_TESTS=1
 *   describe #4 "Comportamiento del handler (stub DB)" — stub, siempre corre
 *
 * Para correr los tests de integración contra la DB local:
 *   RUN_DB_TESTS=1 pnpm --filter @forzza/core test
 *   (o via: pnpm test:webhooks desde la raíz)
 *
 * Requiere: supabase start (Docker con supabase/config.toml)
 * DB en: postgresql://postgres:postgres@127.0.0.1:54322/postgres
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import pg from "pg";
import { handleMpWebhook, type WebhookDbClient } from "../mp-webhook-handler.js";
import { MockMercadoPago } from "../mock-mercadopago.js";
import { validateMpSignature } from "../mp.js";

const { Pool } = pg;

// ─── Configuración de DB local ────────────────────────────────────────────────

const DB_URL =
  process.env["SUPABASE_DB_URL"] ??
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

// ─── Implementación del WebhookDbClient sobre pg ─────────────────────────────

function makePgDbClient(pool: pg.Pool): WebhookDbClient {
  return {
    async insertProcessedEvent(
      eventId: string,
      gateway: string
    ): Promise<"ok" | "duplicate" | "error"> {
      try {
        await pool.query(
          `INSERT INTO processed_events (event_id, gateway) VALUES ($1, $2)`,
          [eventId, gateway]
        );
        return "ok";
      } catch (err: unknown) {
        // PostgreSQL error code 23505 = unique_violation
        if (
          err instanceof Error &&
          (err as unknown as { code?: string }).code === "23505"
        ) {
          return "duplicate";
        }
        console.error("[test] processed_events insert error:", err);
        return "error";
      }
    },

    async updateSubscription(
      gatewaySubscriptionId: string,
      status: string,
      periodStart: string,
      periodEnd: string
    ): Promise<void> {
      await pool.query(
        `UPDATE subscriptions
         SET status = $1::subscription_status,
             current_period_start = $2,
             current_period_end = $3,
             updated_at = now()
         WHERE gateway_subscription_id = $4`,
        [status, periodStart, periodEnd, gatewaySubscriptionId]
      );
    },

    async insertAuditLog(entry: {
      actor_id: null;
      action: string;
      entity_type: string;
      entity_id: null;
      payload: Record<string, unknown>;
    }): Promise<void> {
      await pool.query(
        `INSERT INTO audit_log (actor_id, action, entity_type, entity_id, payload)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          entry.actor_id,
          entry.action,
          entry.entity_type,
          entry.entity_id,
          JSON.stringify(entry.payload),
        ]
      );
    },
  };
}

// ─── Estado compartido para los describes PUROS (sin DB) ─────────────────────
// El MockMercadoPago es puro (sin red, sin DB) — se inicializa una sola vez
// y se reutiliza en los cuatro describes.

let mp: MockMercadoPago;

beforeAll(() => {
  mp = new MockMercadoPago("integration-test-webhook-secret");
});

beforeEach(() => {
  // El mock tiene estado interno (preapprovals creados), lo reseteamos entre tests
  mp.reset();
});

// ─── Helper compartido (no toca DB) ──────────────────────────────────────────

async function makeHandlerOpts(
  eventId: string,
  preapprovalId: string,
  db: WebhookDbClient,
  mpStatus = "authorized"
) {
  const body = {
    id: eventId,
    type: "preapproval" as const,
    data: { id: preapprovalId },
  };

  const { xSignature, xRequestId } = await mp.generateWebhookHeaders(eventId);

  mp.setPreapprovalStatus(preapprovalId, mpStatus as never);

  return {
    secret: mp.getWebhookSecret(),
    xSignature,
    xRequestId,
    body,
    fetchPreapproval: async (id: string) => mp.getPreapproval(id),
    db,
  };
}

// ─── describe #1: Firma HMAC-SHA256 (puro, sin DB) ───────────────────────────

describe("Firma HMAC-SHA256", () => {
  it("firma válida → handler devuelve 200", async () => {
    const dbClient: WebhookDbClient = {
      async insertProcessedEvent() { return "ok"; },
      async updateSubscription() {},
      async insertAuditLog() {},
    };

    const plan = mp.createPreapprovalPlan({
      reason: "test",
      auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: 9999, currency_id: "ARS" },
      payer_email: "test@forzza.app",
      back_url: "https://forzza.app",
    });

    const opts = await makeHandlerOpts("test-sig-001", plan.id, dbClient);
    const result = await handleMpWebhook(opts);
    expect(result.status).toBe(200);
  });

  it("sin x-signature → 401 Unauthorized", async () => {
    const dbClient: WebhookDbClient = {
      async insertProcessedEvent() { return "ok"; },
      async updateSubscription() {},
      async insertAuditLog() {},
    };

    const result = await handleMpWebhook({
      secret: "some-secret",
      xSignature: null,
      xRequestId: "req-123",
      body: { id: "evt-001", type: "preapproval" },
      fetchPreapproval: async (id) => mp.getPreapproval(id),
      db: dbClient,
    });

    expect(result.status).toBe(401);
    expect(result.body).toBe("Unauthorized");
  });

  it("x-signature ausente completamente → 401", async () => {
    const dbClient: WebhookDbClient = {
      async insertProcessedEvent() { return "ok"; },
      async updateSubscription() {},
      async insertAuditLog() {},
    };

    const result = await handleMpWebhook({
      secret: "some-secret",
      xSignature: null,
      xRequestId: null,
      body: { id: "evt-002" },
      fetchPreapproval: async (id) => mp.getPreapproval(id),
      db: dbClient,
    });

    expect(result.status).toBe(401);
  });

  it("x-signature con hash incorrecto → 401", async () => {
    const dbClient: WebhookDbClient = {
      async insertProcessedEvent() { return "ok"; },
      async updateSubscription() {},
      async insertAuditLog() {},
    };

    const result = await handleMpWebhook({
      secret: "correct-secret",
      xSignature:
        "ts=1704067200,v1=0000000000000000000000000000000000000000000000000000000000000000",
      xRequestId: "req-123",
      body: { id: "evt-003" },
      fetchPreapproval: async (id) => mp.getPreapproval(id),
      db: dbClient,
    });

    expect(result.status).toBe(401);
  });

  it("x-signature firmado con secret diferente → 401", async () => {
    const dbClient: WebhookDbClient = {
      async insertProcessedEvent() { return "ok"; },
      async updateSubscription() {},
      async insertAuditLog() {},
    };

    // Generar firma con el secret del mock
    const { xSignature, xRequestId } = await mp.generateWebhookHeaders("evt-004");

    // Validar con un secret diferente → debe rechazar
    const result = await handleMpWebhook({
      secret: "wrong-secret-completely-different",
      xSignature,
      xRequestId,
      body: { id: "evt-004" },
      fetchPreapproval: async (id) => mp.getPreapproval(id),
      db: dbClient,
    });

    expect(result.status).toBe(401);
  });

  it("secret vacío → 500 Internal configuration error", async () => {
    const dbClient: WebhookDbClient = {
      async insertProcessedEvent() { return "ok"; },
      async updateSubscription() {},
      async insertAuditLog() {},
    };

    const result = await handleMpWebhook({
      secret: "",
      xSignature: "ts=1,v1=abc",
      xRequestId: "req",
      body: { id: "evt-005" },
      fetchPreapproval: async (id) => mp.getPreapproval(id),
      db: dbClient,
    });

    expect(result.status).toBe(500);
    expect(result.body).toBe("Internal configuration error");
  });
});

// ─── describe #2: Mapeo de status MP → Forzza (stub DB) ──────────────────────

describe("Mapeo de status MP → Forzza (stub DB)", () => {
  interface StatusCapture {
    lastStatus?: string;
  }

  function makeCapturingDb(capture: StatusCapture): WebhookDbClient {
    return {
      async insertProcessedEvent() { return "ok"; },
      async updateSubscription(_id, status) {
        capture.lastStatus = status;
      },
      async insertAuditLog() {},
    };
  }

  const statusCases: Array<[string, string]> = [
    ["authorized", "active"],
    ["paused", "past_due"],
    ["cancelled", "canceled"],
    ["pending", "trialing"],
    ["unknown_future_status", "trialing"],
  ];

  for (const [mpStatus, expectedForzza] of statusCases) {
    it(`MP "${mpStatus}" → Forzza "${expectedForzza}"`, async () => {
      const capture: StatusCapture = {};
      const db = makeCapturingDb(capture);

      const plan = mp.createPreapprovalPlan({
        reason: "test",
        auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: 9999, currency_id: "ARS" },
        payer_email: "x@test.com",
        back_url: "https://forzza.app",
      });

      const opts = await makeHandlerOpts(
        `test-status-${mpStatus}`,
        plan.id,
        db,
        mpStatus
      );
      await handleMpWebhook(opts);

      expect(capture.lastStatus).toBe(expectedForzza);
    });
  }
});

// ─── describe #3: Idempotencia real contra Postgres (opt-in con RUN_DB_TESTS=1)

describe.runIf(process.env["RUN_DB_TESTS"] === "1")(
  "Idempotencia real contra Postgres local (constraint UNIQUE)",
  () => {
    // Pool y hooks de DB DENTRO del describe para no contaminar los describe puros.
    let pool: pg.Pool;

    beforeAll(async () => {
      pool = new Pool({ connectionString: DB_URL, connectionTimeoutMillis: 5000 });
      // Ping explícito: si la DB no está, el error falla el suite con mensaje claro.
      await pool.query("SELECT 1");
    });

    afterAll(async () => {
      await pool.end();
    });

    beforeEach(async () => {
      // mp ya fue reseteado por el beforeEach de nivel de archivo.
      // Limpiar filas de test para aislar cada test de DB.
      await pool.query(
        `DELETE FROM processed_events WHERE event_id LIKE 'test-idem-%'`
      );
      await pool.query(
        `DELETE FROM audit_log WHERE payload->>'event_id' LIKE 'test-idem-%'`
      );
    });

    it("mismo evento ×3 → 1 sola fila en processed_events", async () => {
      const db = makePgDbClient(pool);
      const eventId = "test-idem-001";

      const plan = mp.createPreapprovalPlan({
        reason: "Forzza PRO",
        auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: 9999, currency_id: "ARS" },
        payer_email: "idem@test.com",
        back_url: "https://forzza.app",
      });

      // Enviar el mismo evento 3 veces
      const results = [];
      for (let i = 0; i < 3; i++) {
        const opts = await makeHandlerOpts(eventId, plan.id, db);
        results.push(await handleMpWebhook(opts));
      }

      // Los 3 devuelven 200 (el duplicado retorna 200 igual, no 4xx)
      for (const r of results) {
        expect(r.status).toBe(200);
      }

      // Solo 1 fila en processed_events
      const { rows } = await pool.query(
        `SELECT COUNT(*) as cnt FROM processed_events WHERE event_id = $1`,
        [eventId]
      );
      expect(Number(rows[0].cnt)).toBe(1);
    });

    it("mismo evento ×3 → 1 solo insert en audit_log", async () => {
      const db = makePgDbClient(pool);
      const eventId = "test-idem-002";

      const plan = mp.createPreapprovalPlan({
        reason: "Coach Test",
        auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: 5000, currency_id: "ARS" },
        payer_email: "idem2@test.com",
        back_url: "https://forzza.app",
      });

      for (let i = 0; i < 3; i++) {
        const opts = await makeHandlerOpts(eventId, plan.id, db);
        await handleMpWebhook(opts);
      }

      // Solo 1 entrada en audit_log para este event_id
      const { rows } = await pool.query(
        `SELECT COUNT(*) as cnt FROM audit_log
         WHERE payload->>'event_id' = $1`,
        [eventId]
      );
      expect(Number(rows[0].cnt)).toBe(1);
    });

    it("eventos diferentes → filas independientes en processed_events", async () => {
      const db = makePgDbClient(pool);

      const plan = mp.createPreapprovalPlan({
        reason: "test",
        auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: 9999, currency_id: "ARS" },
        payer_email: "x@test.com",
        back_url: "https://forzza.app",
      });

      const eventIds = ["test-idem-003", "test-idem-004", "test-idem-005"];

      for (const eventId of eventIds) {
        const opts = await makeHandlerOpts(eventId, plan.id, db);
        const result = await handleMpWebhook(opts);
        expect(result.status).toBe(200);
      }

      const { rows } = await pool.query(
        `SELECT COUNT(*) as cnt FROM processed_events
         WHERE event_id = ANY($1::text[])`,
        [eventIds]
      );
      expect(Number(rows[0].cnt)).toBe(3);
    });

    it("evento duplicado no modifica la suscripción la 2ª vez", async () => {
      const updateCalls: string[] = [];
      let insertCallCount = 0;
      const realPgDb = makePgDbClient(pool);

      const wrappedDb: WebhookDbClient = {
        async insertProcessedEvent(eventId, gateway) {
          insertCallCount++;
          return realPgDb.insertProcessedEvent(eventId, gateway);
        },
        async updateSubscription(id, status, start, end) {
          updateCalls.push(status);
          return realPgDb.updateSubscription(id, status, start, end);
        },
        async insertAuditLog(entry) {
          return realPgDb.insertAuditLog(entry);
        },
      };

      const eventId = "test-idem-006";
      const plan = mp.createPreapprovalPlan({
        reason: "test dup no-update",
        auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: 9999, currency_id: "ARS" },
        payer_email: "dup@test.com",
        back_url: "https://forzza.app",
      });

      // Primera vez
      const opts1 = await makeHandlerOpts(eventId, plan.id, wrappedDb);
      await handleMpWebhook(opts1);

      // Segunda vez (mismo evento)
      const opts2 = await makeHandlerOpts(eventId, plan.id, wrappedDb);
      await handleMpWebhook(opts2);

      // Tercera vez
      const opts3 = await makeHandlerOpts(eventId, plan.id, wrappedDb);
      await handleMpWebhook(opts3);

      // insertProcessedEvent se llama 3 veces (con éxito solo la 1ª)
      expect(insertCallCount).toBe(3);
      // updateSubscription se llama solo 1 vez (la 2ª y 3ª retornan en el guard de duplicate)
      expect(updateCalls).toHaveLength(1);
    });

    it("concurrencia: N handlers paralelos con el mismo event_id → 1 efecto", async () => {
      const db = makePgDbClient(pool);
      const eventId = "test-idem-007";

      const plan = mp.createPreapprovalPlan({
        reason: "concurrent test",
        auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: 9999, currency_id: "ARS" },
        payer_email: "concurrent@test.com",
        back_url: "https://forzza.app",
      });

      // Disparar 5 handlers simultáneamente con el mismo event_id
      const promises = Array.from({ length: 5 }, async () => {
        const opts = await makeHandlerOpts(eventId, plan.id, db);
        return handleMpWebhook(opts);
      });

      const results = await Promise.all(promises);

      // Todos devuelven 200
      for (const r of results) {
        expect(r.status).toBe(200);
      }

      // Solo 1 fila en processed_events a pesar de los 5 intentos simultáneos
      const { rows } = await pool.query(
        `SELECT COUNT(*) as cnt FROM processed_events WHERE event_id = $1`,
        [eventId]
      );
      expect(Number(rows[0].cnt)).toBe(1);
    });
  }
);

// ─── describe #4: Comportamiento del handler (stub DB) ───────────────────────

describe("Comportamiento del handler (stub DB)", () => {
  const stubDb: WebhookDbClient = {
    async insertProcessedEvent() { return "ok"; },
    async updateSubscription() {},
    async insertAuditLog() {},
  };

  it("body sin id ni data.id → 200 sin procesar nada", async () => {
    const { xSignature, xRequestId } = await mp.generateWebhookHeaders("req-noid");

    const result = await handleMpWebhook({
      secret: mp.getWebhookSecret(),
      xSignature,
      xRequestId,
      body: { type: "preapproval" }, // sin id
      fetchPreapproval: async (id) => mp.getPreapproval(id),
      db: stubDb,
    });

    expect(result.status).toBe(200);
  });

  it("body con type diferente a preapproval → 200 sin llamar fetchPreapproval", async () => {
    const eventId = "evt-other-type";
    const { xSignature, xRequestId } = await mp.generateWebhookHeaders(eventId);

    let fetchCalled = false;
    const trackingDb: WebhookDbClient = {
      async insertProcessedEvent() { return "ok"; },
      async updateSubscription() {},
      async insertAuditLog() {},
    };

    const result = await handleMpWebhook({
      secret: mp.getWebhookSecret(),
      xSignature,
      xRequestId,
      body: { id: eventId, type: "payment" }, // no es preapproval
      fetchPreapproval: async (id) => {
        fetchCalled = true;
        return mp.getPreapproval(id);
      },
      db: trackingDb,
    });

    expect(result.status).toBe(200);
    expect(fetchCalled).toBe(false);
  });

  it("error de DB → 500 Internal error", async () => {
    const errorDb: WebhookDbClient = {
      async insertProcessedEvent() { return "error"; },
      async updateSubscription() {},
      async insertAuditLog() {},
    };

    const eventId = "evt-db-error";
    const { xSignature, xRequestId } = await mp.generateWebhookHeaders(eventId);

    const result = await handleMpWebhook({
      secret: mp.getWebhookSecret(),
      xSignature,
      xRequestId,
      body: { id: eventId, type: "preapproval" },
      fetchPreapproval: async (id) => mp.getPreapproval(id),
      db: errorDb,
    });

    expect(result.status).toBe(500);
    expect(result.body).toBe("Internal error");
  });

  it("el gateway se registra correctamente en processed_events", async () => {
    const capturedGateway: string[] = [];
    const capturingDb: WebhookDbClient = {
      async insertProcessedEvent(_, gateway) {
        capturedGateway.push(gateway);
        return "ok";
      },
      async updateSubscription() {},
      async insertAuditLog() {},
    };

    const eventId = "evt-gateway-check";
    const { xSignature, xRequestId } = await mp.generateWebhookHeaders(eventId);

    await handleMpWebhook({
      secret: mp.getWebhookSecret(),
      xSignature,
      xRequestId,
      body: { id: eventId },
      fetchPreapproval: async (id) => mp.getPreapproval(id),
      db: capturingDb,
      gateway: "mercadopago",
    });

    expect(capturedGateway).toEqual(["mercadopago"]);
  });

  it("validateMpSignature de mp.ts y generateWebhookHeaders del mock son compatibles", async () => {
    const mp2 = new MockMercadoPago("compat-secret-xyz");
    const { xSignature, xRequestId } = await mp2.generateWebhookHeaders(
      "compat-event-001"
    );

    const valid = await validateMpSignature(
      mp2.getWebhookSecret(),
      xSignature,
      xRequestId
    );

    expect(valid).toBe(true);
  });
});
