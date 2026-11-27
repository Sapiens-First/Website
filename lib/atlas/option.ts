export type AtlasOption = "a" | "b" | "c";

export function atlasOption(value: string | undefined): AtlasOption | null {
  return value === "a" || value === "b" || value === "c" ? value : null;
}

export function optionLabel(option: AtlasOption) {
  if (option === "a") return "Outline";
  if (option === "b") return "Columns";
  return "Chart";
}
