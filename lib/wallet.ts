import { db } from "./prisma";

/** Precise float balance — sum of all ledger entries. Source of truth. */
export async function getUserBalance(userId: string): Promise<number> {
  const result = await db.ledgerEntry.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  return result._sum.amount ?? 0;
}

/** Whole-heart spendable balance — floor of precise balance. Use in spend UX. */
export async function getSpendableBalance(userId: string): Promise<number> {
  return Math.floor(await getUserBalance(userId));
}

/** Truncate to 3 decimal places (floor, not round) for profile display. */
export function formatPreciseBalance(n: number): string {
  return (Math.floor(n * 1000) / 1000).toFixed(3);
}
