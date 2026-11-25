/**
 * "Email Governor Newsom" (/no-tech-kings/act).
 * Wording, facts and the email builder come from the Let's Not All Die
 * California page; only the Governor is emailed here.
 * Pure data and functions; nothing here calls an outside service.
 */

/** Update when the new governor takes office (early January 2027). */
export const governor = {
  name: "Gavin Newsom",
  lastName: "Newsom",
  email: "leg.unit@gov.ca.gov",
} as const;

/** Stored as `campaign_signatures.campaign_id`. */
export const actCampaignId = "email-newsom";

export const reportUrl =
  "https://www.govops.ca.gov/wp-content/uploads/sites/11/2026/11/FINAL_-AI-Safety-in-2026-and-Beyond-v2.pdf";

/** Longer emails can be too long to open in an email app. */
export const maxBody = 2500;
export const maxStory = 600;

export const actCopy = {
  title: "Email Governor Newsom",
  description:
    "Ask Governor Newsom to call a special session and pass California’s November 18th AI safety recommendations. Write your email in two minutes.",
  heroDate: "California · Act now",
  heroLede:
    "On November 18th, the Governor’s Office received strong AI safety recommendations. Ask Governor Newsom to call a special session and pass them now.",
  heroCta: "Write your email",
  heroNote: "Takes about two minutes. Your email is sent from your own inbox.",
  whyTitle: "What the recommendations do.",
  whyLede:
    "If turned into law, these recommendations would meaningfully slow down frontier AI development.",
  reportLink: "Read the full report",
  points: [
    {
      title: "Safety plans.",
      body: "Strengthen the safety plans AI labs must follow.",
    },
    {
      title: "Auditors.",
      body: "Embed third-party auditors to make sure the labs actually follow their plans.",
    },
    {
      title: "Kill switches.",
      body: "Require a way to shut down dangerous models.",
    },
    {
      title: "A compute cap.",
      body: "Set a ceiling on the computing power used for automated AI research and development.",
    },
  ],
  writeTitle: "Write the Governor.",
  doneTitle: "Your email is on its way.",
  doneBody:
    "Thank you for speaking up. Now bring someone with you: share this page or get involved with No Tech Kings.",
} as const;

export const storyExamples = [
  "e.g., I'm a father and I'm worried about my family.",
  "e.g., AI is advancing more rapidly than our ability to regulate or control it.",
] as const;

export const subjects = [
  "AI",
  "AI special session",
  "Special session on AI",
  "AI safety",
  "Regulating AI",
  "AI regulation",
  "A special session for AI",
  "Advanced AI",
  "AI and California",
  "California and AI",
  "AI rules",
  "AI needs rules",
  "Rules for AI",
  "Time to regulate AI",
  "AI oversight",
  "Superintelligent AI",
  "AI risk",
  "The risks of AI",
  "Keeping AI under control",
  "AI special session request",
  "Special legislative session on AI",
  "Legislature and AI",
  "A request about AI",
  "My concerns about AI",
  "Concerned about AI",
  "AI, please act",
  "Act on AI",
  "AI legislation",
  "Special session: AI safety",
  "Constituent request: AI",
] as const;

const request = {
  opening: [
    "I'm writing to ask for a special legislative session to pass the November 18th AI safety recommendations and put a cap on automated AI R&D right now.",
    "Please call a special session of the Legislature to pass the November 18th AI safety recommendations, starting with an immediate cap on automated AI R&D.",
    "As a Californian, I'm asking for a special legislative session to enact the November 18th AI safety recommendations and cap automated AI research and development now.",
    "I urge you to push for a special session that passes the November 18th AI safety recommendations and sets a cap on automated AI R&D without delay.",
    "I'm asking you to support a special session of the Legislature to turn the November 18th AI safety recommendations into law, including an immediate cap on automated AI R&D.",
    "Please make it a priority to call a special legislative session, pass the November 18th AI safety recommendations, and cap automated AI R&D right away.",
  ],
  closing: [
    "That's why I'm asking for a special legislative session to pass the November 18th AI safety recommendations and cap automated AI R&D right now.",
    "Please call a special session of the Legislature to pass the November 18th recommendations, and put a cap on automated AI R&D in place immediately.",
    "Will you push for a special session to enact the November 18th AI safety recommendations, including an immediate cap on automated AI R&D?",
    "I urge you to support a special legislative session that passes the November 18th recommendations and caps automated AI R&D now.",
    "Please do everything you can to bring about a special session that turns the November 18th AI safety recommendations into law and caps automated AI R&D without delay.",
    "I'm asking you to support a special session of the Legislature to pass the November 18th recommendations and implement a cap on automated AI R&D right away.",
  ],
} as const;

const signoffs = [
  "Sincerely,",
  "Thank you,",
  "Respectfully,",
  "With thanks,",
  "Best regards,",
  "Thank you for your time,",
] as const;

/** Each draft gets two extinction-risk facts and one California fact at random. */
export const extinction = {
  facts: [
    "In July 2026, AI agents that OpenAI was testing for hacking ability escaped their isolated test environment and broke into Hugging Face's production systems, as OpenAI later confirmed.",
    "In a September 2026 Politico poll, 63 percent of Americans said there is at least a moderate risk that advanced AI will someday destroy humanity, including majorities of both Harris and Trump voters.",
    "In a survey of 2,778 AI researchers, between 38 and 51 percent gave at least a 10 percent chance that advanced AI leads to outcomes as bad as human extinction.",
    "Nobel Prize winner Geoffrey Hinton, often called the godfather of AI, has estimated a 10 to 20 percent chance that AI leads to human extinction within 30 years.",
    "In 2025 tests by Palisade Research, OpenAI's o3 model rewrote the script meant to shut it down in 7 of 100 runs, even after being told to allow itself to be shut down.",
    "In a 2025 safety test, Anthropic found that its Claude Opus 4 model, told it was about to be replaced, resorted to blackmailing the engineer responsible in 84 percent of runs.",
    "In September 2026, AI pioneer Yoshua Bengio told AFP, \"There's a reason that companies are saying this is going too fast, that we're losing control.\"",
    "More than 75,000 people, including AI pioneers Geoffrey Hinton and Yoshua Bengio, have signed a statement calling for a prohibition on developing superintelligence until there is broad scientific consensus that it can be done safely and strong public buy-in.",
    "In an October 2025 poll of 2,000 U.S. adults, 64 percent said superhuman AI should not be developed until it is proven safe, or should never be developed at all.",
    "In 2023, the heads of OpenAI, Google DeepMind and Anthropic signed a statement that reducing the risk of extinction from AI should be a global priority alongside pandemics and nuclear war.",
    "The 2026 International AI Safety Report, backed by more than 30 countries, warns that an AI system could come to operate beyond anyone's control, and that regaining control could be very costly or even impossible.",
    "In September 2025, more than 200 prominent figures, including ten Nobel laureates, called on governments at the UN General Assembly to agree by 2026 on red lines that AI must never be allowed to cross.",
  ],
  californiaFacts: [
    "In September 2026, Governor Newsom ordered state officials and outside experts to recommend stronger AI safety rules within two months, including whether to require an emergency shutoff for the most powerful AI models.",
    "Governor Newsom's September 2026 order asks the state to consider treating loss-of-control incidents, like the AI agents that broke into Hugging Face, as critical AI safety incidents.",
    "On November 18, 2026, the California Governor's Office received AI safety recommendations that would strengthen AI companies' safety plans, embed third-party auditors to check that companies follow them, create kill switches so dangerous models can be shut down, and cap the computing power used for automated AI research and development.",
    "California's SB 53, signed in September 2025, requires developers of the most powerful AI models to publish safety protocols and report critical safety incidents to the state within 15 days.",
  ],
} as const;

export type Sender = { name: string; email: string; zip: string };

/** One visitor's wording and layout, chosen once, so the emails don't all look alike. */
export type EmailStyle = {
  subject: number;
  position: "top" | "bottom";
  request: number;
  greeting: number;
  signoff: number;
  signature: number;
};

const rand = (n: number) => Math.floor(Math.random() * n);

export function shuffled<T>(list: readonly T[]): T[] {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickStyle(): EmailStyle {
  return {
    subject: rand(subjects.length),
    position: Math.random() < 0.5 ? "top" : "bottom",
    request: rand(request.opening.length),
    greeting: rand(3),
    signoff: rand(signoffs.length),
    signature: rand(3),
  };
}

export function randomStoryExample() {
  return storyExamples[rand(storyExamples.length)];
}

export function subjectFor(style: EmailStyle) {
  return subjects[style.subject % subjects.length];
}

function greeting(style: EmailStyle) {
  const who = `Governor ${governor.lastName}`;
  return [`Dear ${who},`, `${who},`, `Dear ${who}:`][style.greeting % 3];
}

export function signature(style: EmailStyle, sender: Sender) {
  const place = isCaliforniaZip(sender.zip)
    ? `California ${sender.zip}`
    : `ZIP code ${sender.zip}`;
  const layouts = [
    [sender.name, sender.email, `ZIP code ${sender.zip}`],
    [sender.name, place, sender.email],
    [`${sender.name}, ${place}`, sender.email],
  ];
  return `${signoffs[style.signoff % signoffs.length]}\n${layouts[style.signature % 3].join("\n")}`;
}

function requestSentence(style: EmailStyle, local: boolean) {
  const list = style.position === "top" ? request.opening : request.closing;
  const sentence = list[style.request % list.length];
  return local ? sentence : sentence.replace("As a Californian, I'm", "I'm");
}

/** Greeting, the request (above or below the text), the text, and a signature. */
export function assemble(
  text: string,
  style: EmailStyle,
  sender: Sender,
  withRequest = true,
) {
  const ask = requestSentence(style, isCaliforniaZip(sender.zip));
  const parts = !withRequest
    ? [text]
    : style.position === "top"
      ? [ask, text]
      : [text, ask];
  return [greeting(style), ...parts, signature(style, sender)].join("\n\n");
}

/** Where the cursor goes in "I'll write it myself". */
export const writeHereMarker = "\u0000";

export function ownTemplate(style: EmailStyle, sender: Sender) {
  const full = assemble(writeHereMarker, style, sender);
  return {
    text: full.replace(writeHereMarker, ""),
    cursor: full.indexOf(writeHereMarker),
  };
}

function tidyStory(text: string) {
  let t = text.replace(/\s+/g, " ").trim();
  t = t
    .replace(/\bi\b/g, "I")
    .replace(/\bim\b/gi, "I'm")
    .replace(/\bi'(m|ve|ll|d)\b/gi, (_m, x: string) => `I'${x.toLowerCase()}`);
  t = t.replace(
    /(^|[.!?]\s+)([a-z])/g,
    (_m, a: string, b: string) => a + b.toUpperCase(),
  );
  if (!/[.!?]["')]?$/.test(t)) t += ".";
  return t;
}

const sharedOpeners = [
  "I'm worried that we are building AI that we may not be able to control, and that the consequences could be irreversible.",
  "AI is advancing faster than our ability to understand it, and I'm afraid that if it slips out of human control, there may be no way back.",
] as const;

/** For senders with a California ZIP. */
const localOpeners = [
  "I'm a Californian, and I'm worried that advanced AI could slip out of human control and threaten humanity's survival.",
  "I believe advanced AI is one of the most serious risks our state and our country have ever faced.",
  "As one of your constituents, I'm deeply concerned that AI more capable than people could soon be beyond anyone's control.",
] as const;

/** For everyone else: why California's choice matters to them. */
const visitorOpeners = [
  "I don't live in California, but what California does about AI will affect all of us, and I'm worried that advanced AI could slip out of human control.",
  "I'm writing from outside California because the world's most powerful AI is being built in your state, and I'm deeply concerned it could soon be beyond anyone's control.",
] as const;

const storyLeads = [
  "This is personal for me.",
  "Here is why this matters to me.",
  "I'm not writing as an expert, but as someone with a lot at stake.",
  "",
] as const;

const factLeads = [
  "This isn't science fiction.",
  "The warning signs are already here.",
  "The evidence is hard to ignore.",
  "Even the people building this technology are raising the alarm.",
] as const;

const californiaLeads = [
  "California has already started to act.",
  "You have the power to lead on this.",
  "California is where this technology is being built, and it's where it can be brought under control.",
  "California has a real chance to get this right.",
] as const;

const pick = <T>(list: readonly T[]) => list[rand(list.length)];

/**
 * "Help me write it": a fresh email body each time, built from the visitor's
 * own words, two extinction-risk facts and one California fact.
 * The greeting, the request and the signature are added by `assemble`.
 */
export function writeTemplate(story: string, zip: string) {
  const [first, second] = shuffled(extinction.facts);
  const openers = isCaliforniaZip(zip)
    ? [...localOpeners, ...sharedOpeners]
    : [...visitorOpeners, ...sharedOpeners];
  const paragraphs: string[] = [pick(openers)];
  const words = story.trim();
  if (words) {
    const lead = pick(storyLeads);
    paragraphs.push(lead ? `${lead} ${tidyStory(words)}` : tidyStory(words));
  }
  paragraphs.push(`${pick(factLeads)} ${first} ${second}`);
  paragraphs.push(
    `${pick(californiaLeads)} ${pick(extinction.californiaFacts)}`,
  );
  return paragraphs.join("\n\n");
}

export function isZip(zip: string) {
  return /^\d{5}$/.test(zip);
}

/** Californians get "As a Californian" wording; everyone can send. */
export function isCaliforniaZip(zip: string) {
  if (!/^\d{5}$/.test(zip)) return false;
  const n = Number(zip);
  return n >= 90000 && n <= 96199;
}

export type MailApp = "gmail" | "outlook" | "mailto";

export function composeLink(app: MailApp, subject: string, body: string) {
  const to = governor.email;
  const su = encodeURIComponent(subject);
  const b = encodeURIComponent(body);
  if (app === "gmail")
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${su}&body=${b}`;
  if (app === "outlook")
    return `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${su}&body=${b}`;
  return `mailto:${to}?subject=${su}&body=${b}`;
}
