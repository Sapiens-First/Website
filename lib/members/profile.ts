export const profileFields = {
  full_name: { label: "Full name", limit: 200, autoComplete: "name" },
  country_code: { label: "Country", limit: 2, autoComplete: "country" },
  city: {
    label: "City, town or locality",
    limit: 120,
    autoComplete: "address-level2",
  },
  region: {
    label: "State, province or region",
    limit: 120,
    autoComplete: "address-level1",
  },
  postal_code: { label: "Postal code", limit: 32, autoComplete: "postal-code" },
  phone: { label: "Phone number", limit: 32, autoComplete: "tel" },
  address_line_1: {
    label: "Street address",
    limit: 250,
    autoComplete: "address-line1",
  },
  address_line_2: {
    label: "Apartment, building or additional address",
    limit: 250,
    autoComplete: "address-line2",
  },
} as const;

export type ProfileField = keyof typeof profileFields;
export type ProfileValues = Record<ProfileField, string>;
export type ProfileInput = Partial<Record<ProfileField, unknown>>;
export type ProfileFormState = {
  values: ProfileValues;
  errors: Partial<Record<ProfileField, string>>;
  message: string;
};

export const requiredProfileFields: readonly ProfileField[] = [
  "full_name",
  "country_code",
  "city",
];

export const countryCodes =
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(
    " ",
  );
const countrySet = new Set(countryCodes);

export function getProfileCountries() {
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  return countryCodes
    .map((code) => ({ code, name: names.of(code) ?? code }))
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
}

export function validateProfile(input: ProfileInput): ProfileFormState {
  const values = {} as ProfileValues;
  const errors: ProfileFormState["errors"] = {};
  for (const field of Object.keys(profileFields) as ProfileField[]) {
    const value = input[field];
    const text = typeof value === "string" ? value.trim() : "";
    values[field] = field === "country_code" ? text.toUpperCase() : text;
    if (value != null && typeof value !== "string") {
      errors[field] = "Enter a text value.";
    } else if (requiredProfileFields.includes(field) && !text) {
      errors[field] = `${profileFields[field].label} is required.`;
    } else if (Array.from(text).length > profileFields[field].limit) {
      errors[field] = `Use ${profileFields[field].limit} characters or fewer.`;
    } else if (/[\u0000-\u001f\u007f]/.test(text)) {
      errors[field] = "Use a single line of text.";
    }
  }
  if (values.country_code && !countrySet.has(values.country_code)) {
    errors.country_code = "Choose a country from the list.";
  }
  if (
    values.phone &&
    (!/^[+()0-9 .-]+$/.test(values.phone) || !/[0-9]/.test(values.phone))
  ) {
    errors.phone =
      "Use digits and optional +, spaces, brackets, dots or hyphens.";
  }
  return {
    values,
    errors,
    message: Object.keys(errors).length ? "Check the highlighted fields." : "",
  };
}

export function isProfileComplete(profile: ProfileInput) {
  return Object.keys(validateProfile(profile).errors).length === 0;
}

export function initialProfileValues(
  profile: ProfileInput,
  suggestedName: unknown = "",
): ProfileValues {
  const values = validateProfile(profile).values;
  if (
    profile.full_name == null &&
    typeof suggestedName === "string" &&
    Array.from(suggestedName.trim()).length <= 200
  ) {
    values.full_name = suggestedName.trim();
  }
  return values;
}

export function profileUpdate(values: ProfileValues) {
  return Object.fromEntries(
    (Object.keys(profileFields) as ProfileField[]).map((field) => [
      field,
      values[field] || null,
    ]),
  ) as Record<ProfileField, string | null>;
}
