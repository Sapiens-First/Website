import type { PackedNode } from "@/lib/atlas/circles";

export function markerColor(node: PackedNode): string {
  const source = node.kind === "role" ? node.parent : node;
  if (!source || source.kind === "outer") return "var(--color-ink)";
  if (source.kind === "anchor" || source.row.Name === "Sapiens First Global")
    return "var(--color-brand-yellow)";
  return source.hue || "var(--color-ink)";
}

export function circlesOf(node: PackedNode) {
  return node.children.filter((child) => child.row.Type === "Circle");
}

export function rolesOf(node: PackedNode) {
  return node.children.filter((child) => child.row.Type === "Role");
}

export function containsId(node: PackedNode, id: string): boolean {
  if (node.row.ID === id) return true;
  return node.children.some((child) => containsId(child, id));
}

export function ancestors(node: PackedNode) {
  const chain: PackedNode[] = [];
  let parent = node.parent;
  while (parent && parent.kind !== "outer") {
    chain.unshift(parent);
    parent = parent.parent;
  }
  return chain;
}
