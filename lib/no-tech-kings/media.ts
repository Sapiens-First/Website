/**
 * Swap illustrations and photos here, and drop the files in public/no-tech-kings/.
 * Overwriting public/no-tech-kings/dinosaur.svg (or pointing src at a new file)
 * is enough when a replacement dinosaur arrives.
 */

export type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  fit: "cover" | "contain";
  credit: string;
  license: string;
};

export const declaration = {
  src: "/no-tech-kings/declaration.jpg",
  credit:
    "Engrossed Declaration of Independence, August 2, 1776. U.S. National Archives and Records Administration, NAID 1419123. Wikimedia Commons: “Engrossed Declaration of Independence, front.jpg”.",
  license: "Public domain. Work of the United States federal government.",
};

export const heroPhoto = {
  src: "/assets/homepage-hero-photo.jpg",
  alt: "",
  width: 1800,
  height: 1198,
} as const;

export const bostonTeaParty = {
  src: "/no-tech-kings/boston-tea-party-currier.jpg",
  width: 1789,
  height: 1091,
} as const;

export const gallery = [
  {
    src: "/no-tech-kings/tea-party.svg",
    alt: "Illustration of a tea party table with a pot, cups, cake, and bunting.",
    width: 400,
    height: 320,
    fit: "contain",
    credit: "Original illustration made for No Tech Kings.",
    license: "Original artwork for this campaign.",
  },
  {
    src: "/no-tech-kings/people.jpg",
    alt: "A diverse crowd picnicking together on the grass in a city park.",
    width: 1400,
    height: 1050,
    fit: "cover",
    credit:
      "Rob Bye, “Hanging Out in the Park,” London Fields, London, September 26, 2016. Wikimedia Commons: “Hanging Out in the Park (Unsplash).jpg”.",
    license:
      "CC0 1.0 Universal. Published on Unsplash before June 5, 2017, under Unsplash’s sitewide public-domain dedication.",
  },
  {
    src: "/no-tech-kings/dinosaur.svg",
    alt: "Illustration of a smiling dinosaur in a tricorn hat, holding a teacup.",
    width: 400,
    height: 320,
    fit: "contain",
    credit:
      "Original illustration made for No Tech Kings. Replace this file when a new dinosaur image is ready.",
    license: "Original artwork for this campaign.",
  },
] as const satisfies readonly GalleryImage[];

export const teaPartyIllustration = gallery[0];
export const parkPhoto = gallery[1];
export const dinosaurIllustration = gallery[2];
