// Bump the version whenever the commitments change. Members whose stored
// version differs are asked to agree again before membership pages open.
export const AGREEMENT_VERSION = "2026-11-22";

export const VALUES_URL = "https://docs.sapiensfirst.org/dna/culture";
export const RED_LINES_URL =
  "https://docs.sapiensfirst.org/appendices/reference/values-standards";
export const REPORT_EMAIL = "ops@sapiensfirst.org";

export const commitments = [
  {
    title: "Act peacefully.",
    body: "I won’t harm or threaten people or property.",
  },
  {
    title: "Treat people with respect.",
    body: "I’ll be kind, listen and communicate without violence. I won’t bully, harass, intimidate, humiliate or discriminate against anyone.",
  },
  {
    title: "Disagree openly and in good faith.",
    body: "I’ll welcome feedback and consider other views.",
  },
  {
    title: "Look after myself and others.",
    body: "This is a marathon, not a sprint. I won’t knowingly put other participants or the public at serious risk.",
  },
  {
    title: "Represent Sapiens First honestly.",
    body: "I won’t misrepresent our demands, values, activities or relationships, or speak for the organization without approval.",
  },
  {
    title: "Respect privacy.",
    body: "I’ll keep other members’ personal information confidential.",
  },
] as const;

export function hasAcceptedAgreement(profile: {
  agreement_version?: string | null;
}) {
  return profile.agreement_version === AGREEMENT_VERSION;
}
