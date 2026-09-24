import React, { useState, useMemo } from "react";
import { Highlight } from "prism-react-renderer";
import type { PrismTheme } from "prism-react-renderer";

export interface MethodSpec {
  id: string;
  module: string;
  method: string;
  signature: string;
  description: string;
  paramsExample: string;
  returnType: string;
  snippet: string;
  mockResponse: unknown;
  category: "core" | "data" | "device" | "network";
}

const METHODS: MethodSpec[] = [
  // ── Core ──────────────────────────────────────────
  {
    id: "auth-getUser",
    module: "auth",
    method: "getUser",
    signature: "sdk.auth.getUser(): Promise<PlatformUser | null>",
    description: "Fetches the profile of the logged-in platform user.",
    paramsExample: "None",
    returnType: "Promise<PlatformUser | null>",
    snippet: `const user = await sdk.auth.getUser();
console.log(user?.name, user?.email);`,
    mockResponse: {
      id: "usr_99812",
      name: "Bikram Adhikari",
      email: "bikram.adhikari@sewa.gov.np",
      roles: ["citizen", "taxpayer"],
    },
    category: "core",
  },
  {
    id: "auth-isAuthenticated",
    module: "auth",
    method: "isAuthenticated",
    signature: "sdk.auth.isAuthenticated(): Promise<boolean>",
    description: "Checks if the current user session is authenticated.",
    paramsExample: "None",
    returnType: "Promise<boolean>",
    snippet: `const isAuth = await sdk.auth.isAuthenticated();
if (isAuth) {
  // User is logged in
}`,
    mockResponse: true,
    category: "core",
  },
  {
    id: "auth-logout",
    module: "auth",
    method: "logout",
    signature: "sdk.auth.logout(): Promise<void>",
    description: "Triggers host logout flow and clears the cached session.",
    paramsExample: "None",
    returnType: "Promise<void>",
    snippet: `await sdk.auth.logout();
// Redirect to login screen`,
    mockResponse: { success: true },
    category: "core",
  },
  {
    id: "permissions-has",
    module: "permissions",
    method: "has",
    signature: 'sdk.permissions.has(permission: string): Promise<boolean>',
    description: "Checks if the mini app has been granted a specific permission.",
    paramsExample: '"camera"',
    returnType: "Promise<boolean>",
    snippet: `const canUseCamera = await sdk.permissions.has("camera");
if (canUseCamera) {
  const capture = await sdk.device.camera();
}`,
    mockResponse: true,
    category: "core",
  },
  {
    id: "permissions-list",
    module: "permissions",
    method: "list",
    signature: "sdk.permissions.list(): Promise<string[]>",
    description: "Returns all permissions granted to this mini app.",
    paramsExample: "None",
    returnType: "Promise<string[]>",
    snippet: `const permissions = await sdk.permissions.list();
// ["camera", "location", "storage", "biometric"]`,
    mockResponse: ["camera", "location", "storage", "biometric"],
    category: "core",
  },
  {
    id: "platform-type",
    module: "platform",
    method: "type / os / formFactor",
    signature: 'sdk.platform.type: "web" | "mobile"',
    description:
      "Where your mini app is running. Synchronous, so it can be read during a render pass.",
    paramsExample: "None",
    returnType: '"web" | "mobile"',
    snippet: `if (sdk.platform.isPhone()) {
      renderSingleColumn();
    } else {
      renderTwoColumn();
    }

    sdk.platform.os;         // "ios" | "android" | "web"
    sdk.platform.formFactor; // "phone" | "tablet" | "desktop"`,
    mockResponse: { type: "web", os: "web", formFactor: "desktop", isWeb: true, isMobile: false },
    category: "core",
  },

  // ── Data ──────────────────────────────────────────
  {
    id: "storage-setJson",
    module: "storage",
    method: "setJson",
    signature:
      "sdk.storage.setJson(key: string, value: T, options?: StorageOptions): Promise<void>",
    description: "Stores a JSON-serializable value in platform secure storage.",
    paramsExample: '"draft_form", { step: 2 }, { ttlMs: 86400000 }',
    returnType: "Promise<void>",
    snippet: `await sdk.storage.setJson("draft_form", { step: 2 }, {
  ttlMs: 86400000, // 24 hours
});`,
    mockResponse: { success: true, storedKey: "draft_form" },
    category: "data",
  },
  {
    id: "storage-getJson",
    module: "storage",
    method: "getJson",
    signature: "sdk.storage.getJson<T>(key: string): Promise<T | null>",
    description: "Reads and parses a JSON value from storage.",
    paramsExample: '"draft_form"',
    returnType: "Promise<T | null>",
    snippet: `const draft = await sdk.storage.getJson<{ step: number }>("draft_form");
if (draft) {
  resumeForm(draft.step);
}`,
    mockResponse: { step: 2, taxId: "99120" },
    category: "data",
  },
  {
    id: "storage-scoped",
    module: "storage",
    method: "scoped",
    signature: "sdk.storage.scoped(prefix: string): StorageSdkModule",
    description:
      "Creates a sub-scoped storage module where all keys are auto-prefixed.",
    paramsExample: '"user_settings"',
    returnType: "StorageSdkModule",
    snippet: `const userStore = sdk.storage.scoped("user_settings");
await userStore.set("theme", "dark");
const theme = await userStore.get("theme");`,
    mockResponse: { scopedPrefix: "user_settings:", created: true },
    category: "data",
  },

  // ── Device ────────────────────────────────────────
  {
    id: "device-location",
    module: "device",
    method: "location",
    signature:
      "sdk.device.location(options?: LocationOptions): Promise<DevicePermissionResponse<DeviceLocationResult>>",
    description: "Requests device GPS coordinates via host location provider.",
    paramsExample: "{ highAccuracy: true }",
    returnType: "Promise<DevicePermissionResponse<DeviceLocationResult>>",
    snippet: `const res = await sdk.device.location({ highAccuracy: true });
if (res.granted) {
  console.log(res.data.latitude, res.data.longitude);
}`,
    mockResponse: {
      granted: true,
      data: { latitude: 27.717243, longitude: 85.324021, accuracy: 4.8 },
    },
    category: "device",
  },
  {
    id: "device-camera",
    module: "device",
    method: "camera",
    signature:
      "sdk.device.camera(options?: CameraOptions): Promise<DevicePermissionResponse<DeviceCameraResult>>",
    description: "Captures a photo using the native camera bridge.",
    paramsExample: "{ quality: 0.8 }",
    returnType: "Promise<DevicePermissionResponse<DeviceCameraResult>>",
    snippet: `const capture = await sdk.device.camera({ quality: 0.8 });
if (capture.granted) {
  setImageUri(capture.data.imageUri);
}`,
    mockResponse: {
      granted: true,
      data: { imageUri: "data:image/jpeg;base64,...", width: 1920, height: 1080 },
    },
    category: "device",
  },
  {
    id: "device-biometric",
    module: "device",
    method: "biometric",
    signature:
      "sdk.device.biometric(options?: BiometricOptions): Promise<DevicePermissionResponse<DeviceBiometricResult>>",
    description: "Authenticates citizen via TouchID / FaceID / Fingerprint.",
    paramsExample: '{ reason: "Confirm payment of Rs. 1,500" }',
    returnType: "Promise<DevicePermissionResponse<DeviceBiometricResult>>",
    snippet: `const auth = await sdk.device.biometric({
  reason: "Confirm transaction"
});
if (auth.granted && auth.data.authenticated) {
  completePayment();
}`,
    mockResponse: {
      granted: true,
      data: { authenticated: true, type: "fingerprint", timestamp: Date.now() },
    },
    category: "device",
  },

  // ── Backend calls ─────────────────────────────────
  {
    id: "api-request",
    module: "api",
    method: "request",
    signature:
      "sdk.api.request<T>(method: string, params: ApiRequestParams): Promise<ApiResult<T>>",
    description:
      "Calls your own backend. Sewa routes the path to the backend registered for your mini app, so your frontend never holds its address.",
    paramsExample: '"POST", { path: "/v1/quota", body: { vehicleNumber } }',
    returnType: "Promise<ApiResult<T>>",
    snippet: `const res = await sdk.api.request("POST", {
  path: "/v1/quota",
  body: { vehicleNumber: "WP CAB-1234" },
});

if (res.status >= 400) return showProblem(res.data);
render(res.data);`,
    mockResponse: {
      status: 200,
      data: { allocatedLitres: 20, usedLitres: 12.5, remainingLitres: 7.5 },
      headers: { "content-type": "application/json" },
    },
    category: "network",
  },
  {
    id: "api-request-query",
    module: "api",
    method: "request",
    signature:
      "sdk.api.request<T>(method: string, params: ApiRequestParams): Promise<ApiResult<T>>",
    description:
      "A query object is folded into the path as a query string, so no routing information is lost.",
    paramsExample: '"GET", { path: "/v1/transactions", query: { page: "2" } }',
    returnType: "Promise<ApiResult<T>>",
    snippet: `const res = await sdk.api.request("GET", {
  path: "/v1/transactions",
  query: { from: "2026-09-01", page: "2" },
});
// your backend sees /v1/transactions?from=2026-09-01&page=2`,
    mockResponse: {
      status: 200,
      data: { page: 2, items: [{ id: "txn_1", litres: 5 }] },
      headers: { "content-type": "application/json" },
    },
    category: "network",
  },
  {
    id: "api-request-stream",
    module: "api",
    method: "request",
    signature:
      "sdk.api.request(method: string, params: ApiRequestParams & { stream: true }): Promise<StreamBuilder>",
    description:
      "Streaming call. Returns raw bytes from your backend; parse Server-Sent Events with sdk.stream.parseSseStream.",
    paramsExample: '"POST", { path: "/v1/chat", body: { message }, stream: true }',
    returnType: "Promise<StreamBuilder>",
    snippet: `const stream = await sdk.api.request("POST", {
  path: "/v1/chat",
  body: { message: "How do I renew my licence?" },
  stream: true,
});

for await (const event of sdk.stream.parseSseStream(stream.iterate())) {
  if (event.type === "token") append(event.text);
}`,
    mockResponse: {
      streamStarted: true,
      events: [
        { type: "token", text: "To renew your " },
        { type: "token", text: "licence, visit the portal." },
        { type: "done" },
      ],
    },
    category: "network",
  },

  // ── Navigation ────────────────────────────────────
  {
    id: "navigation-navigate",
    module: "navigation",
    method: "navigate",
    signature: "sdk.navigation.navigate(target: NavigationTarget): Promise<void>",
    description:
      "Requests the host shell to navigate to a target destination or mini app.",
    paramsExample: '{ path: "/services/pay", params: { serviceId: "water_tax" } }',
    returnType: "Promise<void>",
    snippet: `await sdk.navigation.navigate({
  path: "/services/pay",
  params: { serviceId: "water_tax" }
});`,
    mockResponse: { status: "navigated", target: "/services/pay" },
    category: "core",
  },
  {
    id: "navigation-router-back",
    module: "navigation",
    method: "router.back",
    signature: "sdk.navigation.router.back(consumed: boolean): Promise<void>",
    description: "Reports back-press handling state to the host shell.",
    paramsExample: "true // true = popped route; false = hand back to host",
    returnType: "Promise<void>",
    snippet: `sdk.on("navigation.back.requested", async () => {
  const hasHistory = window.history.length > 1;
  await sdk.navigation.router.back(hasHistory);
});`,
    mockResponse: { consumed: true },
    category: "core",
  },

  // ── Appearance ────────────────────────────────────
  {
    id: "appearance-subscribe",
    module: "appearance",
    method: "subscribe",
    signature:
      "sdk.appearance.subscribe(listener: (state) => void): () => void",
    description:
      "Subscribes to host theme and locale changes. Returns an unsubscribe function.",
    paramsExample: "(state) => console.log(state.theme.mode)",
    returnType: "() => void (unsubscribe)",
    snippet: `useEffect(() => {
  const unsub = sdk.appearance.subscribe(state => {
    setTheme(state.theme.mode);
    setLocale(state.locale.language);
  });
  return () => unsub();
}, []);`,
    mockResponse: {
      locale: { locale: "ne-NP", language: "ne", direction: "ltr" },
      theme: { preference: "system", mode: "dark" },
    },
    category: "core",
  },
];

const CATEGORY_LABELS: Record<MethodSpec["category"], string> = {
  core: "Core",
  data: "Data & Storage",
  device: "Device",
  network: "Network & HTTP",
};

const CATEGORY_COLORS: Record<MethodSpec["category"], string> = {
  core: "var(--gold-500)",
  data: "var(--teal-500)",
  device: "var(--purple-500)",
  network: "var(--blue-500)",
};

const darkTheme: PrismTheme = {
  plain: {
    color: "#e2e8f0",
    backgroundColor: "#0f172a",
  },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#64748b" } },
    { types: ["punctuation"], style: { color: "#94a3b8" } },
    { types: ["property", "tag", "boolean", "number", "constant", "symbol"], style: { color: "#f59e0b" } },
    { types: ["selector", "attr-name", "string", "char", "builtin"], style: { color: "#34d399" } },
    { types: ["operator", "entity", "url"], style: { color: "#38bdf8" } },
    { types: ["atrule", "attr-value", "keyword"], style: { color: "#818cf8" } },
    { types: ["function", "class-name"], style: { color: "#38bdf8" } },
    { types: ["regex", "important", "variable"], style: { color: "#fbbf24" } },
  ],
};

function CodeBlock({ code, language = "typescript" }: { code: string; language?: string }) {
  return (
    <Highlight theme={darkTheme} code={code.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            ...style,
            margin: 0,
            padding: "16px",
            borderRadius: "var(--radius-lg)",
            fontSize: "0.82rem",
            lineHeight: 1.6,
            overflowX: "auto",
            border: "1px solid var(--color-border-decorative)",
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span
                style={{
                  display: "inline-block",
                  width: "2.5em",
                  color: "var(--neutral-600)",
                  userSelect: "none",
                  textAlign: "right",
                  marginRight: "1em",
                }}
              >
                {i + 1}
              </span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

function ResponseBlock({ data }: { data: unknown }) {
  return (
    <div
      style={{
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--green-700)",
      }}
    >
      <div
        style={{
          background: "var(--green-800)",
          color: "var(--green-300)",
          padding: "6px 12px",
          fontSize: "0.75rem",
          fontWeight: 700,
          fontFamily: "monospace",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--green-400)",
            display: "inline-block",
          }}
        />
        Simulated Host RPC Response
      </div>
      <pre
        style={{
          margin: 0,
          padding: "14px",
          background: "var(--neutral-950)",
          color: "var(--green-300)",
          fontSize: "0.8rem",
          fontFamily: "monospace",
          lineHeight: 1.5,
          maxHeight: "220px",
          overflowY: "auto",
        }}
      >
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
}

export function SDKExplorer() {
  const [selectedId, setSelectedId] = useState("auth-getUser");
  const [search, setSearch] = useState("");
  const [executing, setExecuting] = useState(false);
  const [output, setOutput] = useState<unknown | null>(null);

  const selected = useMemo(
    () => METHODS.find((m) => m.id === selectedId) ?? METHODS[0],
    [selectedId],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return METHODS;
    const q = search.toLowerCase();
    return METHODS.filter(
      (m) =>
        m.method.toLowerCase().includes(q) ||
        m.module.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q),
    );
  }, [search]);

  const grouped = useMemo(() => {
    const map = new Map<MethodSpec["category"], MethodSpec[]>();
    for (const m of filtered) {
      const arr = map.get(m.category) ?? [];
      arr.push(m);
      map.set(m.category, arr);
    }
    return map;
  }, [filtered]);

  const handleRun = () => {
    setExecuting(true);
    setOutput(null);
    setTimeout(() => {
      setOutput(selected.mockResponse);
      setExecuting(false);
    }, 400);
  };

  return (
    <div
      style={{
        border: "1px solid var(--color-border-decorative)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        margin: "24px 0",
        background: "var(--color-surface-card)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--neutral-900) 0%, var(--neutral-800) 100%)",
          color: "var(--neutral-0)",
          padding: "20px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>
              SDK Method Explorer
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--neutral-400)" }}>
              Inspect parameters, view code snippets, and test mock execution.
            </p>
          </div>
          <span
            style={{
              fontSize: "0.75rem",
              padding: "4px 10px",
              borderRadius: "var(--radius-full)",
              background: "var(--gold-500)",
              color: "var(--neutral-900)",
              fontWeight: 700,
            }}
          >
            {METHODS.length} methods
          </span>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          minHeight: "480px",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            borderRight: "1px solid var(--color-border-decorative)",
            background: "var(--color-surface-sunken)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Search */}
          <div style={{ padding: "12px 12px 8px" }}>
            <input
              type="text"
              placeholder="Search methods..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-default)",
                background: "var(--color-surface-card)",
                color: "var(--color-text-primary)",
                fontSize: "0.82rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Method list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 0 12px" }}>
            {Array.from(grouped.entries()).map(([cat, methods]) => (
              <div key={cat}>
                <div
                  style={{
                    padding: "8px 16px 4px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: CATEGORY_COLORS[cat],
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: CATEGORY_COLORS[cat],
                    }}
                  />
                  {CATEGORY_LABELS[cat]}
                </div>
                {methods.map((m) => {
                  const active = m.id === selectedId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedId(m.id);
                        setOutput(null);
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 16px",
                        fontSize: "0.82rem",
                        border: "none",
                        borderLeft: active
                          ? `3px solid ${CATEGORY_COLORS[cat]}`
                          : "3px solid transparent",
                        background: active ? "var(--color-surface-hover)" : "transparent",
                        color: active ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                        fontWeight: active ? 700 : 500,
                        cursor: "pointer",
                        transition: "background-color 0.1s",
                      }}
                    >
                      <span style={{ opacity: 0.5, fontSize: "0.75rem" }}>sdk.{m.module}.</span>
                      {m.method}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Signature */}
          <div>
            <code
              style={{
                display: "block",
                fontSize: "0.95rem",
                fontWeight: 700,
                fontFamily: "monospace",
                color: "var(--color-text-primary)",
                marginBottom: "8px",
              }}
            >
              {selected.signature}
            </code>
            <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              {selected.description}
            </p>
          </div>

          {/* Return type */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                background: "var(--gold-100)",
                color: "var(--gold-800)",
                border: "1px solid var(--gold-300)",
              }}
            >
              Returns: {selected.returnType}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                background: "var(--blue-100)",
                color: "var(--blue-500)",
                border: "1px solid var(--blue-300)",
              }}
            >
              sdk.{selected.module}
            </span>
          </div>

          {/* Arguments */}
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              background: "var(--color-surface-sunken)",
              fontSize: "0.85rem",
            }}
          >
            <strong style={{ color: "var(--color-text-secondary)" }}>Arguments:</strong>{" "}
            <code style={{ fontSize: "0.85rem" }}>{selected.paramsExample}</code>
          </div>

          {/* Code */}
          <div>
            <div
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                marginBottom: "8px",
                color: "var(--color-text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Usage
            </div>
            <CodeBlock code={selected.snippet} />
          </div>

          {/* Run button + output */}
          <div>
            <button
              onClick={handleRun}
              disabled={executing}
              style={{
                padding: "10px 20px",
                borderRadius: "var(--radius-md)",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: executing ? "wait" : "pointer",
                border: "none",
                background: executing
                  ? "var(--color-action-disabled-bg)"
                  : "linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%)",
                color: executing ? "var(--color-action-disabled-fg)" : "var(--neutral-900)",
                boxShadow: executing ? "none" : "0 2px 8px rgba(255, 199, 0, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s",
              }}
            >
              {executing ? (
                <>
                  <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>
                    ⟳
                  </span>
                  Executing...
                </>
              ) : (
                <>▶ Test Method</>
              )}
            </button>
          </div>

          {output !== null && <ResponseBlock data={output} />}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
