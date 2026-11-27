declare module "d3-hierarchy" {
  export function packSiblings<T extends { r: number; x?: number; y?: number }>(
    circles: T[],
  ): T[];
  export function packEnclose<T extends { r: number; x?: number; y?: number }>(
    circles: T[],
  ): { r: number; x: number; y: number };
}
