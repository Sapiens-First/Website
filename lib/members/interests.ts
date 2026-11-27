export type Interest = "start-a-circle" | "fellowship" | "membership";

export function isInterest(value: unknown): value is Interest {
  return (
    value === "start-a-circle" ||
    value === "fellowship" ||
    value === "membership"
  );
}

// An explicit allowlist prevents external redirects and auth loops.
export function memberReturnPath(value: unknown) {
  return value === "/dashboard/profile" ||
    value === "/atlas/me" ||
    value === "/circle?interest=confirm#signup" ||
    value === "/fellowship?interest=confirm#signup"
    ? value
    : "/dashboard";
}
