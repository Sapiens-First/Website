export type Interest = "start-a-circle" | "fellowship";

export function isInterest(value: unknown): value is Interest {
  return value === "start-a-circle" || value === "fellowship";
}

// An explicit allowlist prevents external redirects and auth loops.
export function memberReturnPath(value: unknown) {
  return value === "/membership" ||
    value === "/dashboard/profile" ||
    value === "/circle?interest=confirm#signup" ||
    value === "/fellowship?interest=confirm#signup"
    ? value
    : "/dashboard";
}
