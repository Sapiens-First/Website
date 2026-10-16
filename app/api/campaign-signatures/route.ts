import {
  campaigns,
  consentVersion,
  isSignatureReceipt,
  parseSignature,
} from "@/lib/campaigns";
import { site } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  const error = (message: string, status: number) =>
    Response.json({ error: message }, { status, headers });
  const origin = request.headers.get("origin");
  const requestOrigin = `${new URL(request.url).protocol}//${request.headers.get("host")}`;
  if (
    origin &&
    origin !== requestOrigin &&
    origin !== site.url &&
    origin !== "https://www.sapiensfirst.org"
  )
    return error("Please sign from the Sapiens First website.", 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return error("Invalid request.", 415);
  if (Number(request.headers.get("content-length")) > 8192)
    return error("Your submission is too large.", 413);
  const body = await request.text();
  if (body.length > 8192) return error("Your submission is too large.", 413);
  let value: unknown;
  try {
    value = JSON.parse(body);
  } catch {
    return error("Invalid request.", 400);
  }
  const signature = parseSignature(value);
  if (!signature)
    return error(
      "Check your email and optional contact details, and confirm your support.",
      400,
    );
  try {
    const response = await fetch(site.signupScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({
        ...signature,
        action: "campaign-signature",
        demandVersion: campaigns[signature.campaignId].demandVersion,
        consentVersion,
      }),
      signal: AbortSignal.timeout(25000),
      cache: "no-store",
      redirect: "follow",
    });
    const receipt: unknown = await response.json();
    if (!response.ok || !isSignatureReceipt(receipt, signature.campaignId))
      throw new Error("Unconfirmed receipt");
    return Response.json(
      {
        receiptId: receipt.receiptId,
        signedAt: receipt.signedAt,
        updatesOptIn: receipt.updatesOptIn,
      },
      { headers },
    );
  } catch {
    return error(
      "We couldn’t confirm your signature. Please try again; a retry won’t add a duplicate signature.",
      503,
    );
  }
}
