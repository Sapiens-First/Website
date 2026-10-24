import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { NextRequest, NextResponse } from "next/server.js";

const source = (path) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
const redirect = (destination) => {
  throw new Error(`redirect:${destination}`);
};
const compile = (path, dependencies = {}, env = {}) => {
  const exports = {};
  const code = ts.transpileModule(source(path), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const modules = {
    "server-only": {},
    react: { cache: (fn) => fn },
    "next/navigation": { redirect },
    "next/server": { NextResponse },
    ...dependencies,
  };
  new Function("require", "exports", "process", code)(
    (name) => {
      assert.ok(Object.hasOwn(modules, name), `Unexpected dependency: ${name}`);
      return modules[name];
    },
    exports,
    { env },
  );
  return exports;
};

test("auth origin rejects insecure remote URLs, credentials, paths and injected destinations", () => {
  const env = { APP_URL: "https://sapiensfirst.org" };
  const auth = compile(
    "lib/supabase/auth-server.ts",
    { "@supabase/ssr": {}, "next/headers": {} },
    env,
  );
  assert.equal(auth.getAppUrl(), "https://sapiensfirst.org");
  env.APP_URL = "http://localhost:3000";
  assert.equal(auth.getAppUrl(), "http://localhost:3000");
  for (const value of [
    undefined,
    "http://remote.example",
    "https://user:pass@example.org",
    "https://example.org/path",
    "https://example.org?next=evil",
    "https://example.org/#fragment",
  ]) {
    env.APP_URL = value;
    assert.throws(() => auth.getAppUrl());
  }
});

test("cookie writes fail visibly in actions; read-only rendering does not write cookies", async () => {
  let adapter;
  const auth = compile(
    "lib/supabase/auth-server.ts",
    {
      "@supabase/ssr": {
        createServerClient: (_url, _key, options) => {
          adapter = options.cookies;
          return {};
        },
      },
      "next/headers": {
        cookies: async () => ({
          getAll: () => [],
          set: () => {
            throw new Error("write failed");
          },
        }),
      },
    },
    {
      APP_URL: "http://localhost:3000",
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_PUBLISHABLE_KEY: "public-test",
    },
  );
  await auth.createAuthSupabaseClient();
  assert.throws(
    () => adapter.setAll([{ name: "session", value: "value", options: {} }]),
    /write failed/,
  );
  await auth.createAuthSupabaseClient(true);
  assert.doesNotThrow(() =>
    adapter.setAll([{ name: "session", value: "value", options: {} }]),
  );
});

test("proxy preserves successive cookie writes, forwards refreshed cookies and prevents shared caching", async () => {
  const proxyModule = compile("proxy.ts", {
    "@/lib/supabase/auth-server": {
      getAuthConfig: () => ({
        url: "https://example.supabase.co",
        key: "test",
        secure: false,
      }),
    },
    "@supabase/ssr": {
      createServerClient: (_url, _key, { cookies }) => ({
        auth: {
          getClaims: async () => {
            cookies.setAll(
              [{ name: "session.0", value: "a", options: { path: "/" } }],
              {
                "Cache-Control": "private, no-store",
                Expires: "0",
                Pragma: "no-cache",
              },
            );
            cookies.setAll(
              [{ name: "session.1", value: "b", options: { path: "/" } }],
              {},
            );
            return { data: { claims: {} }, error: null };
          },
        },
      }),
    },
  });
  const request = new NextRequest("http://localhost:3000/dashboard");
  const response = await proxyModule.proxy(request);
  assert.equal(request.cookies.get("session.0").value, "a");
  assert.equal(response.cookies.get("session.0").value, "a");
  assert.equal(response.cookies.get("session.1").value, "b");
  assert.match(response.headers.get("cache-control"), /private.*no-store/);
  assert.equal(response.headers.get("expires"), "0");
  assert.equal(response.headers.get("pragma"), "no-cache");
});

test("callback rejects missing/error codes and failed exchanges without provisioning", async () => {
  let exchanges = 0;
  let profiles = 0;
  const callback = compile("app/auth/callback/route.ts", {
    "@/lib/supabase/auth-server": {
      getAppUrl: () => "https://sapiensfirst.org",
      createAuthSupabaseClient: async () => ({
        auth: {
          exchangeCodeForSession: async () => {
            exchanges++;
            return { error: new Error("expired") };
          },
        },
      }),
    },
    "@/lib/members/access": {
      ensureProfile: async () => {
        profiles++;
      },
    },
  });
  for (const query of [
    "",
    "?error=access_denied&code=unused",
    "?code=expired",
  ]) {
    const response = await callback.GET(
      new NextRequest(`http://untrusted.example/auth/callback${query}`),
    );
    assert.equal(response.status, 303);
    assert.equal(
      response.headers.get("location"),
      "https://sapiensfirst.org/join?error=callback",
    );
    assert.match(response.headers.get("cache-control"), /no-store/);
  }
  assert.equal(exchanges, 1);
  assert.equal(profiles, 0);
});

test("callback provisions only verified user ID, ignores external next URL and handles profile failure", async () => {
  let failProfile = false;
  const client = {
    auth: {
      exchangeCodeForSession: async () => ({ error: null }),
      getUser: async () => ({
        data: { user: { id: "verified-id" } },
        error: null,
      }),
    },
  };
  const callback = compile("app/auth/callback/route.ts", {
    "@/lib/supabase/auth-server": {
      getAppUrl: () => "https://sapiensfirst.org",
      createAuthSupabaseClient: async () => client,
    },
    "@/lib/members/access": {
      ensureProfile: async (provided, id) => {
        assert.equal(provided, client);
        assert.equal(id, "verified-id");
        if (failProfile) throw new Error("unavailable");
      },
    },
  });
  const request = new NextRequest(
    "https://untrusted.example/auth/callback?code=valid&next=https://evil.example&user_id=attacker",
  );
  assert.equal(
    (await callback.GET(request)).headers.get("location"),
    "https://sapiensfirst.org/dashboard",
  );
  failProfile = true;
  assert.equal(
    (await callback.GET(request)).headers.get("location"),
    "https://sapiensfirst.org/join?error=profile",
  );
  client.auth.getUser = async () => ({
    data: { user: null },
    error: new Error("invalid"),
  });
  assert.equal(
    (await callback.GET(request)).headers.get("location"),
    "https://sapiensfirst.org/join?error=callback",
  );
});

const accessModule = (client) =>
  compile("lib/members/access.ts", {
    "./profile": compile("lib/members/profile.ts"),
    "@/lib/supabase/auth-server": {
      createAuthSupabaseClient: async () => client,
    },
    "@supabase/supabase-js": {
      isAuthSessionMissingError: (error) => error.code === "missing",
    },
  });

test("account guard rejects missing/invalid sessions and fails closed on Auth outages", async () => {
  const client = {
    auth: {
      getUser: async () => ({
        data: { user: null },
        error: { code: "missing" },
      }),
    },
  };
  const access = accessModule(client);
  await assert.rejects(access.requireMember(), /redirect:\/join$/);
  client.auth.getUser = async () => ({
    data: { user: null },
    error: { status: 401 },
  });
  assert.equal(await access.getCurrentAccount(), null);
  client.auth.getUser = async () => ({
    data: { user: null },
    error: { status: 503 },
  });
  await assert.rejects(access.requireMember(), /temporarily unavailable/);
});

test("profile creation never sends saved fields, ownership or timestamp updates", async () => {
  let calls = 0;
  const client = {
    from: (table) => {
      assert.equal(table, "profiles");
      return {
        upsert: async (payload, options) => {
          assert.deepEqual(payload, { id: "verified-id" });
          assert.deepEqual(options, {
            onConflict: "id",
            ignoreDuplicates: true,
          });
          calls++;
          return { error: null };
        },
      };
    },
  };
  const access = accessModule(client);
  await access.ensureProfile(client, "verified-id");
  await access.ensureProfile(client, "verified-id");
  assert.equal(calls, 2);
});

test("account reads are scoped to verified UUID; missing profiles have a recovery destination", async () => {
  let profile = {
    id: "verified-id",
    full_name: "Saved name",
    country_code: "US",
    city: "Boston",
  };
  const client = {
    auth: {
      getUser: async () => ({
        data: { user: { id: "verified-id" } },
        error: null,
      }),
    },
    from: () => ({
      select: () => ({
        eq: (column, id) => {
          assert.equal(column, "id");
          assert.equal(id, "verified-id");
          return { maybeSingle: async () => ({ data: profile, error: null }) };
        },
      }),
    }),
  };
  const access = accessModule(client);
  assert.equal((await access.requireMember()).profile.full_name, "Saved name");
  profile = {
    id: "verified-id",
    full_name: "Saved name",
    country_code: "ZZ",
    city: "Boston",
  };
  await assert.rejects(access.requireMember(), /redirect:\/onboarding/);
  assert.equal(
    (await access.requireAccountProfile()).profile.full_name,
    "Saved name",
  );
  profile = null;
  await assert.rejects(
    access.requireMember(),
    /redirect:\/join\?error=profile/,
  );
});

const profileModule = compile("lib/members/profile.ts");
const validProfile = {
  full_name: "Test Member",
  country_code: "US",
  city: "Boston",
  region: "",
  postal_code: "",
  phone: "",
  address_line_1: "",
  address_line_2: "",
};
const formProfile = (changes = {}) => {
  const data = new FormData();
  for (const [field, value] of Object.entries({ ...validProfile, ...changes }))
    data.append(field, value);
  return data;
};

test("completion uses required stored values and recognized countries; optional details may be blank", () => {
  assert.equal(profileModule.countryCodes.length, 249);
  assert.equal(new Set(profileModule.countryCodes).size, 249);
  assert.equal(profileModule.isProfileComplete(validProfile), true);
  for (const changes of [
    { full_name: " " },
    { city: null },
    { country_code: "ZZ" },
    { country_code: "UK" },
  ]) {
    assert.equal(
      profileModule.isProfileComplete({ ...validProfile, ...changes }),
      false,
    );
  }
  const parsed = profileModule.validateProfile({
    ...validProfile,
    full_name: "  李 明  ",
    country_code: " in ",
    postal_code: "00123",
  });
  assert.deepEqual(parsed.errors, {});
  assert.equal(parsed.values.full_name, "李 明");
  assert.equal(parsed.values.country_code, "IN");
  assert.equal(profileModule.profileUpdate(parsed.values).postal_code, "00123");
  assert.equal(profileModule.profileUpdate(parsed.values).phone, null);
});

test("profile validation enforces every field limit and rejects files, duplicate values, controls and phone text", () => {
  for (const [field, { limit }] of Object.entries(
    profileModule.profileFields,
  )) {
    const result = profileModule.validateProfile({
      ...validProfile,
      [field]: "x".repeat(limit + 1),
    });
    assert.ok(result.errors[field], field);
  }
  for (const changes of [
    { full_name: ["first", "second"] },
    { phone: "call me" },
    { city: "two\nlines" },
    { postal_code: new File(["text"], "upload.txt") },
  ]) {
    assert.ok(
      Object.keys(
        profileModule.validateProfile({ ...validProfile, ...changes }).errors,
      ).length,
    );
  }
  assert.deepEqual(
    profileModule.validateProfile({
      ...validProfile,
      phone: "+1 (202) 555-0123",
      postal_code: "SW1A 1AA",
      country_code: "GB",
    }).errors,
    {},
  );
});

test("Google name is only a suggestion and never overwrites an existing name", () => {
  assert.equal(
    profileModule.initialProfileValues({ full_name: "Saved" }, "Google name")
      .full_name,
    "Saved",
  );
  assert.equal(
    profileModule.initialProfileValues({}, "Google name").full_name,
    "Google name",
  );
  assert.equal(
    profileModule.initialProfileValues({}, { name: "unexpected" }).full_name,
    "",
  );
});

const onboardingAction = (client) =>
  compile("app/onboarding/actions.ts", {
    "@/lib/supabase/auth-server": {
      createAuthSupabaseClient: async (readOnly) => {
        assert.notEqual(readOnly, true);
        return client;
      },
    },
    "@/lib/members/profile": profileModule,
    "@supabase/supabase-js": {
      isAuthSessionMissingError: (error) => error.code === "missing",
    },
  });

test("onboarding reauthenticates, whitelists fields and saves only the verified account", async () => {
  let updated = 0;
  const client = {
    auth: {
      getUser: async () => ({
        data: { user: { id: "verified-id" } },
        error: null,
      }),
    },
    from: (table) => {
      assert.equal(table, "profiles");
      return {
        update: (payload) => {
          updated++;
          assert.equal(payload.full_name, "Test Member");
          assert.equal(payload.phone, null);
          for (const forbidden of [
            "id",
            "is_paid",
            "role",
            "created_at",
            "onboarding_completed_at",
          ])
            assert.equal(Object.hasOwn(payload, forbidden), false);
          return {
            eq: (field, value) => {
              assert.equal(field, "id");
              assert.equal(value, "verified-id");
              return {
                select: () => ({
                  single: async () => ({ data: payload, error: null }),
                }),
              };
            },
          };
        },
      };
    },
  };
  const form = formProfile();
  form.append("id", "victim-id");
  form.append("is_paid", "true");
  form.append("role", "admin");
  await assert.rejects(
    onboardingAction(client).saveProfile({ values: { id: "victim-id" } }, form),
    /redirect:\/dashboard/,
  );
  assert.equal(updated, 1);
  client.auth.getUser = async () => ({
    data: { user: null },
    error: { code: "missing" },
  });
  await assert.rejects(
    onboardingAction(client).saveProfile({}, form),
    /redirect:\/join$/,
  );
  assert.equal(updated, 1);
});

test("onboarding preserves submitted values on validation, Auth outage, database errors and zero-row saves", async () => {
  let error = null;
  let saved = null;
  const client = {
    auth: {
      getUser: async () => ({
        data: { user: { id: "verified-id" } },
        error: null,
      }),
    },
    from: () => ({
      update: () => ({
        eq: () => ({
          select: () => ({ single: async () => ({ data: saved, error }) }),
        }),
      }),
    }),
  };
  const action = onboardingAction(client);
  const invalid = formProfile({ city: " " });
  let state = await action.saveProfile({}, invalid);
  assert.ok(state.errors.city);
  assert.equal(state.values.full_name, "Test Member");
  const duplicates = formProfile();
  duplicates.append("city", "Other town");
  state = await action.saveProfile({}, duplicates);
  assert.ok(state.errors.city);
  state = await action.saveProfile({}, formProfile());
  assert.match(state.message, /couldn’t save/);
  error = { message: "database unavailable" };
  state = await action.saveProfile({}, formProfile());
  assert.equal(state.values.city, "Boston");
  assert.match(state.message, /couldn’t save/);
  saved = { ...validProfile, city: null };
  error = null;
  state = await action.saveProfile({}, formProfile());
  assert.match(state.message, /couldn’t save/);
  client.auth.getUser = async () => ({
    data: { user: null },
    error: { status: 503 },
  });
  state = await action.saveProfile({}, formProfile());
  assert.match(state.message, /temporarily unavailable/);
});

test("sign-in uses configured callback; sign-out explicitly targets current session", async () => {
  let oauthOptions;
  let scope;
  const actions = compile("app/auth/actions.ts", {
    "@/lib/supabase/auth-server": {
      getAppUrl: () => "http://localhost:3000",
      createAuthSupabaseClient: async () => ({
        auth: {
          signInWithOAuth: async (options) => {
            oauthOptions = options;
            return {
              data: { url: "https://provider.example/authorize" },
              error: null,
            };
          },
          signOut: async (options) => {
            scope = options.scope;
            return { error: null };
          },
        },
      }),
    },
  });
  await assert.rejects(
    actions.signInWithGoogle(),
    /redirect:https:\/\/provider.example\/authorize/,
  );
  assert.equal(oauthOptions.provider, "google");
  assert.equal(
    oauthOptions.options.redirectTo,
    "http://localhost:3000/auth/callback",
  );
  await assert.rejects(actions.signOut(), /redirect:\/join$/);
  assert.equal(scope, "local");
});
