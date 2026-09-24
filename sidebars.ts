import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: ["what-is-a-mini-app","overview", "getting-started", "mini-app-playground"],
    },
    {
      type: "category",
      label: "Sdk Features",
      collapsed: false,
      items: [
        "sdk/auth",
        "sdk/permissions",
        // "sdk/flags",
        // "sdk/config",
        "sdk/navigation",
        "sdk/storage",
        "sdk/platform",
        "sdk/device",
        "sdk/api",
        // "sdk/ai-chat",
        "sdk/appearance",
        "sdk/notifications",
        "sdk/links",
      ],
    },
    {
      type: "category",
      label: "Backend integration",
      collapsed: false,
      items: [
       "mini-app-backend",
       "async-requests"
      ],
    },
    {
      type: "category",
      label: "Framework Guides",
      collapsed: false,
      items: [
        "integration/react",
        "integration/vue",
        "integration/angular",
        "integration/svelte",
        "integration/solid",
      ],
    },
    {
      type: "category",
      label: "Going live",
      collapsed: false,
      items: [ "going-live"
      ],
    },
    // {
    //   type: "category",
    //   label: "Playground",
    //   collapsed: false,
    //   items: [
    //       "playground",
    //       "host-playground"
    //   ],
    // },
        {
      type: "category",
      label: "Platform Internals",
      collapsed: false,
      items: [
        "sdk/core",
        "sdk/protocol",
        // "sdk/transport",
        // "sdk/rpc",
        // "sdk/events",
        "sdk/errors",
        // "sdk/stream",
        // "sdk/reliability",
        // "sdk/observability",
        // "sdk/offline",
        // "sdk/plugins",
        // "sdk/logging",
      ],
    },
  ],
};

export default sidebars;
