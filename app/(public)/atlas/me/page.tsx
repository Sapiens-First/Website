import type { Metadata } from "next";
import { requireAccountProfile } from "@/lib/members/access";
import { pageMetadata } from "@/lib/site";
import { loadPublicAtlas } from "@/lib/atlas/data";
import { loadMyRoles } from "@/lib/atlas/me";
import { circleLayout } from "@/lib/atlas/circles";
import MyRolesView from "@/components/atlas/MyRolesView";

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
  const account = await requireAccountProfile("/atlas/me");
  const [roles, atlas] = await Promise.all([
    loadMyRoles(account.supabase),
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
      name={account.profile.full_name?.trim() || ""}
      email={account.user.email || ""}
      roles={decorated}
    />
  );
}
