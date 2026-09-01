import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Sewa Developer Portal",
  tagline: "Build mini apps for the Sewa platform",
  favicon: "img/sewa-logo.svg",

  future: {
    v4: true,
  },

  url: "https://developer.sewa.gov",
  baseUrl: "/",

  organizationName: "sewa",
  projectName: "developer-portal",

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Sewa Developer Portal",
      logo: {
        alt: "Sewa Logo",
        src: "img/sewa-logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://github.com/anomalyco/sewa-platform",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [
            {
              label: "Platform Overview",
              to: "/docs/overview",
            },
            {
              label: "Public SDK Reference",
              to: "/docs/sdk/core",
            },
            {
              label: "Interactive Playground",
              to: "/docs/playground",
            },
          ],
        },
        {
          title: "Framework Guides",
          items: [
            {
              label: "React Integration (Active)",
              to: "/docs/integration/react",
            },
            {
              label: "Vue.js Integration (Upcoming)",
              to: "/docs/integration/vue",
            },
            {
              label: "Angular NG Integration (Upcoming)",
              to: "/docs/integration/angular",
            },
          ],
        },
        {
          title: "Platform",
          items: [
            {
              label: "Sewa Platform GitHub",
              href: "https://github.com/anomalyco/sewa-platform",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Sewa - Government of Srilanka.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["typescript", "javascript", "json", "bash"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
