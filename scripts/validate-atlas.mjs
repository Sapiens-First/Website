import { loadAtlasData } from "../lib/atlas/data.ts";

const data = loadAtlasData();
console.log(
  `Atlas validated: ${data.domains.length} work records, ${data.governance.length} roles/circles, ${data.relationships.length} relationships.`,
);
