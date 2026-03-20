import { Prisma } from "@prisma/client";
import { db } from "./prisma";

/**
 * Precise Decimal balance — sum of all ledger entries.
 * Returns a Prisma.Decimal for exact arithmetic downstream.
 */
export async function getUserBalance(userId: string): Promise<Prisma.Decimal> {
  const result = await db.ledgerEntry.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  return result._sum.amount ?? new Prisma.Decimal(0);
}

/**
 * Whole-heart spendable balance — floor of precise Decimal balance.
 * Use this everywhere spend UX is involved (chat, checks, header).
 */
export async function getSpendableBalance(userId: string): Promise<number> {
  const precise = await getUserBalance(userId);
  return precise.floor().toNumber();
}

/**
 * Format precise balance to exactly 3 decimal places, truncated (not rounded).
 * e.g. 12.98791 → "12.987"
 */
export function formatPreciseBalance(d: Prisma.Decimal): string {
  // ROUND_DOWN (1) truncates toward zero — no rounding up
  return d.toDecimalPlaces(3, 1).toFixed(3);
}
