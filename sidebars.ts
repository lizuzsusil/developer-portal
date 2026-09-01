import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: ["overview", "getting-started"],
    },
    {
      type: "category",
      label: "SDK Reference",
      collapsed: false,
      items: [
        "sdk/core",
        "sdk/protocol",
        "sdk/transport",
        "sdk/rpc",
        "sdk/events",
        "sdk/errors",
        "sdk/stream",
        "sdk/reliability",
        "sdk/observability",
        "sdk/offline",
        "sdk/plugins",
        "sdk/logging",
      ],
    },
    {
      type: "category",
      label: "Capability Namespaces",
      collapsed: false,
      items: [
        "sdk/auth",
        "sdk/permissions",
        "sdk/flags",
        "sdk/config",
        "sdk/navigation",
        "sdk/storage",
        "sdk/platform",
        "sdk/device",
        "sdk/api",
        "sdk/http",
        "sdk/ai-chat",
        "sdk/gic-chat",
        "sdk/appearance",
        "sdk/notifications",
        "sdk/links",
      ],
    },
    {
      type: "category",
      label: "Framework Adapters",
      collapsed: false,
      items: [
        "integration/react",
        "integration/vue",
        "integration/angular",
      ],
    },
    {
      type: "category",
      label: "Playground",
      collapsed: false,
      items: ["playground", "host-playground"],
    },
  ],
};

export default sidebars;
