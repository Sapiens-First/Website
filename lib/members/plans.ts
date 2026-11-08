export const CONTRIBUTIONS = ["1", "10", "20"] as const;
export type Contribution = (typeof CONTRIBUTIONS)[number];
export const TRIAL_DAYS = 14;

export function isContribution(value: unknown): value is Contribution {
  return CONTRIBUTIONS.some((amount) => amount === value);
}

export function isEndedSubscription(status: string) {
  return status === "canceled" || status === "incomplete_expired";
}

export function amountForPrice(
  price: string | null | undefined,
  prices: Record<Contribution, string>,
) {
  return price
    ? (CONTRIBUTIONS.find((amount) => prices[amount] === price) ?? null)
    : null;
}
