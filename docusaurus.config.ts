import dotenv from "dotenv";
dotenv.config();

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
  trailingSlash: false,

  organizationName: "sewa",
  projectName: "developer-portal",

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "si", "ta"],
    localeConfigs: {
      en: {
        label: "English",
        direction: "ltr",
        htmlLang: "en-GB",
        baseUrl: "/",
        url: "https://developer.sewa.gov",
      },
      si: {
        label: "සිංහල",
        direction: "ltr",
        htmlLang: "si",
        baseUrl: "/si/",
        url: "https://developer.sewa.gov",
      },
      ta: {
        label: "தமிழ்",
        direction: "ltr",
        htmlLang: "ta",
        baseUrl: "/ta/",
        url: "https://developer.sewa.gov",
      },
    },
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

  customFields: {
    // Types package name - override via env at build time
    // e.g. TYPES_PACKAGE=@sewa/mini-app-types npm run build
    // Reads from .env / .env.local etc. via dotenv
    typesPackage:
      (process.env.TYPES_PACKAGE?.trim() ||
        process.env.SEWA_TYPES_PACKAGE?.trim() ||
        process.env.MINI_APP_TYPES_PACKAGE?.trim() ||
        "@lizuz/mini-app-types") as string,
  },

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: false,
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
        {
          type: "localeDropdown",
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
              label: "Interactive SDK Playground",
              to: "/docs/playground",
            },
            {
              label: "Interactive Host Playground",
              to: "/docs/host-playground",
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
              label: "Vue.js Integration (Active)",
              to: "/docs/integration/vue",
            },
            {
              label: "Angular NG Integration (Active)",
              to: "/docs/integration/angular",
            },
            {
              label: "Svelte Integration (Active)",
              to: "/docs/integration/svelte",
            },
            {
              label: "Solid Integration (Active)",
              to: "/docs/integration/solid",
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
      copyright: `Copyright © ${new Date().getFullYear()} Sewa - Government of Sri Lanka.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["typescript", "javascript", "json", "bash"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
