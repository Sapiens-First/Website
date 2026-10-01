import type { AtlasRow, HierarchyNode } from "./model";

/* Deterministic nested layout. Circle area is not an organizational metric. */
export function circleLayout(records: AtlasRow[]) {
  const nodes = new Map<string, HierarchyNode>(
    records.map((row) => [row.ID, { row, children: [], x: 0, y: 0, r: 0 }]),
  );
  const roots: HierarchyNode[] = [],
    unplaced: HierarchyNode[] = [];
  for (const node of nodes.values()) {
    const parent = nodes.get(node.row["Parent Circle ID"]);
    if (parent?.row.Type === "Circle") parent.children.push(node);
    else if (!node.row["Parent Circle ID"] && node.row.Type === "Circle")
      roots.push(node);
    else unplaced.push(node);
  }
  function pack(node: HierarchyNode, seen = new Set<string>()) {
    if (seen.has(node.row.ID)) return;
    const path = new Set(seen).add(node.row.ID);
    node.children.forEach((child) => pack(child, path));
    const ordered = [...node.children].sort(
      (a, b) => b.r - a.r || a.row.ID.localeCompare(b.row.ID),
    );
    const placed: HierarchyNode[] = [];
    for (const child of ordered) {
      let best: { x: number; y: number; score: number } | null = null;
      const candidates = placed.length ? [] : [{ x: 0, y: 0 }];
      for (const other of placed) {
        const distance = child.r + other.r + 8;
        for (let step = 0; step < 48; step++) {
          const angle = (step * Math.PI) / 24;
          candidates.push({
            x: other.x + Math.cos(angle) * distance,
            y: other.y + Math.sin(angle) * distance,
          });
        }
      }
      for (const point of candidates) {
        if (
          placed.some(
            (other) =>
              Math.hypot(point.x - other.x, point.y - other.y) <
              child.r + other.r + 7.9,
          )
        )
          continue;
        const score = Math.max(
          Math.hypot(point.x, point.y) + child.r,
          ...placed.map((other) => Math.hypot(other.x, other.y) + other.r),
        );
        if (!best || score < best.score) best = { ...point, score };
      }
      // Tangent candidates always leave room outside the existing cluster.
      child.x =
        best?.x ??
        placed.reduce((right, other) => Math.max(right, other.x + other.r), 0) +
          child.r +
          8;
      child.y = best?.y ?? 0;
      placed.push(child);
    }
    if (!placed.length) {
      node.r = node.row.Type === "Circle" ? 48 : 35;
      return;
    }
    const cx =
      (Math.min(...placed.map((n) => n.x - n.r)) +
        Math.max(...placed.map((n) => n.x + n.r))) /
      2;
    const cy =
      (Math.min(...placed.map((n) => n.y - n.r)) +
        Math.max(...placed.map((n) => n.y + n.r))) /
      2;
    placed.forEach((child) => {
      child.x -= cx;
      child.y -= cy;
    });
    node.r =
      Math.max(
        ...placed.map((child) => Math.hypot(child.x, child.y) + child.r),
      ) + 66;
  }
  roots.forEach((root) => pack(root));
  return { nodes, roots, unplaced };
}
