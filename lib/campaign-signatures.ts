import "server-only";
import { cache } from "react";

import { getPublicAccount } from "@/lib/members/access";
import { isProfileComplete } from "@/lib/members/profile";
import type { CampaignId } from "@/lib/campaigns";

export const getCampaignSignatureState = cache(
  async (campaignId: CampaignId) => {
    const { account, unavailable } = await getPublicAccount();
    if (unavailable) return { state: "unavailable" } as const;
    if (!account) return { state: "signed-out" } as const;
    const { data: profile, error } = await account.supabase
      .from("profiles")
      .select("full_name,country_code,city")
      .eq("id", account.user.id)
      .maybeSingle();
    if (error) return { state: "unavailable" } as const;
    if (!profile || !isProfileComplete(profile))
      return { state: "incomplete" } as const;
    if (!account.user.email || !account.user.email_confirmed_at)
      return { state: "unavailable" } as const;
    const { data, error: signatureError } = await account.supabase
      .from("campaign_signatures")
      .select("signed_at,email_updates")
      .eq("member_id", account.user.id)
      .eq("campaign_id", campaignId)
      .maybeSingle();
    if (signatureError) return { state: "unavailable" } as const;
    return {
      state: "member",
      email: account.user.email,
      signature: data,
    } as const;
  },
);
