"use client";

import { roleCount, type PackedNode } from "@/lib/atlas/circles";
import SeeAllList from "./SeeAllList";
import { circlesOf, markerColor, rolesOf } from "./markers";
import { plural } from "./text";

const recordUrl = (id: string) => `#governance/circles/${id}`;

function leaves(node: PackedNode): number {
  const circles = circlesOf(node);
  if (!circles.length) return 1;
  return circles.reduce((sum, circle) => sum + leaves(circle), 0);
}

function Node({ node, selected }: { node: PackedNode; selected: string }) {
  const circles = circlesOf(node);
  const roles = rolesOf(node);
  const hub = circles.length > 0 && roles.length === 0;
  return (
    <li style={{ ["--g" as string]: leaves(node) }}>
      <div className={hub ? "c-node hub" : "c-node"}>
        <header>
          <a
            href={recordUrl(node.row.ID)}
            data-opt-id={node.row.ID}
            className={selected === node.row.ID ? "sel" : undefined}
            aria-current={selected === node.row.ID ? "true" : undefined}
          >
            <span
              className="mk"
              style={{ background: markerColor(node) }}
              aria-hidden="true"
            />
            {node.row.Name}
          </a>
          <span className="cnt">{plural(roleCount(node), "role")}</span>
        </header>
        {hub && node.row.Purpose ? (
          <p className="p">{node.row.Purpose}</p>
        ) : null}
        {roles.length ? (
          <SeeAllList
            items={roles}
            noun="role"
            itemKey={(role) => role.row.ID}
            listClassName="c-roles"
            forceOpen={roles.slice(5).some((role) => role.row.ID === selected)}
            renderItem={(role) => (
              <a
                href={recordUrl(role.row.ID)}
                data-opt-id={role.row.ID}
                className={selected === role.row.ID ? "sel" : undefined}
                aria-current={selected === role.row.ID ? "true" : undefined}
              >
                {role.row.Name}
              </a>
            )}
          />
        ) : null}
      </div>
      {circles.length ? (
        <ul className="c-kids">
          {circles.map((circle) => (
            <Node key={circle.row.ID} node={circle} selected={selected} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function AtlasChart({
  root,
  selected,
}: {
  root: PackedNode;
  selected: string;
}) {
  const wide = circlesOf(root).some((circle) => leaves(circle) > 6);
  return (
    <div className={wide ? "c-wrap c-wide" : "c-wrap"}>
      <div className="c-root">
        <span className="cap">Sapiens First Movement</span>
      </div>
      <ul className="c-tree" aria-label="Circles and roles">
        {circlesOf(root).map((circle) => (
          <Node key={circle.row.ID} node={circle} selected={selected} />
        ))}
      </ul>
    </div>
  );
}
