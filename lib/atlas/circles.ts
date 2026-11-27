import { packEnclose, packSiblings } from "d3-hierarchy";
import type { AtlasRow } from "./model";

export const ATLAS_ORGANIZATION_ID = "sapiens-first";
export const ATLAS_ORGANIZATION_NAME = "Sapiens First Movement";
const ANCHOR_NAME = "Sapiens First Global";

const HUES = ["#ED3B91", "#1678EE", "#00A878", "#8B4DFF", "#FF7870", "#16344A"];

export type CircleKind = "outer" | "anchor" | "branch" | "nested" | "role";

export type PackedNode = {
  row: AtlasRow;
  children: PackedNode[];
  parent?: PackedNode;
  x: number;
  y: number;
  r: number;
  depth: number;
  hue: string;
  band: number;
  kind: CircleKind;
};

export type CircleModel = {
  nodes: Map<string, PackedNode>;
  root: PackedNode | null;
  branches: PackedNode[];
  anchor: PackedNode | null;
  unplaced: PackedNode[];
};

function make(row: AtlasRow, kind: CircleKind = "nested"): PackedNode {
  return {
    row,
    children: [],
    x: 0,
    y: 0,
    r: 0,
    depth: 0,
    hue: "#18251F",
    band: 21,
    kind: row.Type === "Role" ? "role" : kind,
  };
}

function layout(node: PackedNode) {
  if (!node.children.length) {
    node.r = node.row.Type === "Role" ? 20 : 34;
    return;
  }
  node.children.forEach(layout);
  const gap = node.children.every((child) => child.row.Type === "Role")
    ? 5
    : 12;
  const disks = node.children.map((child) => ({
    r: child.r + gap / 2,
    x: 0,
    y: 0,
    child,
  }));
  packSiblings(disks);
  const enclosed = packEnclose(disks);
  for (const disk of disks) {
    disk.child.x = disk.x - enclosed.x;
    disk.child.y = disk.y - enclosed.y;
  }
  node.r = enclosed.r + node.band;
}

function place(node: PackedNode, x: number, y: number) {
  node.x = x;
  node.y = y;
  for (const child of node.children) place(child, x + child.x, y + child.y);
}

function paint(node: PackedNode, hue: string) {
  node.hue = hue;
  node.children.forEach((child) => paint(child, hue));
}

function roleCountOf(node: PackedNode): number {
  return node.children.reduce(
    (sum, child) => sum + roleCountOf(child),
    node.row.Type === "Role" ? 1 : 0,
  );
}

export function roleCount(node: PackedNode) {
  return roleCountOf(node);
}

export function circleFill(node: PackedNode) {
  if (node.kind === "role") return "#fff";
  if (node.kind === "outer") return "var(--color-paper)";
  if (node.kind === "anchor")
    return "color-mix(in srgb, var(--color-brand-yellow) 16%, var(--color-paper))";
  const amount = node.kind === "branch" ? 9 : 15;
  return `color-mix(in srgb, ${node.hue} ${amount}%, var(--color-paper))`;
}

export function circleStroke(node: PackedNode) {
  if (node.kind === "outer")
    return "color-mix(in srgb, var(--color-ink) 22%, transparent)";
  if (node.kind === "role") return `color-mix(in srgb, ${node.hue} 55%, white)`;
  if (node.kind === "anchor") return "color-mix(in srgb, #C99A00 45%, white)";
  return `color-mix(in srgb, ${node.hue} 40%, white)`;
}

export function circleLayout(records: AtlasRow[]): CircleModel {
  const nodes = new Map<string, PackedNode>();
  for (const row of records) nodes.set(row.ID, make(row));
  const roots: PackedNode[] = [];
  const unplaced: PackedNode[] = [];
  for (const node of nodes.values()) {
    const parent = nodes.get(node.row["Parent Circle ID"]);
    if (parent?.row.Type === "Circle") {
      node.parent = parent;
      parent.children.push(node);
    } else if (!node.row["Parent Circle ID"] && node.row.Type === "Circle") {
      roots.push(node);
    } else unplaced.push(node);
  }

  let root: PackedNode | null = null;
  if (roots.length) {
    root = make(
      {
        ID: ATLAS_ORGANIZATION_ID,
        Name: ATLAS_ORGANIZATION_NAME,
        Type: "Circle",
        Status: "Active",
        Purpose: "",
        "Parent Circle ID": "",
      },
      "outer",
    );
    root.kind = "outer";
    root.children = [...roots];
    for (const child of roots) child.parent = root;
    nodes.set(root.row.ID, root);
  }

  function depths(node: PackedNode, depth: number) {
    node.depth = depth;
    node.band = depth === 0 ? 30 : depth === 1 ? 24 : 21;
    node.children.forEach((child) => depths(child, depth + 1));
  }
  if (root) depths(root, 0);

  const anchor =
    root?.children.find(
      (child) => child.row.Type === "Circle" && child.row.Name === ANCHOR_NAME,
    ) ?? null;
  const branches: PackedNode[] = [];
  for (const child of root?.children ?? []) {
    if (anchor && child === anchor) {
      for (const sub of child.children)
        if (sub.row.Type === "Circle") branches.push(sub);
    } else if (child.row.Type === "Circle") branches.push(child);
  }
  branches.sort((a, b) => a.row.ID.localeCompare(b.row.ID));
  branches.forEach((branch, index) => {
    branch.kind = "branch";
    paint(branch, HUES[index % HUES.length]);
  });
  if (anchor) anchor.kind = "anchor";
  function kinds(node: PackedNode) {
    if (
      node.kind !== "outer" &&
      node.kind !== "anchor" &&
      node.kind !== "branch"
    ) {
      if (node.row.Type === "Role") node.kind = "role";
      else if (node !== root) node.kind = "nested";
    }
    if (node.kind === "branch") {
      node.children.forEach((child) => {
        if (child.row.Type === "Circle") child.kind = "nested";
        child.children.forEach((nested) => {
          if (nested.row.Type === "Circle" && nested.kind === "nested") {
            /* keep nested */
          }
        });
      });
    }
    node.children.forEach(kinds);
  }
  if (root) kinds(root);

  if (root) {
    layout(root);
    place(root, 0, 0);
  }
  return { nodes, root, branches, anchor, unplaced };
}
