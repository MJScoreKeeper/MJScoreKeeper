/**
 * Calculate payout amount based on faan count.
 *
 * Payout formula:
 * - 3 faan: $16
 * - 4 faan: $32
 * - 5 faan: $64
 * - 6 faan: $128
 * - 7 faan: $256
 * - 8 faan: $512
 * - 9+ faan: $1,024 (cap)
 *
 * @param faan - Number of faan in the winning hand
 * @returns Payout amount in dollars
 */
export function calculatePayout(faan: number): number {
  if (faan < 3) return 0; // Minimum 3 faan required
  if (faan >= 9) return 1024; // Cap at $1,024
  return 16 * Math.pow(2, faan - 3);
}
