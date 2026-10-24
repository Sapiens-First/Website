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
  let profile = { id: "verified-id", full_name: "Saved name" };
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
  profile = null;
  await assert.rejects(
    access.requireMember(),
    /redirect:\/join\?error=profile/,
  );
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
