# Host + Mini App in the Same Window (No SDK) - Communication Flow

A blueprint for wiring a **host app** and a **mini app** in the **same browser
window** where the mini app is mounted in a **Shadow DOM** and there is **no
vendor SDK** between them. Defines exactly how the two sides are loaded, how they
discover each other, and how every message (request, response, event) is formatted
and delivered.

Target reader: a developer porting the pattern into a **different project** while
skipping the SDK layer.

---

## 0. Core idea in one line

Same window, same origin, no SDK ⇒ the two sides communicate through plain
`window.postMessage` (or direct function calls when bundled together). The host owns
a **message router** that dispatches typed messages (request → response, event →
broadcast) between itself and every mounted mini app.

---

## 1. What "no SDK" actually means

In the referenced playground, the mini app calls an SDK, and the SDK does the
postMessage plumbing. When there is **no SDK**, **each mini app must do the
plumbing itself**. In practice you will replace the SDK with a small **client
module** bundled with the mini app:

| With SDK | Without SDK |
|---|---|
| SDK owns the `window.addEventListener('message')` loop | The mini app side packs a tiny `host-client` module (a few KB) that posts/receives messages on the host channel |
| SDK reads `window.__GSA_SDK__` seeded by the host | The mini app reads **config values** passed at invocation time (global, closure param, or a host-published global) |
| SDK exposes `query({namespace, action, payload})` | The client exposes the same shape but without handshake/capability acknowledgement |

So "no SDK" ≠ "no client at all". You still need **some transport code** - it is just
small, written once per project, and compiled into every mini app.

---

## 2. End-to-end flow (same window + Shadow DOM)

```
 ┌─────────────────────────────────────────────────────────────────────────────────┐
 │ Host application (same window)                                                      │
 │                                                                                   │
 │  1. Registers `window.addEventListener("message", hostRouter.onMessage)`        │
 │  2. Loads mini-app bundles from URLs (manifest.json → files → IndexedDB cache)  │
 │  3. Evaluates the entry as a blob URL (`import(blobUrl)`)                       │
 │  4. Mounts the mini app inside a Shadow DOM root (isolated from host styles)   │
 │  5. Has `window.__MYAPP_CONFIG__` global pre-set for the mini app to read      │
 │  6. Dispatches `request` messages: namespace.action → response with matching    │
 │     requestId or `error` if a capability is turned off                            │
 │  7. Broadcasts `event` messages to every mini app that subscribed               │
 └─────────────────────────────────────────────────────────────────────────────────┘
                                ▲ window.postMessage (same window)
                                │
 ┌─────────────────────────────────────────────────────────────────────────────────┐
 │ Mini app (independent project)                                                     │
 │                                                                                   │
 │  - Bundled `host-client` module does the postMessage loop explicitly            │
 │  - Reads config from `window.__MYAPP_CONFIG__` (or from `moduleExports.mount`)  │
 │  - On boot, calls client.request("handshake", "connect") to self-identify       │
 │  - Subscribes to host events via client.eventBusSubscribe(type)                 │
 └─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Message protocol (wire format)

Every message that traverses the channel looks like this (same shape as the
referenced `gov-platform-sdk` wire):

```ts
interface RpcMessage {
  channel: string                 // e.g. "myapp-platform"
  requestId?: string             // present on requests and responses
  type: "request" | "response" | "event"
  namespace: string              // "auth" | "platform" | "appearance" | "device" | "http" | "event" | ...
  action: string                // "getUser" | "getTheme" | "location" | "get" | ...
  source: string                // "miniapp-<moduleId>" (who sends)
  target: string                // "shell" (the host) for requests; moduleId for events
  payload?: unknown
  error?: { code: string; message: string; retryable: boolean }   // on responses
  protocolVersion: string       // "1.0.0"
  traceId: string              // for distributed logs
  timestamp: number            // ms epoch
}
```

Rules:

- **Request**: sent by the mini app, `target="shell"` (the host).
- **Response**: sent by the host, `target=<sender-moduleId>` (back to the mini app
  that made the request). MUST echo the same `requestId` or the mini app's pending
  hashmap never resolves and the call times out.
- **Event**: host-originated, `target=<moduleId>` for **subscribed** mini apps only
  (per-module route-filtered). `requestId` is fresh, `type: "event"`.

---

## 4. Step-by-step implementation (new project)

### Step 1 - Stand up the two projects

```
myproject/
├── host/                # the host app (React / Vite / Next all fine)
│   ├── src/
│   │   ├── platform/
│   │   │   ├── message-router.ts     // the host-side message handler
│   │   │   ├── capabilities.ts       // capability toggles + gating
│   │   │   └── appearance.ts         // theme / locale controller
│   │   ├── lib/
│   │   │   ├── loader.ts             // manifest.json + IndexedDB + blob-mount
│   │   │   └── host-client.ts        // host-side of the client (logins etc.)
│   │   └── App.tsx
│   └── vite.config.ts
│
└── miniapp/             # the mini app (as an independent project)
    ├── src/
    │   ├── platform/
    │   │   ├── host-client.ts        // THE ONLY extra code the mini app carries
    │   │   │                        // (postMessage loop, request, eventBus)
    │   │   └── config.ts             // reads window.__MYAPP_CONFIG__
    │   └── main.tsx
    └── vite.config.ts
```

### Step 2 - Mini app: the host-client module (no-SDK core)

This is the ~100-line module that replaces the entire SDK in the mini app. The
mini app's `main.tsx` uses it for RPC calls and event subscriptions:

```ts
// miniapp/src/platform/host-client.ts

const CHANNEL = "myapp-platform";
const PROTOCOL_VERSION = "1.0.0";

type RpcMessage = ReturnType<typeof messageShape> // see §3

class HostClient {
  private pending = new Map<string, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
  private eventSubs = new Map<string, (p: unknown) => void>();
  private listening = false;

  constructor(private selfId: string) {
    this.listen();
  }

  /** Mini app → host. */
  async request(namespace: string, action: string, payload?: unknown, timeoutMs = 10_000): Promise<unknown> {
    const requestId = crypto.randomUUID();
    return new Promise((resolve, reject) => {
      this.pending.set(requestId, { resolve, reject });
      const timeout = setTimeout(() => {
        this.pending.delete(requestId);
        reject(new Error(`rpc ${namespace}.${action} timed out`));
      }, timeoutMs);
      window.postMessage(
        {
          channel: CHANNEL,
          requestId,
          type: "request",
          namespace,
          action,
          source: this.selfId,       // "miniapp-<id>"
          target: "shell",
          payload,
          protocolVersion: PROTOCOL_VERSION,
          traceId: crypto.randomUUID(),
          timestamp: Date.now(),
        },
        "*",
      );
    });
  }

  /** Host → mini app. */
  eventBusSubscribe(type: string, cb: (payload: unknown) => void) {
    this.eventSubs.set(type, cb);

    // Also ask host to remember that this module is subscribed.
    this.request("event", "subscribe", { eventType: type });
  }

  eventBusUnsubscribe(type: string) {
    this.eventSubs.delete(type);
    void this.request("event", "unsubscribe", { eventType: type });
  }

  private listen() {
    if (this.listening) return;
    this.listening = true;
    window.addEventListener("message", (e: MessageEvent) => {
      const m = e.data as RpcMessage;
      // Filter to myapp messages only
      if (!m || m.channel !== CHANNEL) return;

      // 1) Host responds to one of my requests
      if (m.type === "response" && m.requestId && this.pending.has(m.requestId)) {
        const p = this.pending.get(m.requestId)!;
        this.pending.delete(m.requestId);
        if (m.error) p.reject(new Error(m.error.message));
        else p.resolve(m.payload);
        return;
      }

      // 2) Host-broadcast events
      if (m.type === "event" && m.target === this.selfId) {
        const fullName = `${m.namespace}.${m.action}`; // "appearance.theme.changed"
        const cb = this.eventSubs.get(fullName) ?? this.eventSubs.get(m.namespace + ".*");
        cb?.(m.payload);
      }
    });
  }
}

export function createHostClient(miniAppId: string): HostClient {
  return new HostClient(`miniapp-${miniAppId}`);
}
```

The mini app's `main.tsx` then:

```ts
import { createHostClient } from "./platform/host-client";
import { readConfig } from "./platform/config";

const cfg = readConfig();            // window.__MYAPP_CONFIG__
const client = createHostClient(cfg.miniAppId);

// First call: handshake (optional but recommended)
void (async () => {
  const res = await client.request("handshake", "connect", { miniAppId: cfg.miniAppId });
  console.info("[miniapp] handshake done:", res);

  // Real calls the app needs
  const theme = await client.request("appearance", "getTheme");
  console.info("[miniapp] theme:", theme);

  client.eventBusSubscribe("appearance.theme.changed", (p) => {
    console.info("[miniapp] theme changed", p);
  });
})();
```

### Step 3 - Host: the message router (no-SDK core)

```ts
// host/src/platform/message-router.ts

import { CHANNEL, PROTOCOL_VERSION } from "./constants";
import { isActionAllowed } from "./capabilities";
import { handleHostRequest } from "./mock-handlers";   // real services in prod

let installed = false;

export function installHostRouter(): void {
  if (installed) return;
  installed = true;
  window.addEventListener("message", async (e: MessageEvent) => {
    const m = e.data as RpcMessage;
    if (!m || m.channel !== CHANNEL) return;

    // 1) Mini app request → dispatch to host service → reply
    if (m.type === "request" && m.target === "shell") {
      const senderId = m.source;
      // Gate by capability
      const ns = m.namespace, action = m.action;
      const gsa = {
        channel: CHANNEL,
        requestId: m.requestId,
        type: "response",
        namespace: ns,
        action,
        source: "shell",
        target: senderId,
        protocolVersion: PROTOCOL_VERSION,
        traceId: m.traceId,
        timestamp: Date.now(),
      };
      if (ns !== "handshake" && !isActionAllowed(ns, action)) {
        gsa.error = { code: "PERMISSION_DENIED", message: `${ns}.${action} not enabled`, retryable: false };
        window.postMessage(gsa, "*");
        return;
      }
      try {
        const payload = await handleHostRequest(ns!, action!, m.payload, senderId);
        gsa.payload = payload;
        window.postMessage(gsa, "*");
      } catch (err) {
        const ce = err as Error & { code?: string };
        gsa.error = { code: ce.code ?? "INTERNAL", message: ce.message ?? String(err), retryable: false };
        window.postMessage(gsa, "*");
      }
      return;
    }

    // 2) Mini app event subscription / unsubscription
    if (m.type === "event" && m.namespace === "event") {
      if (m.action === "subscribe") {
        const t = (m.payload as { eventType?: string })?.eventType;
        if (t && m.source) subscribeEvent(m.source, t);
      }
      if (m.action === "unsubscribe") {
        const t = (m.payload as { eventType?: string })?.eventType ?? "";
        if (t && m.source) unsubscribeEvent(m.source, t as string);
      }
      return;
    }
  });
}

export interface SubKey { id: string }
const subs = new Map<string, Set<string>>();
export function subscribeEvent(moduleId: string, eventType: string) {
  if (!subs.has(moduleId)) subs.set(moduleId, new Set());
  subs.get(moduleId)!.add(eventType);
}
export function unsubscribeEvent(moduleId: string, eventType: string) {
  subs.get(moduleId)?.delete(eventType);
}
function isSubscribed(moduleId: string, type: string): boolean {
  const s = subs.get(moduleId);
  if (!s) return false;
  if (s.has(type) || s.has("*")) return true;
  for (const pat of s) if (pat.endsWith("*") && type.startsWith(pat.slice(0, -1))) return true;
  return false;
}

export function broadcast(type: string, payload: unknown): void {
  const [namespace, ...rest] = type.split(".");
  const action = rest.join(".");
  for (const moduleId of subs.keys()) {
    if (!isSubscribed(moduleId, type)) continue;
    window.postMessage(
      {
        channel: CHANNEL,
        requestId: crypto.randomUUID(),
        type: "event",
        namespace,
        action,
        source: "shell",
        target: moduleId,
        protocolVersion: PROTOCOL_VERSION,
        traceId: crypto.randomUUID(),
        timestamp: Date.now(),
        payload,
      },
      "*",
    );
  }
}
```

### Step 4 - Host: bootstrap the mini app (loader + Shadow DOM)

Mirror the loader flow, but with no SDK script injection:

```ts
// host/src/lib/loader.ts
export interface PlaygroundConfig {
  name: string
  manifestUrl: string         // base URL of the built mini app
  iconUrl?: string
  sdkVersion: string          // unused when no SDK - drop the field
}

export async function loadAndMountMiniApp(
  container: HTMLElement,
  cfg: { name: string; manifestUrl: string },
): Promise<void> {
  const base = normalizeBaseUrl(cfg.manifestUrl);

  // 1. Fetch manifest.json
  const mres = await fetch(`${base}/manifest.json`, { cache: "no-store" });
  if (!mres.ok) throw new Error(`manifest ${mres.status}`);
  const manifest = await mres.json();
  const moduleId = slugify(cfg.name);
  const entry = manifest.bundle.entry;
  const styles = manifest.bundle.styles ?? [];
  const files = manifest.bundle.files ?? [];

  // 2. Download each listed file via fetch (.js, .css, assets) - no zip, no hash
  const frecords = await Promise.all(
    files.map(async (file: string) => {
      const fr = await fetch(`${base}/${file}`);
      if (!fr.ok) throw new Error(`Failed to fetch ${file} (${fr.status})`);
      return { ref: file, bytes: await fr.arrayBuffer() };
    }),
  );

  // 3. Cache to IndexedDB (per moduleId)
  // ... same as host-playground's idbSet

  // 4. Seed a host config global BEFORE the mini app is evaluated
  (window as any).__MYAPP_CONFIG__ = {
    miniAppId: moduleId,
    hostOrigin: window.location.origin,
    protocolVersion: "1.0.0",
  };

  // 5. Evaluate the entry as a blob URL and mount in a Shadow DOM
  const code = new TextDecoder().decode(
    frecords.find((f) => f.ref === entry) !.bytes,
  );
  const blobUrl = URL.createObjectURL(new Blob([code], { type: "application/javascript" }));
  const mod = (await import(/* @vite-ignore */ blobUrl)) as {
    mount: (container: HTMLElement) => void;
    unmount: (container: HTMLElement) => void;
  };

  // 6. Shadow DOM mount (style isolation)
  const shadow = container.attachShadow({ mode: "open" });
  for (const style of styles) {
    const styleEl = document.createElement("style");
    styleEl.textContent = new TextDecoder().decode(
      frecords.find((f) => styles.includes(f.ref))!.bytes,
    );
    shadow.appendChild(styleEl);
  }
  const inner = document.createElement("div");
  mod.mount(inner);
  shadow.appendChild(inner);
}
```

`slugify` and `normalizeBaseUrl` are the same helpers as in the original.

---

## 5. Capability gating without an SDK

In the referenced project, the SDK was responsible for checking capabilities before
an action. Without an SDK, the **host** does the gating (as `isActionAllowed` in the
router above). The mini app itself can also check before making a call, but the
authoritative check lives on the host.

Add a tiny UI in the host for vendors:

```
+----------------------------------------------------------------+
|  Capabilities                                                  |
|   Auth     [x]  Platform  [x]  Events  [x]  Appearance [x]   |
|   Location [ ]  Camera   [ ]  Gallery [ ]  Files    [ ]      |
|   HTTP     [x]  Storage [x]  API     [x]  Config  [x]        |
+----------------------------------------------------------------+
```

Toggling Location off ⇒ `isActionAllowed("device","location")` returns `false` ⇒
host replies `PERMISSION_DENIED` and the `handshake` response omits the capability.
No SDK code changes required - the host's capability store (capabilities.ts) is the
single source of truth.

---

## 6. How does the mini app talk to the host (without an SDK)?

Three transport patterns, pick one:

1. **`window.postMessage`** (default, and what the referenced playground uses).
   Both host and mini app communicate over the same window object with `target`
   filtering. Works in Shadow DOM because the shadow root is in the same DOM tree.

2. **Global function calls** - viable only if host and mini app ship in the
   same origin (which they do here). The host can publish `window.__HOST_RPC__`
   directly:
   ```ts
   (window as any).__HOST_RPC__ = {
     call: (ns, action, payload) => handleHostRequest(ns, action, payload)
   }
   ```
   The mini app then does `window.__HOST_RPC__.call("auth","getUser")`.
   Cheaper and simpler but lacks the origin/log/trace the message router gives you.

3. **Custom Event / BroadcastChannel** - if the mini app and host are in different
   browser tabs or windows, replace `window.postMessage` with
   `new BroadcastChannel("myapp-platform")`. Same wire format, different transport.

For a single window (the stated use case): use **option 1** (and optionally
option 2 for the hot path).

---

## 7. Configuration path (no SDK)

Since there is no SDK to read seeded globals, the mini app reads from a host-published
global `__MYAPP_CONFIG__`:

```ts
// miniapp/src/platform/config.ts
export interface MyAppConfig {
  miniAppId: string;
  hostOrigin: string;
  protocolVersion: string;
  sdkVersion?: string;   // deprecated without SDK - keep for backward compat
}

export function readConfig(): MyAppConfig {
  const w = window as unknown as Record<string, unknown>;
  const cfg = w["__MYAPP_CONFIG__"] as Partial<MyAppConfig> | undefined;
  if (!cfg?.miniAppId || !cfg?.hostOrigin) {
    throw new Error("mini app loaded outside a host with __MYAPP_CONFIG__");
  }
  return cfg as MyAppConfig;
}
```

If the mini app is evaluated in an isolated context (e.g., inside a worker or iframe
in another project), you can instead pass config **by invocation**:
`moduleExports.mount(container, configParam)` - the host supplies `config` (same shape
as `RemoteLoadResult.config` from host-platform's `loader.ts`).

---

## 8. Full call sequence

```
t=0 ms   host boots, calls installHostRouter()  → window message listener installed
t=1 ms   host fetches <base>/manifest.json       → { application, bundle:{entry, styles, files} }
t=2 ms   host downloads each file into memory     → caches to IndexedDB under <moduleId>@1
t=3 ms   host sets window.__MYAPP_CONFIG__        → { miniAppId, hostOrigin }
t=4 ms   host evaluates entry as blob URL         → module exports { mount, unmount }
t=5 ms   host calls mount(container, config)      → mini app renders inside Shadow DOM
t=6 ms   mini app boot: reads __MYAPP_CONFIG__    → miniAppId
t=7 ms   mini app: client.request(handshake,connect) → host router replies with status+capabilities
t=8 ms   mini app: client.request(appearance,getTheme) → host returns {preference, mode}
t=9 ms   mini app subscribes to "appearance.theme.changed"  → host remembers (event.subscribe)
t=10 ms  host changes theme                          → broadcasts event → mini app receives, re-renders
```

---

## 9. Pitfalls to watch in the new project

1. **Shadow DOM + Same-window `postMessage`:** `e.source` for same-window
   `window.postMessage` is the **same `Window` object** or `null`. Always resolve to
   `window` when `e.source` is falsy - do not assume `e.source` is the mini app's
   shadow window (there isn't one).

2. **Asset rewrites**: the mini app's CSS/JS may reference `./logo.svg` or `/assets/...`
   which break inside a blob-evaluated context. The host must publish blob URLs for
   each asset and **rewrite the references** in the entry code and CSS (the same
   `rewriteAssetReferences` helper from the referenced playground).

3. **Handshake must always be enabled** - it is the only way the mini app proves it
   can reach the host. If the router rejects it, every subsequent RPC will silently
   time out.

4. **Capability toggles**: keep them in the host, never in the mini app. This keeps
   one single source of truth.

5. **No `node_modules` cross-project imports**: if host and mini app are separate
   npm workspaces, **do not** import the mini app's source directly; use the
   manifest-URL + blob-evaluation flow. If you actually want same-repo co-bundling,
   you can skip the manifest and just `import` the mini app's `main.tsx` - but then
   there's no `postMessage` at all, you can just call functions directly. Use the
   manifest flow when the mini app is a **separate project** (the stated use case).

6. **IndexedDB cache invalidation**: because without an SDK there's no version
   negotiation. Pin `@1` in `cacheId` keyed by `<moduleId>@1`. If the vendor
   republishes with a new manifest, bump the key or provide a host UI "clear cache".

---

## 10. Minimal file layout (copy-paste checklist)

Things you MUST create in the new project (in both sides):

```
host/src/platform/
  ├── message-router.ts      // installHostRouter + subscribeEvent + isSubscribed + broadcast
  ├── capabilities.ts        // isActionAllowed, getHandshakeCapabilities, drawer toggles
  └── mock-handlers.ts      // handleMockRequest (hosts all services)

host/src/lib/
  └── loader.ts             // manifest.json + per-file download + IndexedDB + blob-mount

miniapp/src/platform/
  ├── host-client.ts        // HostClient.postMessage loop (the no-SDK substitute)
  └── config.ts             // readConfig() -> __MYAPP_CONFIG__

both projects:
  ├── src/main.tsx          // entry that calls installHostRouter / createHostClient
  └── vite.config.ts        // dev-server middleware (optional CORS proxy for manifest files)
```

Build + verify (any-zero-SDK smoke test):

```bash
# host
cd host && npm run dev        # host on :5173
# miniapp
cd miniapp && npm run dev     # miniapp on :5174

# Verify end-to-end:
# 1. Open the host, fill the form (name + manifest URL), click Test
# 2. DevTools → Network: manifest.json + each file appears
# 3. DevTools → Console: [host:listener] shows "handshake.connect from miniapp-<id>"
# 4. Toggle a capability off in the drawer → next request returns PERMISSION_DENIED
# 5. Toggle theme in the host → mini app's eventBus callback fires
```

---

## 11. Quick correctness checklist

- [ ] Host `window.addEventListener("message")` installed **before** the mini app is mounted
- [ ] Host publishes `__MYAPP_CONFIG__` before `mount()` is called
- [ ] Mini app's `host-client` filters by `channel === CHANNEL`
- [ ] Every host response echoes the **same** `requestId` (or the mini app's `pending`
      hashmap never resolves and RPCs time out)
- [ ] Events are broadcast only to modules that subscribed via `event.subscribe`
- [ ] Capability gating: `isActionAllowed` on the host; mini app never gates itself
- [ ] Shadow DOM + blob-URL evaluation + asset-rewriting done before `mount`
- [ ] No `import` of `@sewa/sdk` or any vendor SDK anywhere

---

## Appendix A - Differences vs. the referenced playground

| Aspect | Referenced (with SDK) | This blueprint (no SDK) |
|---|---|---|
| SDK script | `injectScript(sdk.url)` loads `sewa-sdk.min.js` | No script; the mini app bundles `host-client.ts` instead |
| Seed globals | `__GSA_SDK__` + `__GSA_HOST_DESCRIPTOR__` | Single `__MYAPP_CONFIG__` (or `mount(container, configParam)` invocation) |
| Handshake | SDK's `handshake.connect` - SDK replies | Mini app's `host-client` does `request("handshake","connect")` |
| Capability source | SDK's named `getHandshakeCapabilities` | Host's `capabilities.ts` (drawer + `isActionAllowed`) |
| Event bus | SDK's `EventBus` | Mini app's `eventBusSubscribe` + host's `broadcast` |
| Isolation | Shadow DOM (unchanged) | Shadow DOM (unchanged) |

## Appendix B - "But the SDK already calls host"...

The referenced SDK, when it boots, *initiates* the `handshake.connect` call. Without
an SDK, that responsibility moves to the mini app's own `host-client` module. From the
host's perspective, **nothing changes**: the host still listens for `type:"request",
namespace:"handshake", action:"connect"`, replies with `status:"ok"` plus a
capabilities array, and dispatches all other `request` messages to the corresponding
service. The only difference is **who sends**.

---