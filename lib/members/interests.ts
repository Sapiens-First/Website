import { campaigns } from "@/lib/campaigns";

export const interests = {
  "start-a-circle": {
    label: "Starting a Circle",
    path: "/circle",
    column: "circle",
  },
  fellowship: {
    label: "Fellowship opportunities",
    path: "/fellowship",
    column: "fellowship",
  },
} as const;

export type Interest = keyof typeof interests;

export function isInterest(value: unknown): value is Interest {
  return typeof value === "string" && Object.hasOwn(interests, value);
}

// An explicit allowlist prevents external redirects and auth loops.
export function memberReturnPath(value: unknown) {
  if (
    typeof value === "string" &&
    Object.keys(campaigns).some((id) => value === `/campaigns/${id}#sign`)
  )
    return value;
  return value === "/circle?interest=confirm#signup" ||
    value === "/fellowship?interest=confirm#signup"
    ? value
    : "/dashboard";
}

export function interestReturnPath(interest: Interest) {
  return `${interests[interest].path}?interest=confirm#signup`;
}
