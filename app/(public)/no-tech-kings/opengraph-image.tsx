import { ImageResponse } from "next/og";
import { campaignMeta } from "@/lib/no-tech-kings/copy";

export const alt = `${campaignMeta.title}. ${campaignMeta.description} A campaign of Sapiens First.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function barlowExtraBold(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800&display=swap",
      {
        signal: AbortSignal.timeout(4000),
        headers: {
          // An older user agent makes Google Fonts return a TTF, which Satori can load.
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko",
        },
      },
    );
    if (!css.ok) return null;
    const match = (await css.text()).match(/url\((https:[^)]+)\)/);
    if (!match) return null;
    const font = await fetch(match[1]);
    if (!font.ok) return null;
    return font.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const font = await barlowExtraBold();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#fffdf5",
        color: "#18251f",
        padding: "72px 76px 0",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.14em",
            color: "#8d3a32",
            fontWeight: 800,
          }}
        >
          DECEMBER 14, 2026
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 132,
            lineHeight: 0.86,
            letterSpacing: "-0.03em",
            fontWeight: 800,
            textTransform: "uppercase",
            fontFamily: font ? "Barlow Condensed" : "sans-serif",
          }}
        >
          No Tech Kings
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 42,
            lineHeight: 1.15,
          }}
        >
          We are the Human Revolution.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            alignSelf: "flex-start",
            background: "#ffc928",
            color: "#18251f",
            fontSize: 28,
            fontWeight: 800,
            lineHeight: 1,
            padding: "12px 18px",
            borderRadius: 999,
          }}
        >
          Humans, not dinosaurs.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: -76,
          marginRight: -76,
          background: "#16344a",
          color: "#fffdf5",
          padding: "28px 76px",
          fontSize: 30,
          fontWeight: 800,
        }}
      >
        <div style={{ display: "flex" }}>Outside Anthropic, San Francisco</div>
        <div style={{ display: "flex", color: "#ffc928" }}>
          A campaign of Sapiens First
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: font
        ? [
            {
              name: "Barlow Condensed",
              data: font,
              weight: 800,
              style: "normal",
            },
          ]
        : undefined,
    },
  );
}
