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
  category:
    | "auth"
    | "permissions"
    | "flags"
    | "config"
    | "navigation"
    | "storage"
    | "platform"
    | "device"
    | "api"
    | "notifications"
    | "links"
    | "appearance";
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
    category: "auth",
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
    category: "auth",
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
    category: "auth",
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
    category: "permissions",
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
    category: "permissions",
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
    category: "config",
  },
  {
    id: "config-getAll",
    module: "config",
    method: "getAll",
    signature: "sdk.config.getAll(): Promise<Record<string, unknown>>",
    description: "Returns the whole host-provided configuration map.",
    paramsExample: "None",
    returnType: "Promise<Record<string, unknown>>",
    snippet: `const cfg = await sdk.config.getAll();
console.log(cfg.api_gateway_url);`,
    mockResponse: {
      api_gateway_url: "https://api.sewa.gov.np/v1",
      default_locale: "ne-NP",
    },
    category: "config",
  },
//   {
//     id: "flags-isEnabled",
//     module: "flags",
//     method: "isEnabled",
//     signature: "sdk.flags.isEnabled(flag: string): Promise<boolean>",
//     description: "Checks a single host-provided feature flag.",
//     paramsExample: '"new_payment_flow"',
//     returnType: "Promise<boolean>",
//     snippet: `if (await sdk.flags.isEnabled("new_payment_flow")) {
//   renderNewFlow();
// }`,
//     mockResponse: true,
//     category: "flags",
//   },
//   {
//     id: "flags-getAll",
//     module: "flags",
//     method: "getAll",
//     signature: "sdk.flags.getAll(): Promise<Record<string, boolean>>",
//     description: "Returns all feature flags granted to this mini app.",
//     paramsExample: "None",
//     returnType: "Promise<Record<string, boolean>>",
//     snippet: `const flags = await sdk.flags.getAll();
// // { new_payment_flow: true, chat: false }`,
//     mockResponse: { new_payment_flow: true, chat: false },
//     category: "flags",
//   },
//   {
//     id: "platform-type",
//     module: "platform",
//     method: "type / isWeb / isFlutter / isMobile",
//     signature: 'sdk.platform.type: "web" | "flutter" (sync, no RPC)',
//     description: "Inspects the host platform container type. All checks are sync local state.",
//     paramsExample: "None",
//     returnType: '"web" | "flutter"',
//     snippet: `if (sdk.platform.isFlutter()) {
//   console.log("Running inside Flutter native shell");
// } else {
//   console.log("Running in web WebView");
// }`,
//     mockResponse: { type: "web", isWeb: true, isFlutter: false },
//     category: "platform",
//   },

  // ── Data ──────────────────────────────────────────
  {
    id: "storage-set",
    module: "storage",
    method: "set",
    signature:
      "sdk.storage.set(key: string, value: string, options?: StorageSetOptions): Promise<void>",
    description: "Stores a raw string value (supports `ttlMs`).",
    paramsExample: '"theme", "dark"',
    returnType: "Promise<void>",
    snippet: `await sdk.storage.set("theme", "dark");`,
    mockResponse: { success: true, storedKey: "theme" },
    category: "storage",
  },
  {
    id: "storage-get",
    module: "storage",
    method: "get",
    signature: "sdk.storage.get(key: string): Promise<string | null>",
    description: "Reads a raw string value from storage.",
    paramsExample: '"theme"',
    returnType: "Promise<string | null>",
    snippet: `const theme = await sdk.storage.get("theme");
if (theme) applyTheme(theme);`,
    mockResponse: "dark",
    category: "storage",
  },
  {
    id: "storage-setJson",
    module: "storage",
    method: "setJson",
    signature:
      "sdk.storage.setJson(key: string, value: unknown, options?: StorageSetOptions): Promise<void>",
    description: "JSON-encodes and stores a value in platform storage.",
    paramsExample: '"draft_form", { step: 2 }, { ttlMs: 86400000 }',
    returnType: "Promise<void>",
    snippet: `await sdk.storage.setJson("draft_form", { step: 2 }, {
  ttlMs: 86400000, // 24 hours
});`,
    mockResponse: { success: true, storedKey: "draft_form" },
    category: "storage",
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
    category: "storage",
  },
  {
    id: "storage-remove",
    module: "storage",
    method: "remove",
    signature: "sdk.storage.remove(key: string): Promise<void>",
    description: "Deletes a key from platform storage.",
    paramsExample: '"draft_form"',
    returnType: "Promise<void>",
    snippet: `await sdk.storage.remove("draft_form");`,
    mockResponse: { success: true, removedKey: "draft_form" },
    category: "storage",
  },
//   {
//     id: "storage-scoped",
//     module: "storage",
//     method: "scoped",
//     signature: "sdk.storage.scoped(prefix: string): StorageSdkModule",
//     description:
//       "Creates a sub-scoped storage module where all keys are auto-prefixed.",
//     paramsExample: '"user_settings"',
//     returnType: "StorageSdkModule",
//     snippet: `const userStore = sdk.storage.scoped("user_settings");
// await userStore.set("theme", "dark");
// const theme = await userStore.get("theme");`,
//     mockResponse: { scopedPrefix: "user_settings:", created: true },
//     category: "storage",
//   },

  // ── Device ────────────────────────────────────────
  {
    id: "device-isSupported",
    module: "device",
    method: "isSupported",
    signature: "sdk.device.isSupported(action: DeviceAction): boolean",
    description:
      "Sync capability guard - call before any device method the host may not grant.",
    paramsExample: '"location"',
    returnType: "boolean",
    snippet: `if (sdk.device.isSupported("location")) {
  const res = await sdk.device.location();
}`,
    mockResponse: true,
    category: "device",
  },
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

  {
    id: "device-gallery",
    module: "device",
    method: "gallery",
    signature:
      "sdk.device.gallery(options?: DeviceFileOptions): Promise<DevicePermissionBaseResponse<DeviceGalleryResult>>",
    description: "Lets the user pick images from the device gallery.",
    paramsExample: "{ maxCount: 3 }",
    returnType: "Promise<DevicePermissionBaseResponse<DeviceGalleryResult>>",
    snippet: `const pick = await sdk.device.gallery({ maxCount: 3 });
if (pick.granted) {
  setImages(pick.data.uris);
}`,
    mockResponse: {
      granted: true,
      data: { uris: ["file:///gallery/img1.jpg", "file:///gallery/img2.jpg"] },
    },
    category: "device",
  },
  {
    id: "device-files",
    module: "device",
    method: "files",
    signature:
      "sdk.device.files(options?: DeviceFileOptions): Promise<DevicePermissionBaseResponse<DeviceFileResult>>",
    description: "Lets the user pick files from device storage.",
    paramsExample: "{ mimeTypes: ['application/pdf'] }",
    returnType: "Promise<DevicePermissionBaseResponse<DeviceFileResult>>",
    snippet: `const pick = await sdk.device.files({ mimeTypes: ["application/pdf"] });
if (pick.granted) {
  upload(pick.data.uris[0]);
}`,
    mockResponse: {
      granted: true,
      data: { uris: ["file:///docs/form.pdf"] },
    },
    category: "device",
  },
  {
    id: "device-info",
    module: "device",
    method: "info",
    signature: "sdk.device.info(): Promise<DeviceInfoResult>",
    description:
      "Returns device platform, OS, app, screen, locale and timezone info.",
    paramsExample: "None",
    returnType: "Promise<DeviceInfoResult>",
    snippet: `const info = await sdk.device.info();
console.log(info.os, info.locale);`,
    mockResponse: {
      platform: "android",
      os: "Android 14",
      locale: "ne-NP",
      timezone: "Asia/Kathmandu",
    },
    category: "device",
  },
  {
    id: "device-network",
    module: "device",
    method: "network",
    signature: "sdk.device.network(): Promise<DeviceNetworkResult>",
    description: "Returns current connectivity state and network type.",
    paramsExample: "None",
    returnType: "Promise<DeviceNetworkResult>",
    snippet: `const net = await sdk.device.network();
if (!net.online) showOfflineBanner();`,
    mockResponse: { online: true, type: "wifi" },
    category: "device",
  },
  // ── Network (`api`: GET / POST / PUT / PATCH / DELETE + stream) ──
  {
    id: "api-request-get",
    module: "api",
    method: "request (GET)",
    signature:
      "sdk.api.request<T>(method: 'GET', params: ApiRequestParams): Promise<ApiResult<T>>",
    description:
      "Proxied GET through the host. `path` is the required BFF inner route; `query` is folded into the envelope path.",
    paramsExample: '\'GET\', { path: "/taxes/due", query: { pan: "99120" } }',
    returnType: "Promise<ApiResult<T>>",
    snippet: `const res = await sdk.api.request<{ taxDue: number }>("GET", {
  path: "/taxes/due",
  query: { pan: "99120" },
});
console.log(res.status, res.data.taxDue);`,
    mockResponse: {
      status: 200,
      data: { taxDue: 1500, period: "2080/81", currency: "NPR" },
    },
    category: "api",
  },
  {
    id: "api-request-post",
    module: "api",
    method: "request (POST)",
    signature:
      "sdk.api.request<T, B>(method?: string, params?: ApiRequestParams<B>): Promise<ApiResult<T>>",
    description:
      "Proxied POST (the default method when omitted). Carry `body`, `headers`, `query`; track uploads with `onProgress`.",
    paramsExample: '\'POST\', { path: "/taxes/due", body: { pan: "99120" } }',
    returnType: "Promise<ApiResult<T>>",
    snippet: `const res = await sdk.api.request<{ taxDue: number }>("POST", {
  path: "/taxes/due",
  body: { pan: "99120" },
});
console.log(res.data.taxDue);`,
    mockResponse: {
      status: 200,
      data: { taxDue: 1500, period: "2080/81", currency: "NPR" },
    },
    category: "api",
  },
  {
    id: "api-request-put",
    module: "api",
    method: "request (PUT)",
    signature:
      "sdk.api.request<T, B>(method: 'PUT', params: ApiRequestParams<B>): Promise<ApiResult<T>>",
    description: "Proxied PUT - full-resource replace through the host.",
    paramsExample: '\'PUT\', { path: "/profile", body: { name: "..." } }',
    returnType: "Promise<ApiResult<T>>",
    snippet: `const res = await sdk.api.request("PUT", {
  path: "/profile",
  body: { name: "Bikram Adhikari" },
});
console.log(res.status); // 200`,
    mockResponse: { status: 200, data: { updated: true } },
    category: "api",
  },
  {
    id: "api-request-patch",
    module: "api",
    method: "request (PATCH)",
    signature:
      "sdk.api.request<T, B>(method: 'PATCH', params: ApiRequestParams<B>): Promise<ApiResult<T>>",
    description: "Proxied PATCH - partial update through the host.",
    paramsExample: '\'PATCH\', { path: "/profile", body: { locale: "ne-NP" } }',
    returnType: "Promise<ApiResult<T>>",
    snippet: `const res = await sdk.api.request("PATCH", {
  path: "/profile",
  body: { locale: "ne-NP" },
});
console.log(res.status); // 200`,
    mockResponse: { status: 200, data: { updated: true } },
    category: "api",
  },
  {
    id: "api-request-delete",
    module: "api",
    method: "request (DELETE)",
    signature:
      "sdk.api.request<T>(method: 'DELETE', params: ApiRequestParams): Promise<ApiResult<T>>",
    description: "Proxied DELETE through the host.",
    paramsExample: '\'DELETE\', { path: "/drafts/99120" }',
    returnType: "Promise<ApiResult<T>>",
    snippet: `const res = await sdk.api.request("DELETE", {
  path: "/drafts/99120",
});
console.log(res.status); // 200`,
    mockResponse: { status: 200, data: { deleted: true } },
    category: "api",
  },
  {
    id: "api-request-stream",
    module: "api",
    method: "request (stream)",
    signature:
      "sdk.api.request(method: string, params: ApiRequestParams & { stream: true }): Promise<StreamBuilder>",
    description:
      "Streaming variant - returns a StreamBuilder of SSE chunks for chat/file streaming.",
    paramsExample:
      '\'POST\', { path: "/chat", body: { message: "..." }, stream: true }',
    returnType: "Promise<StreamBuilder>",
    snippet: `const stream = await sdk.api.request("POST", {
  path: "/chat",
  body: { message: "How do I renew my license?" },
  stream: true,
});
for await (const chunk of stream.iterate()) {
  appendText(chunk);
}`,
    mockResponse: {
      streamStarted: true,
      chunks: ["To renew your ", "driver license, ", "visit the portal."],
    },
    category: "api",
  },

  // ── Notifications ─────────────────────────────────
//   {
//     id: "notifications-register",
//     module: "notifications",
//     method: "register",
//     signature:
//       "sdk.notifications.register(options?: NotificationsRegisterOptions): Promise<NotificationsRegisterResult>",
//     description:
//       "Requests notification permission and returns the push token. Gate with `isSupported()` first.",
//     paramsExample: "None",
//     returnType: "Promise<NotificationsRegisterResult>",
//     snippet: `if (sdk.notifications.isSupported()) {
//   const reg = await sdk.notifications.register();
//   console.log(reg.token);
// }`,
//     mockResponse: { granted: true, token: "push_tok_abc123" },
//     category: "notifications",
//   },
//   {
//     id: "notifications-onOpen",
//     module: "notifications",
//     method: "onOpen",
//     signature:
//       "sdk.notifications.onOpen(handler: (event: NotificationOpenEvent) => void): () => void",
//     description:
//       "Subscribes to notification-tap events. Returns an unsubscribe function.",
//     paramsExample: "(event) => console.log(event.notificationId)",
//     returnType: "() => void (unsubscribe)",
//     snippet: `useEffect(() => {
//   const unsub = sdk.notifications.onOpen((event) => {
//     navigate(event deeplink);
//   });
//   return () => unsub();
// }, []);`,
//     mockResponse: { notificationId: "ntf_123", deeplink: "/services/pay" },
//     category: "notifications",
//   },

  // ── Links ─────────────────────────────────────────
  {
    id: "links-open",
    module: "links",
    method: "open",
    signature:
      "sdk.links.open(url: string, options?: LinksOpenOptions): Promise<void>",
    description: "Opens a URL, optionally in-app (`{ inApp: true }`).",
    paramsExample: '"https://sewa.gov.np/services", { inApp: true }',
    returnType: "Promise<void>",
    snippet: `await sdk.links.open("https://sewa.gov.np/services", { inApp: true });`,
    mockResponse: { status: "opened", inApp: true },
    category: "links",
  },
  {
    id: "links-onOpen",
    module: "links",
    method: "onOpen",
    signature:
      "sdk.links.onOpen(handler: (event: LinksOpenedEvent) => void): () => void",
    description:
      "Subscribes to incoming deep links. Returns an unsubscribe function.",
    paramsExample: "(event) => console.log(event.url)",
    returnType: "() => void (unsubscribe)",
    snippet: `useEffect(() => {
  const unsub = sdk.links.onOpen((event) => {
    router.push(event.url);
  });
  return () => unsub();
}, []);`,
    mockResponse: { url: "sewa://services/pay?serviceId=water_tax" },
    category: "links",
  },

  // ── Navigation ────────────────────────────────────
//   {
//     id: "navigation-navigate",
//     module: "navigation",
//     method: "navigate",
//     signature: "sdk.navigation.navigate(target: NavigationTarget): Promise<void>",
//     description:
//       "Requests the host shell to navigate to a target destination or mini app.",
//     paramsExample: '{ path: "/services/pay", params: { serviceId: "water_tax" } }',
//     returnType: "Promise<void>",
//     snippet: `await sdk.navigation.navigate({
//   path: "/services/pay",
//   params: { serviceId: "water_tax" }
// });`,
//     mockResponse: { status: "navigated", target: "/services/pay" },
//     category: "navigation",
//   },
  {
    id: "navigation-getCurrent",
    module: "navigation",
    method: "getCurrent",
    signature: "sdk.navigation.getCurrent(): Promise<NavigationState>",
    description: "Returns the current route and navigation history.",
    paramsExample: "None",
    returnType: "Promise<NavigationState>",
    snippet: `const state = await sdk.navigation.getCurrent();
console.log(state.route, state.history);`,
    mockResponse: { route: "/services/pay", history: ["/", "/services"] },
    category: "navigation",
  },
  {
    id: "navigation-router-back",
    module: "navigation",
    method: "router.back",
    signature: "sdk.navigation.router.back(consumed?: boolean): Promise<NavigationRouterResult>",
    description: "Reports back-press handling state to the host shell. Omit or pass `false` to hand the press back to the host.",
    paramsExample: "true // true = popped route; false = hand back to host",
    returnType: "Promise<NavigationRouterResult>",
    snippet: `sdk.on("navigation.back.requested", async () => {
  const hasHistory = window.history.length > 1;
  await sdk.navigation.router.back(hasHistory);
});`,
    mockResponse: { consumed: true },
    category: "navigation",
  },
  {
    id: "navigation-router-push",
    module: "navigation",
    method: "router.push",
    signature: "sdk.navigation.router.push(consumed?: boolean): Promise<NavigationRouterResult>",
    description: "Reports internal forward-push handling state to the host shell.",
    paramsExample: "true",
    returnType: "Promise<NavigationRouterResult>",
    snippet: `await sdk.navigation.router.push(true);`,
    mockResponse: { consumed: true },
    category: "navigation",
  },

  // ── Appearance ────────────────────────────────────
  {
    id: "appearance-getLocale",
    module: "appearance",
    method: "getLocale",
    signature: "sdk.appearance.getLocale(): Promise<LocaleState>",
    description: "Returns the active host locale.",
    paramsExample: "None",
    returnType: "Promise<LocaleState>",
    snippet: `const locale = await sdk.appearance.getLocale();
console.log(locale.language); // "ne"`,
    mockResponse: { locale: "ne-NP", language: "ne", direction: "ltr" },
    category: "appearance",
  },
  {
    id: "appearance-getTheme",
    module: "appearance",
    method: "getTheme",
    signature: "sdk.appearance.getTheme(): Promise<ThemeState>",
    description: "Returns the theme preference and resolved mode.",
    paramsExample: "None",
    returnType: "Promise<ThemeState>",
    snippet: `const theme = await sdk.appearance.getTheme();
console.log(theme.mode); // "dark"`,
    mockResponse: { preference: "system", mode: "dark" },
    category: "appearance",
  },
  {
    id: "appearance-state",
    module: "appearance",
    method: "state",
    signature: "sdk.appearance.state(): AppearanceState",
    description: "Sync snapshot of the current locale + theme (no RPC).",
    paramsExample: "None",
    returnType: "AppearanceState",
    snippet: `const { locale, theme } = sdk.appearance.state();`,
    mockResponse: {
      locale: { locale: "ne-NP", language: "ne", direction: "ltr" },
      theme: { preference: "system", mode: "dark" },
    },
    category: "appearance",
  },
//   {
//     id: "appearance-subscribe",
//     module: "appearance",
//     method: "subscribe",
//     signature:
//       "sdk.appearance.subscribe(listener: (state) => void): () => void",
//     description:
//       "Subscribes to host theme and locale changes. Returns an unsubscribe function.",
//     paramsExample: "(state) => console.log(state.theme.mode)",
//     returnType: "() => void (unsubscribe)",
//     snippet: `useEffect(() => {
//   const unsub = sdk.appearance.subscribe(state => {
//     setTheme(state.theme.mode);
//     setLocale(state.locale.language);
//   });
//   return () => unsub();
// }, []);`,
//     mockResponse: {
//       locale: { locale: "ne-NP", language: "ne", direction: "ltr" },
//       theme: { preference: "system", mode: "dark" },
//     },
//     category: "appearance",
//   },
];

const CATEGORY_LABELS: Record<MethodSpec["category"], string> = {
  auth: "Auth",
  permissions: "Permissions (deprecated)",
  flags: "Feature Flags",
  config: "Config",
  navigation: "Navigation",
  storage: "Storage",
  platform: "Platform",
  device: "Device",
  api: "Network (api)",
  notifications: "Notifications",
  links: "Links",
  appearance: "Appearance",
};

const CATEGORY_COLORS: Record<MethodSpec["category"], string> = {
  auth: "var(--gold-500)",
  permissions: "var(--neutral-500)",
  flags: "var(--orange-500)",
  config: "var(--teal-500)",
  navigation: "var(--blue-500)",
  storage: "var(--green-500)",
  platform: "var(--neutral-600)",
  device: "var(--purple-500)",
  api: "var(--red-500)",
  notifications: "var(--orange-600)",
  links: "var(--teal-600)",
  appearance: "var(--gold-600)",
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
