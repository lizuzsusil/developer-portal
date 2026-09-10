# Host Playground - Vendor-Testable Mini App Sandbox (React + Vite)

A lightweight "playground" host that lets a mini-app developer (vendor) point at
their own mini app's **manifest URL**, fill in their app's name + icon, pick the
SDK version to test against, and watch their app mount inside the host - without
touching the existing Next.js shell or its signed-registry / zip-download pipeline.

This playground uses the **directory/manifest URL flow** (the "old style" of
downloading `JS + CSS + assets`, cached in IndexedDB via `baseUrl + /manifest.json`)
which has already been in use for pre-installed mini apps, but **not** the signed
manifest + `.zip` + hash-verify + unpack approach.

The *only* new SDK interaction is the **first handshake**. No RPC method calls, no
capability grants, no event bus – just enough to confirm the handshake works.

---

## 1. What this is (and what it is not)

| | Next.js shell (today) | Host playground (this spec) |
|---|---|---|
| Framework | Next.js | React + Vite |
| Mini-app source | Signed `.zip` (with `bundleHash`) + pre-installed directory | A single **manifest base URL**: `baseUrl/manifest.json` drives the file list |
| Vendor entry point | Portal grid | One vendored form: name, manifest URL, icon (optional), SDK version → **Test** |
| Packaging | `.zip` archive that the host downloads, hashes, unpacks | **No `.zip`**. The host fetches each file the `manifest.json` lists, one by one |
| Integrity | SHA-256 of the archive | None (the manifest URL *is* the source of truth for what to download) |
| SDK scope | Full RPC + capabilities + event bus | **Only the first handshake** (SDK init + connect), then stop |
| Scope | Production government shell | Sandbox for vendors; mirrors the shell's load/mount behavior (old-style directory flow) |

---

## 2. Reusing what already exists

Everything error-prone already lives in `@sewa/runtime-loader` (the *old* `load()` path):
directory-based file download, IndexedDB caching, blob-URL evaluation, and Shadow-DOM
mount. The playground **imports it as a workspace package and calls
`loader.load(...)`** - the same call the shell's pre-installed / fallback flow makes,
which fetches `baseUrl/manifest.json` and then each listed file individually.

Reuse from `@sewa/host-platform`:

- `createHostPlatform` (+ `PostMessageTransport`) for the postMessage channel, **only**
  for the initial handshake (`handshake` message + ack). No method registration, no
  capability gating, no event bridge - the `RpcServer` is created with `allowedOrigins:
  ["*"]` and never gets any custom methods.
- `NAMESPACES.HANDSHAKE` / `PROTOCOL_VERSION` so the wire stays compatible.

Everything the shell does *above* the handshake (RPC method calls, `EventBus`,
capability resolution) is **out of scope** for the playground.

---

## 3. Vendor flow (what the vendor does)

When a vendor opens the playground, the **first screen** is a single form:

```
+----------------------------------------------------------------+
|  Sewa Host Playground                                          |
|                                                                  |
|  Mini app name*    [  __________________________  ]            |
|  Manifest URL*     [  https://…/dist/      ]  (ends at folder) |
|  Icon URL (opt.)   [  https://…/icon.svg   ]                    |
|  SDK version        [  1.0.7  ▾ ]                               |
|                                                                  |
|                            [  Test  ]                             |
+----------------------------------------------------------------+
```

The **manifest URL** is the base directory of the vendor's published mini app (the
output of their `vite build`). The host appends `manifest.json`, reads the file list,
downloads each listed file (JS entry, CSS, assets) directly, caches them in IndexedDB
under `<moduleId>`, evaluates the entry as a blob URL, and mounts it in the right pane
inside a Shadow DOM root.

After "Test", the playground switches to a two-pane view:

```
+----------------------------------------------------------------+
|  [ mini app name (from form), sdkVersion, status]              |
|                                                                  |
| +--------------------+ +-------------------------------------+ |
| |  (left) controls  | |  (right) mounted mini app            |
| |  - reload          | |  <div ref={containerRef} />          |
| |  - clear cache     | |  (Shadow DOM root, scoped styles)     |
| |  - swap SDK ver    | |                                         |
| +--------------------+ +-------------------------------------+ |
```

No in-app UI driving is needed; the vendor just confirms the app *renders* - which
means the load + mount pipeline worked.

---

## 4. Scaffolding steps (React + Vite)

Step-by-step to stand the project up:

### 4.1 Workspace layout

```
sewa-poc/
├── packages/
│   ├── host-platform/        # formatting unchanged
│   ├── runtime-loader/       # formatting unchanged
├── playground/                       # NEW
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── PlaygroundForm.tsx
│   │   │   ├── MiniAppFrame.tsx
│   │   │   └── SdkSelect.tsx
│   │   ├── lib/
│   │   │   ├── sdk-sources.ts     # SDK version → URL map
│   │   │   └── launch-mini-app.ts  # orchestrates loader.load + sdk bootstrap + mount
│   │   └── style.css
│   └── public/sdk/
│       └── sewa-sdk.min.js         # local fallback (already in shell/public/sdk)
```

Add `playground` to `workspaces` in the root `package.json`:

```json
"workspaces": ["packages/*", "shell", "playground"]
```

### 4.2 `playground/package.json` (key deps)

```json
{
  "name": "@sewa/host-playground",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "biome check ."
  },
  "dependencies": {
    "@sewa/host-platform": "workspace:*",
    "@sewa/runtime-loader": "workspace:*",
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "vite": "^7.0.4",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^6.0.3",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3"
  }
}
```

> Install with `pnpm install` at the repo root; Vite 7 + React 19 + plugin-react 4 are
> current pins.

### 4.3 `playground/vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
});
```

### 4.4 `playground/index.html` + `src/main.tsx`

Standard Vite React entry - single root `<div id="root">`, then
`createRoot(document.getElementById("root")!).render(<App />)`.

---

## 5. Component + data model

A single playground config object:

```ts
interface PlaygroundConfig {
  /** Vendor-supplied display name (shown in the header + loader screen). */
  name: string;
  /** Base directory URL of the vendor's built mini app (…/dist). */
  manifestUrl: string;
  /** Optional icon URL shown next to the name. */
  iconUrl?: string;
  /** SDK version selected from the dropdown. */
  sdkVersion: string;
}
```

`App.tsx` owns form state and the loaded-module state; `PlaygroundForm` renders the
inputs; `MiniAppFrame` renders the right pane with a live `containerRef` for the
mounted mini app; `SdkSelect` is the version `<select>` reading from
`lib/sdk-sources.ts`.

Derived values used by the loader:

```ts
const moduleId = slugify(cfg.name); // e.g. "test-mini-app"
const version = 1;                  // user does not enter a version; we pin it
const bundleUrl = normalizeBaseUrl(cfg.manifestUrl);
```

### 5.1 `lib/sdk-sources.ts`

```ts
/**
 * Available SDK bundles, keyed by version. The vendor chooses one; the host seeds
 * the global and injects that script so its first handshake can be observed.
 *
 * `local` always resolves to `/sdk/sewa-sdk.min.js` - a bundled copy in
 * `playground/public/sdk/` so the playground works offline.
 */
export interface SdkSource {
  version: string;
  url: string;
  local: boolean;
}

export const SDK_SOURCES: SdkSource[] = [
  { version: "1.0.7", url: "/sdk/sewa-sdk.min.js", local: true },
  { version: "1.0.8", url: "https://cdn.jsdelivr.net/gh/lizuzsusil/mini-app-sdk@v1.0.8/mini-app-sdk.min.js", local: false },
  // extend as new SDK versions land on the CDN
];

export function resolveSdkSource(version: string): SdkSource | undefined {
  return SDK_SOURCES.find((s) => s.version === version);
}
```

### 5.2 `lib/launch-mini-app.ts`

```ts
import { createRuntimeLoader } from "@sewa/runtime-loader";
import type { RemoteLoadResult } from "@sewa/host-platform";
import type { PlaygroundConfig } from "./types";
import { loadMiniAppSdk } from "./sdk"; // seeded global + script injection, no handshake gate

export interface LaunchResult {
  ok: boolean;
  loadTimeMs?: number;
  error?: string;
  result?: RemoteLoadResult;
}

/**
 * Loads the mini app via the *directory* pipeline (baseUrl/manifest.json + per-file
 * downloads into IndexedDB), booted under the chosen SDK, and mounts into the right
 * pane. No capability grants, no RPC methods, no event bus - just the initial
 * handshake between the vendor's SDK and the host, which is all the playground needs
 * to prove the pipeline works.
 */
export async function launchMiniApp(
  container: HTMLElement,
  cfg: PlaygroundConfig,
): Promise<LaunchResult> {
  const moduleId = slugify(cfg.name);
  const bundleUrl = normalizeBaseUrl(cfg.manifestUrl);

  // 1. Directory-based download → IndexedDB cache (the "old style")
  const loader = createRuntimeLoader({ maxModules: 2 });
  const result = await loader.load(
    moduleId,
    bundleUrl,               // baseUrl - the loader fetches baseUrl/manifest.json,
                             // then each file listed there
    1,                       // version pin
    { retryAttempts: 3 },
  );
  if (!result.success || !result.bundle) {
    return { ok: false, error: result.error ?? "Failed to load plugin bundle" };
  }

  // 2. Boot the chosen SDK against the module - handshake only
  const src = resolveSdkSource(cfg.sdkVersion);
  if (src) {
    await loadMiniAppSdk(moduleId, {
      source: src.url,
      sdkVersion: cfg.sdkVersion,
      // No capabilities or services passed - the SDK self-identifies; the host
      // only confirms the connect/handshake.
    });
  }

  // 3. Mount into the right pane (Shadow DOM isolation, scoped styles)
  result.bundle.mount(container);
  return { ok: true, loadTimeMs: result.loadTimeMs, result };
}
```

The key difference vs. the spec's previous iteration: **no `bundleHash`, no
`loadBundle`**, just `loader.load(moduleId, baseUrl, version, {retryAttempts})` -
the same call the shell's `MiniAppContainer` makes with `source="fallback"`.

---

## 6. CORS / proxy

The vendor's published base URL (e.g. `https://x.vercel.app/…`) generally sends
`Access-Control-Allow-Origin: *`, so the loader's per-file fetches succeed without a
proxy. If a vendor's host does *not* send CORS headers (e.g. an S3/R2 bucket),
the playground includes the same dev-server middleware pattern from the shell:

- `/api/bundle?url=…` streams each file through the playground's origin.
- The loader is constructed with a `fetcher` that rewrites each file URL to the
  proxy path, mirroring `shell/src/lib/modules-api.ts:134-137`.

This is the *file-level* proxy - not the `.zip` proxy the previous draft described.
It only kicks in when the vendor's origin has no CORS headers. All integrity concerns
are moot since the playground skips hash verification.

---

## 7. SDK handshake (and only the handshake)

The host boots the chosen SDK version via `loadMiniAppSdk`. The SDK **initializes**
and performs its first handshake on the `MESSAGE_CHANNEL` postMessage channel:

```
Vendor mini-app bundle
   └─ its SDK (loaded from the chosen source)
        POSTs handshake on MESSAGE_CHANNEL
   Host (playground)
        └─ listens on that channel and returns a `handshakeAck`
        (only the ack - no RPC, no event bus, no capability gating)
```

That one round-trip is the *only* SDK interaction the playground implements. The
rest of the shell's RPC/event/capability machinery is not wired up here; vendors get
to see their app render and confirm the handshake timeline in the devtools Network /
Message panel.

---

## 8. Testing checklist for the vendor

A vendor who opens the playground should be able to:

1. Fill in the **name** of their mini app (used as the module id + display name).
2. Paste the **manifest base URL** of their built app's `dist` folder.
3. *(Optional)* paste an **icon URL** to show next to the name.
4. Pick an **SDK version** from the dropdown.
5. Click **Test** - the host:
   - fetches `baseUrl/manifest.json`
   - downloads each listed file (JS entry, CSS, assets) directly
   - caches them in IndexedDB under `<moduleId>` (old-style directory cache)
   - rewrites asset references to `blob:` URLs
   - evaluates the entry via `import(blobUrl)`
   - mounts the app in the right pane (Shadow DOM)
   - boots the chosen SDK version and completes the **first handshake**
6. **Reload** / **Clear cache** (left pane) - replay the pipeline; the cache is
   per-origin + per-version, so re-opening the same app after clearing cache forces
   a fresh download.

---

## 9. Verification / acceptance

- `pnpm --filter @sewa/host-playground dev` starts Vite on `:5173`.
- `pnpm build` produces a production bundle; `vite preview` serves it so a vendor can
  exercise the two-pane layout.
- `pnpm lint` (`biome check .`) passes.
- Run the runtime-loader tests to confirm the *directory* pipeline
  (`load`, `downloadDirectory`, FIFO eviction) behaves as in the shell:
  ```bash
  cd packages/runtime-loader && npx tsx --test src/cache.fifo.test.ts
  ```

## 10. What stays untouched

- `@sewa/runtime-loader` and `@sewa/host-platform` - **no changes**.
- The Next.js shell and its signed-registry/zip pipeline - **no changes**.
- The playground only *uses* these packages and adds (optionally) a small dev-server
  file-level CORS proxy.

---

## Appendix A - What was removed vs. the previous draft

| Removed | Why |
|---|---|
| `.zip` download, hash verify, `unzip`, `loadBundle` | Spec is now *directory/manifest-URL* flow |
| `bundleHash` form field + verification | No hashing in the old style |
| Full RPC methods, capability grants, event bus | Only the **first handshake** is implemented |
| Manifest **registry** integration (`/api/manifests`) | Not needed - the vendor types the manifest URL directly |

## Appendix B - What was added / changed

| Added / changed | Why |
|---|---|
| First screen is a form: name + manifest URL + icon (optional) + SDK version | The vendor entry point is this form |
| `loader.load(moduleId, baseUrl, version, {retryAttempts})` | The "old style" directory download |
| `loadMiniAppSdk` boots the chosen SDK and does one handshake | No deeper SDK integration |
| Optional `/api/bundle` file-level proxy in `vite.config.ts` | For vendor hosts with no CORS headers |
