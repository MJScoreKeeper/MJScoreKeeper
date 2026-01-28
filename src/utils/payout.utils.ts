/**
 * Calculate payout amount based on faan count.
 *
 * Payout formula (一二蚊):
 * - 3 faan: $32
 * - 4 faan: $64
 * - 5 faan: $128
 * - 6 faan: $256
 * - 7 faan: $512
 * - 8+ faan: $1,024 (cap)
 *
 * @param faan - Number of faan in the winning hand
 * @returns Payout amount in dollars
 */
export function calculatePayout(faan: number): number {
  if (faan < 3) return 0; // Minimum 3 faan required
  if (faan >= 8) return 1024; // Cap at $1,024
  return 32 * Math.pow(2, faan - 3);
}
