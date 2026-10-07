"use client";

import { alignmentMatrix, type AtlasData } from "@/lib/atlas/model";
import { RecordLink } from "@/components/atlas/RecordDetails";

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
      <div className={"mb-3 flex"}>
        <div
          className={
            'inline-flex gap-0.5 rounded-lg border border-solid border-line bg-surface p-0.5 [&_button]:cursor-pointer [&_button]:rounded-sm [&_button]:border-0 [&_button]:bg-transparent [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-xs [&_button]:font-semibold [&_button]:text-ink [&_button]:[font:inherit] [&_button[aria-pressed="true"]]:bg-white [&_button[aria-pressed="true"]]:font-bold [&_button[aria-pressed="true"]]:text-ink [&_button[aria-pressed="true"]]:[box-shadow:0_1px_2px_rgba(17,_17,_17,_0.12)]'
          }
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
        <div
          className={"max-w-2xl px-2 py-8 [&_p]:text-sm [&_p]:leading-relaxed"}
        >
          <p>No cross-cutting relationships are recorded yet.</p>
          <p className={"mt-2.5 text-xs text-ink"}>
            This view connects projects and programs to the goals they support.
          </p>
        </div>
      ) : (
        <>
          <div
            className="max-h-180 overflow-auto rounded-lg border border-solid border-line"
            tabIndex={0}
            role="region"
            aria-label="Alignment matrix"
          >
            <table className="w-full border-separate border-spacing-0 text-sm [&_:is(th,td)]:max-w-sm [&_:is(th,td)]:leading-normal [&_:is(th,td)]:wrap-anywhere [&_tbody_th]:sticky [&_tbody_th]:left-0 [&_tbody_th]:z-1 [&_tbody_th]:min-w-44 [&_tbody_th]:border-b [&_tbody_th]:border-rule [&_tbody_th]:bg-white [&_tbody_th]:p-3.5 [&_tbody_th]:text-left [&_tbody_th]:font-semibold [&_td]:min-w-24 [&_td]:border-b [&_td]:border-rule [&_td]:p-3.5 [&_td]:text-center [&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-2 [&_thead_th]:border-b [&_thead_th]:border-line [&_thead_th]:bg-white [&_thead_th]:px-3.5 [&_thead_th]:py-3 [&_thead_th]:align-bottom [&_thead_th]:text-xs [&_thead_th]:font-bold [&_thead_th]:tracking-wider [&_thead_th]:uppercase">
              <caption className="absolute h-px w-px overflow-hidden [clip-path:inset(50%)]">
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
                        col.ID === highlighted
                          ? "bg-[color-mix(in_srgb,var(--color-coral)_6%,transparent)] [&_button]:text-coral-dark"
                          : undefined
                      }
                    >
                      <button
                        className="cursor-pointer border-0 bg-transparent text-xs font-bold tracking-wide whitespace-nowrap text-ink uppercase [font:inherit] [writing-mode:horizontal-tb] hover:text-coral-dark"
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
                          selected === row.ID
                            ? "shadow-[inset_3px_0_0_var(--color-coral-dark)]"
                            : undefined
                        }
                      >
                        <RecordLink id={row.ID} format="alignment" />
                      </th>
                      {cols.map((col) => {
                        const relation = cells.get(`${row.ID}|${col.ID}`);
                        return (
                          <td
                            key={col.ID}
                            className={col.ID === highlighted ? "" : undefined}
                          >
                            {relation && (
                              <span
                                className={"text-sm text-coral-dark"}
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
          <p className={"mt-3 text-xs leading-relaxed text-ink"}>
            Select a name to read its details. Select a column to highlight
            everything supporting that priority.
          </p>
        </>
      )}
    </div>
  );
}
