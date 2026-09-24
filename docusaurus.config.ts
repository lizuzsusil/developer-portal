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

  stylesheets: [
    {
      href: "https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap",
      type: "text/css",
    },
  ],

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
        "@@sewa/sdk-types") as string,
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
          href: "https://github.com/<repo>/sewa-platform",
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
      style: "light",
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
              label: "React Integration",
              to: "/docs/integration/react",
            },
            {
              label: "Vue 3 Integration",
              to: "/docs/integration/vue",
            },
            {
              label: "Angular Integration",
              to: "/docs/integration/angular",
            },
            {
              label: "Svelte Integration",
              to: "/docs/integration/svelte",
            },
            {
              label: "Solid Integration",
              to: "/docs/integration/solid",
            },
          ],
        },
        {
          title: "Platform",
          items: [
            {
              label: "Sewa Platform GitHub",
              href: "https://github.com/<repo>/sewa-platform",
            },
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["typescript", "javascript", "json", "bash"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
