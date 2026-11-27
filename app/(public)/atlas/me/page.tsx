import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPublicAccount, requireAccountProfile } from "@/lib/members/access";
import { pageMetadata } from "@/lib/site";
import { loadPublicAtlas } from "@/lib/atlas/data";
import { loadMyRoles } from "@/lib/atlas/me";
import { circleLayout } from "@/lib/atlas/circles";
import MyRolesView from "@/components/atlas/MyRolesView";
import { Kicker } from "@/components/ui/Text";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "My roles",
    description: "Roles linked to your Sapiens First account.",
    path: "/atlas/me",
  }),
  robots: { index: false, follow: false },
};

export default async function Page() {
  const { account, unavailable } = await getPublicAccount();
  if (unavailable) {
    return (
      <main className="mx-auto w-full max-w-[640px] px-4 pt-16 pb-16 sm:px-6">
        <Kicker className="mb-3">Atlas</Kicker>
        <h1 className="text-[40px] leading-[0.95] tracking-tight normal-case">
          Sign-in is temporarily unavailable
        </h1>
        <p className="mt-3 text-lg text-ink">
          You can still explore the map. Try signing in again in a moment.
        </p>
        <Link
          href="/atlas"
          className="mt-6 inline-flex min-h-11 items-center font-semibold underline underline-offset-2"
        >
          Back to Atlas
        </Link>
      </main>
    );
  }
  if (!account) redirect("/join?next=/atlas/me");
  const signedIn = await requireAccountProfile("/atlas/me");
  const [roles, atlas] = await Promise.all([
    loadMyRoles(signedIn.supabase),
    loadPublicAtlas(),
  ]);
  const model = circleLayout(atlas.governance);
  const decorated = roles.map((role) => {
    const node = model.nodes.get(role.governanceId);
    const circle = node?.parent;
    const above = circle?.parent;
    return {
      ...role,
      hue: circle?.hue || node?.hue || "#ED3B91",
      circleName: role.circleName || circle?.row.Name || "",
      parentName:
        above && above.kind !== "outer" ? above.row.Name : role.parentName,
    };
  });
  return (
    <MyRolesView
      name={signedIn.profile.full_name?.trim() || ""}
      email={signedIn.user.email || ""}
      roles={decorated}
    />
  );
}
