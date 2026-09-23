export const site = {
  url: "https://sapiensfirst.org",
  donationUrl:
    "https://www.zeffy.com/en-US/donation-form/support-sapiens-first",
  strategyDocUrl:
    "https://docs.google.com/document/d/1sBlALbzX4fwvEJcFtc4OSpAnceozyV3_chMaFNUIhJg/edit?usp=sharing",
  guideDocId: "1dG4DL_Bak93Sah1LK5oSxtXQ3yQvWp15UMWFv-z9Nvs",
  eventsSheetId: "1mkPKC7MmmKhW8PS2K-7lqmjreQOln6zz9t5C-lSDqOU",
  signupScriptUrl:
    "https://script.google.com/macros/s/AKfycbyXZdjPHlsgHyuklLQmJ2JNFjVZorzcdhUY-wkv3h5vTJuXxtqOveAK4JnIXVdwwSU0/exec",
} as const;

export const navigation = [
  {
    label: "About",
    href: "/about",
    children: [{ label: "Careers", href: "/careers" }],
  },
  { label: "Fellowship", href: "/fellowship" },
  { label: "Start a Circle", href: "/circle" },
] as const;

export const footerGroups = [
  {
    title: "About",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy", href: "/privacy" },
      { label: "Donate", href: "/donate" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Fellowship", href: "/fellowship" },
      { label: "Start a Circle", href: "/circle" },
      { label: "Join", href: "/join" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Learn", href: "/learn" },
      { label: "Policy", href: "/policy" },
      { label: "Campaigns", href: "/campaigns" },
    ],
  },
] as const;
