import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * Mini App Playground — a minimal container shell.
 *
 * It does three things, in the order a real onboarding does them:
 *
 *  1. Registers the mini app in both registries. The FRONTEND url becomes
 *     `bundleUrl` in the Manifest Registry; the BACKEND url becomes
 *     `pluginBaseUrl` in the Service Registry.
 *  2. Loads the frontend in an iframe and plays the host side of the
 *     `gov-platform-sdk` postMessage protocol (see docs/sdk/protocol).
 *  3. Bridges `sdk.api.request` onto the Citizen BFF's
 *     `POST /v1/api-orchestrate`, passing only `X-Mini-App-Id`.
 *
 * The point of step 3 is that the backend URL never reaches the browser. The
 * BFF resolves it from the Service Registry entry written in step 1. The mini
 * app cannot address its own backend even if it wanted to.
 */

// ── Protocol constants (docs/sdk/protocol) ────────────────────────────────
const CHANNEL = "gov-platform-sdk";
const PROTOCOL_VERSION = "1.0.0";
const HOST_CAPABILITIES = ["auth", "api", "navigation", "appearance"] as const;

// ── Static onboarding context ─────────────────────────────────────────────
// A real agency is created in Admin Backend and carries a real tenant id.
// The playground assumes one already exists and uses a fixed id.
const DEMO_AGENCY_ID = "demo-agency";

type Defaults = {
  miniAppId: string;
  displayName: string;
  frontendUrl: string;
  backendUrl: string;
};

/** The Sewa gateway. Infrastructure, not something a developer supplies. */
const GATEWAY_BASE_URL = "http://localhost:8010";

const DEFAULTS: Defaults = {
  miniAppId: "",
  displayName: "",
  frontendUrl: "",
  backendUrl: "",
};

/**
 * In production the platform generates the mini app id. The playground does
 * the same, so a developer never picks one and then finds it is not theirs.
 * It stays editable, because a local stack may already hold an id you want to
 * reuse.
 */
function generateMiniAppId(displayName: string): string {
  const slug = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  const suffix = Math.random().toString(36).slice(2, 7);
  return slug ? `${slug}-${suffix}` : `mini-app-${suffix}`;
}

/** Shown greyed in the inputs, so the expected shape is obvious. */
const PLACEHOLDERS: Defaults = {
  miniAppId: "my-mini-app",
  displayName: "My Mini App",
  frontendUrl: "http://localhost:5173",
  backendUrl: "https://api.my-agency.gov.lk",
};

type LogKind = "info" | "ok" | "err" | "wire";
/** Only the latest line is surfaced; developers debug in their own devtools. */
type Status = { kind: LogKind; text: string } | null;

type PlatformMessage = {
  channel: string;
  requestId: string;
  type: "request" | "response" | "event" | "handshake" | "stream";
  namespace: string;
  action: string;
  source: string;
  target: string;
  sewaProtocolVersion: string;
  traceId: string;
  timestamp: number;
  payload?: unknown;
  error?: { code: string; message: string; retryable?: boolean };
};

type RegisteredApp = {
  miniAppId: string;
  displayName?: string;
  /** Stripped by the registry's read DTO — present only on write. */
  bundleUrl?: string;
  metadata?: { playgroundFrontendUrl?: string; playgroundBackendUrl?: string };
};

/** Where a registered app's frontend URL can actually be read from. */
function frontendUrlOf(app: RegisteredApp): string | undefined {
  return app.bundleUrl ?? app.metadata?.playgroundFrontendUrl;
}

/** Routes for the four services, all behind Kong. Kept in one place. */
function routes(gateway: string) {
  const base = gateway.replace(/\/+$/, "");
  return {
    manifestRegistry: `${base}/api/manifest/registry/mini-apps`,
    serviceRegistry: `${base}/api/registry/registry/mini-apps`,
    orchestrate: `${base}/api/bff/v1/api-orchestrate`,
  };
}

async function readJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function MiniAppPlayground(): React.ReactNode {
  const [cfg, setCfg] = useState<Defaults>(DEFAULTS);
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);
  const [loadedApp, setLoadedApp] = useState<{ miniAppId: string; frontendUrl: string; nonce: number } | null>(null);
  const [existing, setExisting] = useState<RegisteredApp[] | null>(null);
  const [selected, setSelected] = useState("");

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  // Read inside the message listener, which is registered once.
  const liveRef = useRef<{ miniAppId: string; gateway: string } | null>(null);

  /**
   * Wire-level chatter stays in the console: the playground is for running an
   * app, not for reading protocol traffic. Only actionable state reaches the UI.
   */
  const addLog = useCallback((kind: LogKind, text: string, detail?: string) => {
    if (detail) console.debug(`[playground] ${text}`, detail);
    else console.debug(`[playground] ${text}`);
    if (kind === "wire") return;
    setStatus({ kind, text });
  }, []);

  const set = <K extends keyof Defaults>(key: K, value: Defaults[K]) =>
    setCfg((prev) => ({ ...prev, [key]: value }));

  // ── Host side of the protocol ───────────────────────────────────────────
  useEffect(() => {
    async function onMessage(event: MessageEvent) {
      const msg = event.data as PlatformMessage | undefined;
      if (!msg || msg.channel !== CHANNEL) return;

      const live = liveRef.current;
      const frame = iframeRef.current?.contentWindow;
      if (!live || !frame) return;

      const reply = (payload: unknown, error?: PlatformMessage["error"]) => {
        frame.postMessage(
          {
            channel: CHANNEL,
            requestId: msg.requestId,
            type: "response",
            namespace: msg.namespace,
            action: msg.action,
            source: "shell",
            target: live.miniAppId,
            sewaProtocolVersion: PROTOCOL_VERSION,
            traceId: msg.traceId,
            timestamp: Date.now(),
            payload,
            error,
          } satisfies PlatformMessage,
          "*",
        );
      };

      if (msg.type === "handshake") {
        addLog("wire", `handshake from ${msg.source}`, JSON.stringify(msg.payload, null, 2));
        reply({
          status: "ok",
          protocolVersion: PROTOCOL_VERSION,
          supportedVersions: [PROTOCOL_VERSION],
          capabilities: [...HOST_CAPABILITIES],
          // The playground is a browser shell on a desktop.
          platformType: "web",
          os: "web",
          formFactor: "desktop",
        });
        addLog("ok", "handshake acknowledged");
        return;
      }

      if (msg.type !== "request") return;

      // sdk.api.request -> Citizen BFF. The only capability that leaves the browser.
      if (msg.namespace === "api" && msg.action === "request") {
        // The SDK sends the BFF envelope as the wire `body`; the host forwards
        // it verbatim. Older bundles sent the fields flat, so accept both.
        const raw = (msg.payload ?? {}) as {
          body?: unknown;
          method?: string;
          path?: string;
        };
        const envelope = (
          raw.body && typeof raw.body === "object" && "path" in (raw.body as object)
            ? raw.body
            : raw
        ) as { method?: string; path?: string; body?: unknown };
        const method = (envelope.method ?? "POST").toUpperCase();
        const path = envelope.path ?? "/";
        const p = envelope;
        addLog("wire", `sdk.api.request ${method} ${path}`, "-> POST /v1/api-orchestrate");

        try {
          const res = await fetch(routes(live.gateway).orchestrate, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // How the BFF knows which Service Registry entry to resolve.
              // The mini app never supplies this; the shell does.
              "X-Mini-App-Id": live.miniAppId,
            },
            body: JSON.stringify({ method, path, body: p.body }),
          });
          const data = await readJson(res);
          if (!res.ok) {
            addLog("err", `BFF responded ${res.status}`, JSON.stringify(data, null, 2));
            reply(undefined, {
              code: String((data as { error?: string })?.error ?? res.status),
              message: `Citizen BFF returned ${res.status}`,
            });
            return;
          }
          addLog("ok", `BFF dispatched ${method} ${path} -> ${res.status}`, JSON.stringify(data, null, 2));
          reply({ status: res.status, data });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          addLog("err", "Call to the Citizen BFF failed", message);
          reply(undefined, { code: "DISPATCH_ERROR", message });
        }
        return;
      }

      // Everything else is stubbed. The playground exists to prove the
      // frontend/backend round trip, not to reimplement the shell.
      if (msg.namespace === "auth" && msg.action === "getUser") {
        reply({ id: "demo-citizen", name: "Demo Citizen", userType: "CITIZEN" });
        return;
      }
      if (msg.namespace === "auth" && msg.action === "isAuthenticated") {
        reply(true);
        return;
      }
      // The SDK hydrates appearance during initialize(), so answering these
      // keeps a clean startup instead of two swallowed capability errors.
      if (msg.namespace === "appearance" && msg.action === "getTheme") {
        reply({ preference: "system", mode: "light" });
        return;
      }
      if (msg.namespace === "appearance" && msg.action === "getLocale") {
        reply({ locale: "en-GB", language: "en", direction: "ltr" });
        return;
      }
      if (msg.namespace === "event" && msg.action === "emit") {
        const p = msg.payload as { event?: string } | undefined;
        addLog("wire", `mini app emitted "${p?.event ?? "?"}"`);
        reply({ ok: true });
        return;
      }
      addLog("info", `Unhandled ${msg.namespace}.${msg.action} — stubbed`);
      reply(undefined, {
        code: "CAPABILITY_NOT_SUPPORTED",
        message: `${msg.namespace}.${msg.action} is not implemented in the playground`,
      });
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [addLog]);

/**
 * A mini app must not declare its own identity, and a parent page cannot write
 * a global into a cross-origin iframe. So the host passes miniAppId in the
 * frame URL, and the mini app copies it into the SDK's pre-load config. A
 * native shell injects the same value directly instead.
 */
function frameSrc(frontendUrl: string, miniAppId: string, nonce: number): string {
  try {
    const url = new URL(frontendUrl);
    url.searchParams.set("miniAppId", miniAppId);
    // Without this the browser serves the previous build from cache, and you
    // edit your mini app but keep testing the old one.
    url.searchParams.set("_", String(nonce));
    return url.toString();
  } catch {
    const sep = frontendUrl.includes("?") ? "&" : "?";
    return `${frontendUrl}${sep}miniAppId=${encodeURIComponent(miniAppId)}&_=${nonce}`;
  }
}

  // ── Registration ────────────────────────────────────────────────────────
  const register = useCallback(async () => {
    setBusy(true);
    const r = routes(GATEWAY_BASE_URL);

    // Blank means "this is new" — mint an id the way the platform would.
    const miniAppId = cfg.miniAppId.trim() || generateMiniAppId(cfg.displayName);
    const displayName = cfg.displayName.trim() || miniAppId;
    // Trim the URLs too. A pasted leading space is invisible in the field but
    // is stored verbatim, and the registered entry then never loads.
    const frontendUrl = cfg.frontendUrl.trim();
    const backendUrl = cfg.backendUrl.trim();
    if (miniAppId !== cfg.miniAppId) {
      setCfg((prev) => ({ ...prev, miniAppId, displayName }));
      addLog("info", `Generated mini app id: ${miniAppId}`);
    }

    try {
      addLog("info", `Registering "${miniAppId}"…`);

      // 1. Manifest Registry — the FRONTEND url.
      const manifestRes = await fetch(r.manifestRegistry, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          miniAppId,
          backingAgencyId: DEMO_AGENCY_ID,
          displayName,
          description: "Registered from the developer portal playground",
          bundleUrl: frontendUrl,
          version: "1.0.0",
          sdkVersionRequired: "1.0.0",
          loadStrategy: "ON_DEMAND",
          status: "ACTIVE",
          assuranceClass: "T1",
          // The read API strips bundleUrl (see toDto in the manifest registry
          // service), and the signed registry manifest only lists apps whose
          // bundle has been ingested and hashed. Neither is available for a
          // live dev URL, so the playground keeps its own copy in metadata,
          // which the read DTO does expose.
          metadata: {
            playgroundFrontendUrl: frontendUrl,
            playgroundBackendUrl: backendUrl,
          },
        }),
      });
      const manifestBody = await readJson(manifestRes);
      if (manifestRes.ok) {
        addLog("ok", `Frontend registered: ${frontendUrl}`);
      } else if (manifestRes.status === 409) {
        addLog("info", "Frontend already registered, continuing");
      } else {
        addLog("err", `Manifest Registry returned ${manifestRes.status}`, JSON.stringify(manifestBody, null, 2));
      }

      // 2. Service Registry — the BACKEND url. SYNC so the playground gets an
      // immediate response; ASYNC would need a callback the demo has no route for.
      const serviceRes = await fetch(r.serviceRegistry, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          miniAppId,
          backingAgencyId: DEMO_AGENCY_ID,
          displayName,
          pluginBaseUrl: backendUrl,
          integrationMode: "SYNC",
          callbackTimeoutSeconds: 30,
        }),
      });
      const serviceBody = await readJson(serviceRes);
      if (serviceRes.ok) {
        addLog("ok", `Backend registered: ${backendUrl}`);
      } else if (serviceRes.status === 409) {
        addLog("info", "Backend already registered, continuing");
      } else {
        addLog("err", `Service Registry returned ${serviceRes.status}`, JSON.stringify(serviceBody, null, 2));
        setBusy(false);
        return;
      }

      liveRef.current = { miniAppId, gateway: GATEWAY_BASE_URL };
      setLoadedApp({ miniAppId, frontendUrl, nonce: Date.now() });
      addLog("info", "Loading your mini app…");
    } catch (err) {
      addLog("err", "Registration failed", err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }, [cfg, addLog]);

  // ── Load an already-registered mini app ─────────────────────────────────
  const fetchExisting = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch(routes(GATEWAY_BASE_URL).manifestRegistry);
      const body = (await readJson(res)) as { data?: RegisteredApp[] } | RegisteredApp[] | null;
      const list = Array.isArray(body) ? body : (body?.data ?? []);
      setExisting(list);
      addLog(list.length ? "ok" : "info", `${list.length} mini app(s) registered`);
      if (list.length && !selected) setSelected(list[0].miniAppId);
    } catch (err) {
      addLog("err", "Could not list registered mini apps", err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }, [GATEWAY_BASE_URL, selected, addLog]);

  const loadExisting = useCallback(() => {
    const app = existing?.find((a) => a.miniAppId === selected);
    if (!app) return;
    const frontendUrl = frontendUrlOf(app)?.trim();
    if (!frontendUrl) {
      addLog(
        "err",
        `"${app.miniAppId}" has no frontend URL the portal can read`,
        "The manifest registry strips bundleUrl from read responses, and this entry carries no " +
          "metadata.playgroundFrontendUrl either. Re-register it from this playground, or read the " +
          "signed registry manifest once its bundle has been ingested.",
      );
      return;
    }
    liveRef.current = { miniAppId: app.miniAppId, gateway: GATEWAY_BASE_URL };
    setLoadedApp({ miniAppId: app.miniAppId, frontendUrl, nonce: Date.now() });
    addLog("info", `Loading "${app.miniAppId}" from ${frontendUrl}`);
  }, [existing, selected, GATEWAY_BASE_URL, addLog]);

  const unload = () => {
    setLoadedApp(null);
    liveRef.current = null;
    addLog("info", "Unloaded");
  };

  // ── Styles, local to keep the component self-contained ──────────────────
  const card: React.CSSProperties = {
    border: "1px solid var(--ifm-color-emphasis-300, #e2e8f0)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    background: "var(--ifm-background-surface-color, #fff)",
  };
  const label: React.CSSProperties = {
    display: "block",
    fontSize: ".72rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: ".04em",
    marginBottom: 4,
    color: "var(--ifm-color-emphasis-700, #475569)",
  };
  const input: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid var(--ifm-color-emphasis-300, #cbd5e1)",
    background: "var(--ifm-background-color, #fff)",
    color: "inherit",
    font: "inherit",
    fontSize: ".85rem",
  };
  const btn = (primary = false): React.CSSProperties => ({
    font: "inherit",
    fontWeight: 600,
    fontSize: ".85rem",
    padding: "9px 16px",
    borderRadius: 8,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.6 : 1,
    border: "1px solid var(--ifm-color-emphasis-300, #cbd5e1)",
    background: primary ? "#ffc700" : "transparent",
    color: primary ? "#0f172a" : "inherit",
  });
  const kindColor: Record<LogKind, string> = {
    info: "#64748b",
    ok: "#16a34a",
    err: "#dc2626",
    wire: "#7c3aed",
  };

  return (
    <div>
      <div style={card}>
        <strong style={{ fontSize: ".95rem" }}>1. Point us at your mini app</strong>
        <p style={{ fontSize: ".82rem", color: "var(--ifm-color-emphasis-700,#475569)", margin: "4px 0 14px" }}>
          Two URLs: where your app is served from, and where its API calls should go. Both must be
          reachable from this machine.
        </p>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
          <div>
            <label style={label}>Mini app id — generated if left blank</label>
            <input style={input} placeholder={PLACEHOLDERS.miniAppId} value={cfg.miniAppId} onChange={(e) => set("miniAppId", e.target.value)} />
          </div>
          <div>
            <label style={label}>Display name</label>
            <input style={input} placeholder={PLACEHOLDERS.displayName} value={cfg.displayName} onChange={(e) => set("displayName", e.target.value)} />
          </div>
          <div>
            <label style={label}>Frontend URL</label>
            <input style={input} placeholder={PLACEHOLDERS.frontendUrl} value={cfg.frontendUrl} onChange={(e) => set("frontendUrl", e.target.value)} />
          </div>
          <div>
            <label style={label}>Backend URL</label>
            <input style={input} placeholder={PLACEHOLDERS.backendUrl} value={cfg.backendUrl} onChange={(e) => set("backendUrl", e.target.value)} />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          <button style={btn(true)} disabled={busy} onClick={register}>
            Start testing
          </button>
          <button style={btn()} disabled={busy} onClick={fetchExisting}>
            Load one I registered earlier
          </button>
          {loadedApp && (
            <button style={btn()} onClick={unload}>
              Unload
            </button>
          )}
        </div>

        {status && (
          <div
            style={{
              marginTop: 12,
              fontSize: ".82rem",
              color:
                status.kind === "err"
                  ? "#dc2626"
                  : status.kind === "ok"
                    ? "#16a34a"
                    : "var(--ifm-color-emphasis-700,#475569)",
            }}
          >
            {status.text}
          </div>
        )}

        {existing && (
          <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <select
              style={{ ...input, width: "auto", minWidth: 220 }}
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {existing.length === 0 && <option value="">none registered</option>}
              {existing.map((a) => (
                <option key={a.miniAppId} value={a.miniAppId}>
                  {a.miniAppId}
                  {a.displayName ? ` — ${a.displayName}` : ""}
                </option>
              ))}
            </select>
            <button style={btn()} disabled={busy || !selected} onClick={loadExisting}>
              Load existing
            </button>
          </div>
        )}
      </div>

      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <strong style={{ fontSize: ".95rem" }}>2. Your mini app</strong>
          {loadedApp && (
            <span style={{ fontSize: ".72rem", color: "var(--ifm-color-emphasis-700,#475569)" }}>
              {loadedApp.miniAppId} · {loadedApp.frontendUrl}
            </span>
          )}
        </div>
        {loadedApp ? (
          <iframe
            ref={iframeRef}
            title="mini app"
            src={frameSrc(loadedApp.frontendUrl, loadedApp.miniAppId, loadedApp.nonce)}
            onLoad={() => addLog("info", `frame loaded as ${loadedApp.miniAppId}`)}
            style={{
              width: "100%",
              height: 680,
              border: "1px solid var(--ifm-color-emphasis-300,#e2e8f0)",
              borderRadius: 8,
              background: "#fff",
            }}
            sandbox="allow-scripts allow-forms allow-same-origin"
          />
        ) : (
          <div
            style={{
              padding: "48px 16px",
              textAlign: "center",
              color: "var(--ifm-color-emphasis-600,#64748b)",
              fontSize: ".85rem",
              border: "1px dashed var(--ifm-color-emphasis-300,#cbd5e1)",
              borderRadius: 8,
            }}
          >
Your mini app appears here once you press Start testing.
          </div>
        )}
      </div>

    </div>
  );
}
