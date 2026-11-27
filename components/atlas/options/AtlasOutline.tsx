"use client";

import { useId, useState } from "react";
import { roleCount, type PackedNode } from "@/lib/atlas/circles";
import SeeAllList from "./SeeAllList";
import { circlesOf, containsId, markerColor, rolesOf } from "./markers";
import { plural } from "./text";

const recordUrl = (id: string) => `#governance/circles/${id}`;

function Marker({ node }: { node: PackedNode }) {
  return (
    <span
      className="mk"
      style={{ background: markerColor(node) }}
      aria-hidden="true"
    />
  );
}

function CircleBlock({
  node,
  depth,
  selected,
}: {
  node: PackedNode;
  depth: number;
  selected: string;
}) {
  const bodyId = useId();
  const [open, setOpen] = useState(true);
  const roles = rolesOf(node);
  const circles = circlesOf(node);
  const revealed = Boolean(selected) && containsId(node, selected);
  const [seenRevealed, setSeenRevealed] = useState(false);
  if (revealed && !seenRevealed) {
    setSeenRevealed(true);
    setOpen(true);
  } else if (!revealed && seenRevealed) {
    setSeenRevealed(false);
  }
  const selectedRole = roles.some((role) => role.row.ID === selected);
  return (
    <section
      className={depth === 1 ? "a-top" : "a-sub"}
      aria-labelledby={`${bodyId}-name`}
    >
      <div className="a-head">
        <button
          type="button"
          className="tw"
          aria-expanded={open}
          aria-controls={bodyId}
          aria-label={`${open ? "Collapse" : "Expand"} ${node.row.Name}`}
          onClick={() => setOpen((value) => !value)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <a
          id={`${bodyId}-name`}
          className={selected === node.row.ID ? "a-name sel" : "a-name"}
          href={recordUrl(node.row.ID)}
          data-opt-id={node.row.ID}
          aria-current={selected === node.row.ID ? "true" : undefined}
        >
          <Marker node={node} />
          {node.row.Name}
        </a>
        <span className="cnt">{plural(roleCount(node), "role")}</span>
      </div>
      {node.row.Purpose ? (
        <p className="a-purpose">{node.row.Purpose}</p>
      ) : null}
      <div className="a-body" id={bodyId} hidden={!open}>
        {roles.length ? (
          <SeeAllList
            items={roles}
            noun="role"
            itemKey={(role) => role.row.ID}
            listClassName="a-roles"
            forceOpen={
              selectedRole &&
              roles.slice(5).some((role) => role.row.ID === selected)
            }
            renderItem={(role) => (
              <a
                href={recordUrl(role.row.ID)}
                data-opt-id={role.row.ID}
                className={selected === role.row.ID ? "sel" : undefined}
                aria-current={selected === role.row.ID ? "true" : undefined}
              >
                {role.row.Name}
                <span className="ch" aria-hidden="true">
                  ›
                </span>
              </a>
            )}
          />
        ) : null}
        {circles.map((circle) => (
          <CircleBlock
            key={circle.row.ID}
            node={circle}
            depth={depth + 1}
            selected={selected}
          />
        ))}
      </div>
    </section>
  );
}

export default function AtlasOutline({
  root,
  selected,
}: {
  root: PackedNode;
  selected: string;
}) {
  const circles = circlesOf(root);
  return (
    <div className="a-outline">
      <div className="a-cap">
        <span className="cap">Sapiens First Movement</span>
      </div>
      {circles.map((circle) => (
        <CircleBlock
          key={circle.row.ID}
          node={circle}
          depth={1}
          selected={selected}
        />
      ))}
    </div>
  );
}
