"use client";

import { alignmentMatrix, type AtlasData } from "@/lib/atlas/model";
import { RecordLink } from "@/components/RecordDetails";

export default function Alignment({
  data,
  selected,
  rowType,
  setRowType,
  highlighted,
  setHighlighted,
}: {
  data: AtlasData;
  selected: string;
  rowType: string;
  setRowType: (type: string) => void;
  highlighted: string;
  setHighlighted: (id: string) => void;
}) {
  const { rows, cols, cells } = alignmentMatrix(data, rowType);
  return (
    <div id="atlas-alignment-matrix">
      <div className="atlas-alignment-toolbar flex mb-3">
        <div
          className="atlas-alignment-switch inline-flex gap-0.5"
          role="group"
          aria-label="Alignment rows"
        >
          {["Project", "Program"].map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={type === rowType}
              onClick={() => {
                setRowType(type);
                setHighlighted("");
              }}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>
      {!cols.length ? (
        <div className="atlas-alignment-empty py-8 px-2 max-w-2xl">
          <p>No cross-cutting relationships are recorded yet.</p>
          <p className="atlas-alignment-empty-detail mt-2.5 text-xs text-ink">
            This view connects projects and programs to the goals they support.
          </p>
        </div>
      ) : (
        <>
          <div
            className="atlas-alignment-scroll overflow-auto border border-solid border-line rounded-lg"
            tabIndex={0}
            role="region"
            aria-label="Alignment matrix"
          >
            <table className="atlas-alignment-table">
              <caption className="atlas-sr-only absolute w-px h-px overflow-hidden">
                {rowType}s and what they support
              </caption>
              <thead>
                <tr>
                  <th />
                  {cols.map((col) => (
                    <th
                      scope="col"
                      key={col.ID}
                      className={
                        col.ID === highlighted ? "is-highlighted" : undefined
                      }
                    >
                      <button
                        className="atlas-alignment-col-header text-xs font-bold uppercase tracking-wide border-0 cursor-pointer whitespace-nowrap"
                        type="button"
                        aria-pressed={col.ID === highlighted}
                        onClick={() =>
                          setHighlighted(col.ID === highlighted ? "" : col.ID)
                        }
                      >
                        {col.Name}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows
                  .filter((row) =>
                    cols.some((col) => cells.has(`${row.ID}|${col.ID}`)),
                  )
                  .map((row) => (
                    <tr key={row.ID}>
                      <th
                        scope="row"
                        className={
                          selected === row.ID ? "is-selected" : undefined
                        }
                      >
                        <RecordLink id={row.ID} format="alignment" />
                      </th>
                      {cols.map((col) => {
                        const relation = cells.get(`${row.ID}|${col.ID}`);
                        return (
                          <td
                            key={col.ID}
                            className={
                              col.ID === highlighted
                                ? "is-highlighted"
                                : undefined
                            }
                          >
                            {relation && (
                              <span
                                className="atlas-alignment-mark text-sm text-coral-dark"
                                role="img"
                                aria-label={`${row.Name} supports ${col.Name}`}
                                title={relation.Notes || undefined}
                              >
                                ●
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="atlas-alignment-hint text-xs leading-relaxed mt-3 text-ink">
            Select a name to read its details. Select a column to highlight
            everything supporting that priority.
          </p>
        </>
      )}
    </div>
  );
}
