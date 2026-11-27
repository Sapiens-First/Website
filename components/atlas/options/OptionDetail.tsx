"use client";

import AssigneeChip from "@/components/atlas/AssigneeChip";
import { roleCount, type PackedNode } from "@/lib/atlas/circles";
import SeeAllList from "./SeeAllList";
import { ancestors, circlesOf, markerColor, rolesOf } from "./markers";
import { lines, plural } from "./text";

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

export function OptionOverview({ root }: { root: PackedNode }) {
  const circles = root.children.filter((child) => child.row.Type === "Circle");
  const circleTotal = circles.reduce(
    (sum, circle) => sum + 1 + countCircles(circle),
    0,
  );
  const roleTotal = circles.reduce((sum, circle) => sum + roleCount(circle), 0);
  return (
    <div className="rec overview">
      <p className="cap">Overview</p>
      <h2 id="overview-title" tabIndex={-1}>
        Roles and circles
      </h2>
      <p className="purpose">
        Select a circle or a role to read what it is for.
      </p>
      <div className="stats">
        <div>
          <b>{circleTotal}</b>
          <span>circles</span>
        </div>
        <div>
          <b>{roleTotal}</b>
          <span>roles</span>
        </div>
      </div>
      <h3>Top-level circles</h3>
      <ul className="links">
        {circles.map((circle) => (
          <li key={circle.row.ID}>
            <a href={recordUrl(circle.row.ID)} data-opt-id={circle.row.ID}>
              <Marker node={circle} />
              {circle.row.Name}
              <span className="n">{plural(roleCount(circle), "role")}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function countCircles(node: PackedNode): number {
  return circlesOf(node).reduce(
    (sum, child) => sum + 1 + countCircles(child),
    0,
  );
}

export default function OptionDetail({
  node,
  onClose,
}: {
  node: PackedNode;
  onClose: () => void;
}) {
  const parent = ancestors(node).at(-1);
  const path = ancestors(node)
    .map((item) => item.row.Name)
    .join(" › ");
  const isRole = node.row.Type === "Role";
  const circles = circlesOf(node);
  const roles = rolesOf(node);
  const accountabilities = lines(node.row.Accountabilities || "");
  const privileges = lines(node.row.Privileges || "");
  return (
    <div className="rec">
      <div className="rec-top">
        <div className="crumb">
          <span>{isRole ? "Role" : "Circle"} · in&nbsp;</span>
          {parent ? (
            <a
              href={recordUrl(parent.row.ID)}
              data-opt-id={parent.row.ID}
              title={path}
            >
              {parent.row.Name}
            </a>
          ) : (
            <span>Sapiens First Movement</span>
          )}
        </div>
        <button
          type="button"
          className="close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <h2 id="record-title" tabIndex={-1}>
        {node.row.Name}
      </h2>
      <p className="purpose">{node.row.Purpose || "Purpose not documented."}</p>
      {isRole ? (
        <div className="row">
          <span className="lb">Filled by</span>
          <AssigneeChip row={node.row} />
        </div>
      ) : (
        <div className="row">
          <span className="lb">Inside</span>
          <span>
            {[
              circles.length ? plural(circles.length, "circle") : "",
              plural(roles.length, "role"),
            ]
              .filter(Boolean)
              .join(", ")}
          </span>
        </div>
      )}
      {!isRole && circles.length > 0 ? (
        <>
          <h3>Circles</h3>
          <SeeAllList
            items={circles}
            noun="circle"
            itemKey={(item) => item.row.ID}
            listClassName="links"
            renderItem={(item) => (
              <a href={recordUrl(item.row.ID)} data-opt-id={item.row.ID}>
                <Marker node={item} />
                {item.row.Name}
                <span className="n">{plural(roleCount(item), "role")}</span>
              </a>
            )}
          />
        </>
      ) : null}
      {!isRole && roles.length > 0 ? (
        <>
          <h3>Roles</h3>
          <SeeAllList
            items={roles}
            noun="role"
            itemKey={(item) => item.row.ID}
            listClassName="links"
            renderItem={(item) => (
              <a href={recordUrl(item.row.ID)} data-opt-id={item.row.ID}>
                {item.row.Name}
              </a>
            )}
          />
        </>
      ) : null}
      <h3>Accountabilities</h3>
      {accountabilities.length ? (
        <SeeAllList
          items={accountabilities}
          noun="accountability"
          itemKey={(item) => item}
          listClassName="items"
          renderItem={(item) => item}
        />
      ) : (
        <p className="empty">Not written down yet.</p>
      )}
      {isRole ? (
        <>
          <h3>Privileges</h3>
          {privileges.length ? (
            <SeeAllList
              items={privileges}
              noun="privilege"
              itemKey={(item) => item}
              listClassName="items"
              renderItem={(item) => item}
            />
          ) : (
            <p className="empty">Not written down yet.</p>
          )}
        </>
      ) : null}
      {node.row["Definition note"] ? (
        <p className="note">{node.row["Definition note"]}</p>
      ) : null}
    </div>
  );
}
