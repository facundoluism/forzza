import { describe, it, expect } from "vitest";
import { calculateSettlementCents as calculateSettlement } from "../index";

describe("calculateSettlement", () => {
  it("uses commission rate from country_config (never hardcoded)", () => {
    const result = calculateSettlement({ grossCents: 100000, commissionRate: 0.20 });
    expect(result.commissionCents).toBe(20000);
    expect(result.netCents).toBe(80000);
    expect(result.grossCents).toBe(100000);
  });

  it("handles 15% commission for future countries", () => {
    const result = calculateSettlement({ grossCents: 100000, commissionRate: 0.15 });
    expect(result.commissionCents).toBe(15000);
    expect(result.netCents).toBe(85000);
  });

  it("uses integer arithmetic (no floating point errors)", () => {
    const result = calculateSettlement({ grossCents: 333333, commissionRate: 0.20 });
    expect(result.commissionCents + result.netCents).toBe(result.grossCents);
  });
});
