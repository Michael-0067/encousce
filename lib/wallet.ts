import { db } from "./prisma";

export async function getUserBalance(userId: string): Promise<number> {
  const result = await db.ledgerEntry.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  return result._sum.amount ?? 0;
}
