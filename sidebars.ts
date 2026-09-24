import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/**
 * Ordered as a mini app developer moves: understand, build, test, ship.
 *
 * Everything describing how the SDK and the container shell talk to each other
 * sits under "Platform internals", collapsed. A mini app developer never calls
 * that surface — it is here for people working on the shell or the SDK itself.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: "category",
      label: "Start here",
      collapsed: false,
      items: ["what-is-a-mini-app", "overview", "getting-started", "playground"],
    },
    {
      type: "category",
      label: "Build your mini app",
      collapsed: false,
      items: [
        "sdk/auth",
        "sdk/api",
        "sdk/storage",
        "sdk/navigation",
        "sdk/appearance",
        "sdk/device",
        "sdk/permissions",
        "sdk/notifications",
        "sdk/links",
        "sdk/platform",
        "sdk/errors",
      ],
    },
    {
      type: "category",
      label: "Backend integration",
      collapsed: true,
      items: ["mini-app-backend", "async-requests", "sdk/stream"],
    },
    {
      type: "category",
      label: "Framework guides",
      collapsed: true,
      items: ["integration/react", "integration/vue", "integration/angular"],
    },
    {
      type: "category",
      label: "Going live",
      collapsed: false,
      items: ["going-live"],
    },
    {
      type: "category",
      label: "Platform internals",
      collapsed: true,
      items: [
        "sdk/core",
        "sdk/events",
        "sdk/protocol",
        "sdk/transport",
        "sdk/rpc",
        "sdk/reliability",
        "sdk/observability",
        "sdk/offline",
        "sdk/plugins",
        "sdk/logging",
      ],
    },
  ],
};

export default sidebars;
