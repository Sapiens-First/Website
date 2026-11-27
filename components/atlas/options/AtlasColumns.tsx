"use client";

import { roleCount, type PackedNode } from "@/lib/atlas/circles";
import SeeAllList from "./SeeAllList";
import { circlesOf, markerColor, rolesOf } from "./markers";
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

function RoleLinks({ node, selected }: { node: PackedNode; selected: string }) {
  const roles = rolesOf(node);
  if (!roles.length) return null;
  return (
    <SeeAllList
      items={roles}
      noun="role"
      itemKey={(role) => role.row.ID}
      listClassName="b-roles"
      forceOpen={roles.slice(5).some((role) => role.row.ID === selected)}
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
  );
}

function Card({
  node,
  selected,
  own,
}: {
  node: PackedNode;
  selected: string;
  own?: boolean;
}) {
  const nested = circlesOf(node);
  return (
    <article className="b-card" aria-label={node.row.Name}>
      {own ? (
        <p className="cap">Roles in this circle</p>
      ) : (
        <>
          <header>
            <a
              href={recordUrl(node.row.ID)}
              data-opt-id={node.row.ID}
              className={selected === node.row.ID ? "sel" : undefined}
              aria-current={selected === node.row.ID ? "true" : undefined}
            >
              <Marker node={node} />
              {node.row.Name}
            </a>
            <span className="cnt">{plural(roleCount(node), "role")}</span>
          </header>
          {node.row.Purpose ? <p className="p">{node.row.Purpose}</p> : null}
        </>
      )}
      <RoleLinks node={node} selected={selected} />
      {nested.length && !own ? (
        <p className="cap inside">
          Inside:{" "}
          {nested.map((circle, index) => (
            <span key={circle.row.ID}>
              {index > 0 ? ", " : ""}
              <a href={recordUrl(circle.row.ID)} data-opt-id={circle.row.ID}>
                {circle.row.Name}
              </a>
            </span>
          ))}
        </p>
      ) : null}
    </article>
  );
}

export default function AtlasColumns({
  root,
  selected,
}: {
  root: PackedNode;
  selected: string;
}) {
  return (
    <>
      <p className="cap movement">Sapiens First Movement</p>
      <div className="b-cols">
        {circlesOf(root).map((column) => {
          const nested = circlesOf(column);
          const ownRoles = rolesOf(column);
          return (
            <section
              key={column.row.ID}
              className="b-col"
              aria-labelledby={`col-${column.row.ID}`}
            >
              <div className="b-colhead">
                <a
                  id={`col-${column.row.ID}`}
                  href={recordUrl(column.row.ID)}
                  data-opt-id={column.row.ID}
                  className={selected === column.row.ID ? "sel" : undefined}
                  aria-current={selected === column.row.ID ? "true" : undefined}
                >
                  <Marker node={column} />
                  {column.row.Name}
                </a>
                {column.row.Purpose ? <p>{column.row.Purpose}</p> : null}
                <span className="cnt">
                  {[
                    nested.length ? plural(nested.length, "circle") : "",
                    plural(roleCount(column), "role"),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
              {ownRoles.length ? (
                <Card node={column} selected={selected} own />
              ) : null}
              {nested.map((circle) => (
                <Card key={circle.row.ID} node={circle} selected={selected} />
              ))}
            </section>
          );
        })}
      </div>
    </>
  );
}
