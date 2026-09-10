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
  category: "core" | "data" | "device" | "network" | "ai";
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
    signature: 'sdk.permissions.has(permission: string): Promise<boolean> [Deprecated]',
    description: "[Deprecated] sdk.permissions is deprecated and will be removed in a future major version. Checks if the mini app has been granted a specific permission.",
    paramsExample: '"camera"',
    returnType: "Promise<boolean>",
    snippet: `// @deprecated sdk.permissions.has is deprecated - will be removed in future major
const canUseCamera = await sdk.permissions.has("camera");
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
    signature: "sdk.permissions.list(): Promise<string[]> [Deprecated]",
    description: "[Deprecated] sdk.permissions is deprecated and will be removed in a future major version. Returns all permissions granted to this mini app.",
    paramsExample: "None",
    returnType: "Promise<string[]>",
    snippet: `// @deprecated sdk.permissions.list is deprecated - will be removed in future major
const permissions = await sdk.permissions.list();
// ["camera", "location", "storage", "biometric"]`,
    mockResponse: ["camera", "location", "storage", "biometric"],
    category: "core",
  },
  {
    id: "flags-isEnabled",
    module: "flags",
    method: "isEnabled",
    signature: 'sdk.flags.isEnabled(flagKey: string): Promise<boolean>',
    description: "Checks whether a feature flag is enabled for this mini app.",
    paramsExample: '"new_checkout_flow"',
    returnType: "Promise<boolean>",
    snippet: `const isNewFlow = await sdk.flags.isEnabled("new_checkout_flow");
if (isNewFlow) {
  renderNewCheckout();
}`,
    mockResponse: true,
    category: "core",
  },
  {
    id: "flags-getAll",
    module: "flags",
    method: "getAll",
    signature: "sdk.flags.getAll(): Promise<Record<string, boolean>>",
    description: "Returns a dictionary of all active feature flags.",
    paramsExample: "None",
    returnType: "Promise<Record<string, boolean>>",
    snippet: `const flags = await sdk.flags.getAll();
// { new_ui: true, beta_biometric: true, fast_payment: false }`,
    mockResponse: { new_ui: true, beta_biometric: true, fast_payment: false },
    category: "core",
  },
  {
    id: "config-get",
    module: "config",
    method: "get",
    signature: "sdk.config.get<T>(key: string): Promise<T | undefined>",
    description: "Retrieves a configuration value set by the host.",
    paramsExample: '"api_gateway_url"',
    returnType: "Promise<T | undefined>",
    snippet: `const apiHost = await sdk.config.get<string>("api_gateway_url");
// "https://api.sewa.gov.np/v1"`,
    mockResponse: "https://api.sewa.gov.np/v1",
    category: "core",
  },
  {
    id: "platform-type",
    module: "platform",
    method: "type / isFlutter / isWeb",
    signature: 'sdk.platform.type: "web" | "flutter"',
    description: "Inspects the host platform container type.",
    paramsExample: "None",
    returnType: '"web" | "flutter"',
    snippet: `if (sdk.platform.isFlutter()) {
  console.log("Running inside Flutter native shell");
} else {
  console.log("Running in web WebView");
}`,
    mockResponse: { type: "web", isWeb: true, isFlutter: false },
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

  // ── Network ───────────────────────────────────────
  {
    id: "http-get",
    module: "http",
    method: "get",
    signature: "sdk.http.get<T>(params: HttpGetParams): Promise<HttpResult<T>>",
    description:
      "Performs an HTTP GET request routed safely through the host network proxy.",
    paramsExample: '{ url: "https://api.sewa.gov.np/v1/taxes" }',
    returnType: "Promise<HttpResult<T>>",
    snippet: `const res = await sdk.http.get<{ taxDue: number }>({
  url: "https://api.sewa.gov.np/v1/taxes"
});
console.log(res.data.taxDue);`,
    mockResponse: {
      status: 200,
      data: { taxDue: 1500, period: "2080/81", currency: "NPR" },
    },
    category: "network",
  },
  {
    id: "http-post",
    module: "http",
    method: "post",
    signature:
      "sdk.http.post<T, B>(params: HttpPostParams<B>): Promise<HttpResult<T>>",
    description:
      "Performs an HTTP POST request with optional upload progress tracking.",
    paramsExample:
      '{ url: "https://api.sewa.gov.np/v1/upload", body: { ... } }',
    returnType: "Promise<HttpResult<T>>",
    snippet: `const res = await sdk.http.post<{ id: string }, FormData>(
  { url: "https://api.sewa.gov.np/v1/upload", body: formData },
  { onProgress: (p) => console.log(p.percent + "%") }
);`,
    mockResponse: {
      status: 201,
      data: { id: "doc_abc123", uploaded: true },
    },
    category: "network",
  },
  {
    id: "http-chatStream",
    module: "http",
    method: "stream",
    signature:
      "sdk.http.stream(params: { messages: ChatMessage[] }): StreamBuilder",
    description:
      "Streams a generic LLM chat completion. Deprecated alias: sdk.http.getStream().",
    paramsExample:
      '[{ role: "user", content: "How do I renew my license?" }]',
    returnType: "StreamBuilder",
    snippet: `const stream = sdk.http.stream({
  messages: [{ role: "user", content: "How do I renew my license?" }]
});
for await (const chunk of stream.iterate()) {
  appendText(chunk);
}`,
    mockResponse: {
      streamStarted: true,
      chunks: ["To renew your ", "driver license, ", "visit the portal."],
    },
    category: "network",
  },

  // ── GIC Chat ──────────────────────────────────────
  {
    id: "gicChat-startSession",
    module: "gicChat",
    method: "startSession",
    signature: "sdk.gicChat.startSession(): Promise<GicChatSession>",
    description:
      "Initializes a new GIC chat session. Returns user_id and session_id for subsequent stream calls.",
    paramsExample: "None",
    returnType: "Promise<{ user_id: string; session_id: string }>",
    snippet: `const session = await sdk.gicChat.startSession();
console.log(session.user_id, session.session_id);`,
    mockResponse: {
      status: "success",
      user_id: "8a9f1653-4c7b-44f4-b6eb-9055da85ba24",
      session_id: "9d58028d-af89-4dad-bd9b-5567981942e1",
    },
    category: "ai",
  },
  {
    id: "gicChat-stream",
    module: "gicChat",
    method: "stream",
    signature:
      "sdk.gicChat.stream(request: GicChatStreamRequest, options?: GicChatStreamOptions): Promise<{ invocation_id?: string }>",
    description:
      "Streams a GIC chat response as typed SSE events (tool_call, token, meta, done, error).",
    paramsExample:
      '{ user_id: "...", session_id: "...", message: "How do I apply for a NIC?" }',
    returnType: "Promise<{ invocation_id?: string }>",
    snippet: `const session = await sdk.gicChat.startSession();
const result = await sdk.gicChat.stream(
  { user_id: session.user_id, session_id: session.session_id,
    message: "How do I apply for a NIC?" },
  { onEvent: (event) => {
    if (event.type === "token") appendText(event.text);
    if (event.type === "done") finalize();
  }}
);`,
    mockResponse: {
      invocation_id: "e-c6fee063-cf84-45e3-aa92-9fea96a50433",
      events: [
        { type: "tool_call" },
        { type: "token", text: "To apply for a NIC, " },
        { type: "token", text: "you need Form 1..." },
        { type: "done" },
      ],
    },
    category: "ai",
  },
  {
    id: "gicChat-streamText",
    module: "gicChat",
    method: "streamText",
    signature:
      "sdk.gicChat.streamText(request, options?): Promise<{ text: string; invocation_id?: string }>",
    description:
      "Convenience wrapper: collects all token events and returns the full text response.",
    paramsExample:
      '{ user_id: "...", session_id: "...", message: "What are the office hours?" }',
    returnType: "Promise<{ text: string; invocation_id?: string }>",
    snippet: `const session = await sdk.gicChat.startSession();
const { text, invocation_id } = await sdk.gicChat.streamText(
  { user_id: session.user_id, session_id: session.session_id,
    message: "What are the office hours?" }
);
console.log(text); // Full response text`,
    mockResponse: {
      text: "GIC office hours are 9 AM to 5 PM, Sunday through Thursday.",
      invocation_id: "e-3fa2b8c1-9d4e-4a1b-8c2d-1a2b3c4d5e6f",
    },
    category: "ai",
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
  ai: "AI & Chat",
};

const CATEGORY_COLORS: Record<MethodSpec["category"], string> = {
  core: "var(--gold-500)",
  data: "var(--teal-500)",
  device: "var(--purple-500)",
  network: "var(--blue-500)",
  ai: "var(--green-500)",
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
