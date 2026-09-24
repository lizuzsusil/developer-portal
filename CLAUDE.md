# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

The **Sewa Developer Portal**: the public documentation site for agency developers
building mini apps on the Sewa platform. It is a Docusaurus 3.10 static site in
TypeScript, with a pnpm/npm workspace holding five internal packages.

It is documentation, not platform code. Nothing here runs in production Sewa.
No service in the sibling directories imports anything from this repository.

- Site title: Sewa Developer Portal
- Deploy URL in config: `https://developer.sewa.gov`
- Remote: `git@github.com:lizuzsusil/developer-portal.git`, branch `main`
- Node: `>=20` (the repo builds cleanly on 24)

## Package manager

Either npm or pnpm works. Both are verified to install and build all three
locales cleanly.

```bash
npm install && npm run build      # or
pnpm install && pnpm build
```

`package-lock.json` and `pnpm-lock.yaml` are both committed, and
`pnpm-workspace.yaml` exists. Whichever you use, commit the lockfile you changed.

**Background, worth knowing before you touch `package.json`.** The swizzled
locale dropdown in `src/theme/NavbarItem/LocaleDropdownNavbarItem/` imports
`mergeSearchStrings` and `useHistorySelector` from `@docusaurus/theme-common`.
That package arrives transitively through `@docusaurus/preset-classic`. npm's
flat `node_modules` hoists it, so the import resolved by luck; pnpm's strict
layout does not, and the build failed with:

```
Module not found: Can't resolve '@docusaurus/theme-common'
```

`@docusaurus/theme-common` is now declared directly in `dependencies`, pinned to
`3.10.2` to match the other Docusaurus packages. Keep that pin in step with
`@docusaurus/core` whenever Docusaurus is upgraded — a mismatch there produces
confusing type and runtime errors, because two copies of the theme internals can
end up in one build.

Do not drop this dependency on the grounds that "preset-classic already brings
it in". It does, and that is exactly the arrangement that broke.

## Commands

```bash
npm start            # dev server, hot reload, default locale only
npm run build        # production build of all three locales into build/
npm run serve        # serve the built site
npm run typecheck    # tsc, no emit — passes clean
npm run clear        # clear the Docusaurus cache when the build acts strangely
npm run write-translations   # regenerate i18n JSON after changing UI strings
```

A full build takes a couple of minutes and produces roughly 7.5 MB in `build/`,
with `build/`, `build/si/` and `build/ta/` as separate locale trees.

`npm run deploy` is the stock Docusaurus `gh-pages` target inherited from the
template. Nothing indicates it is the real deployment path. Confirm before using it.

## Layout

```
docs/                     33 .mdx files — the actual documentation
  overview.mdx            platform overview
  getting-started.mdx     first mini app
  sdk/                    27 files: SDK reference and capability namespaces
  integration/            react.mdx (active), vue.mdx, angular.mdx (both upcoming)
  playground.mdx          hosts the interactive SDK explorer
sidebars.ts               manual sidebar; every doc is listed by id
docusaurus.config.ts      site config, i18n, customFields
src/
  pages/index.tsx         landing page
  components/             TypesPackage.tsx, plus two re-export shims
  theme/NavbarItem/...    swizzled locale dropdown (see Package manager)
  css/                    custom.css, main.css
packages/                 five internal workspace packages
i18n/{en,si,ta}/          translations
static/img/               logo and images
```

### Sidebar is manual

`sidebars.ts` lists every document explicitly by `id`. Adding a file under
`docs/` does **not** put it in the navigation. Add the id to the right category
in `sidebars.ts` as well, or the page exists but nobody can reach it.

Doc frontmatter convention, used consistently:

```yaml
---
id: core
title: SDK Core & Lifecycle
sidebar_label: Core & Lifecycle
---
```

## The workspace packages are documentation props

`packages/` looks like an SDK. It is not. Every package says so in its own
header comment: *"Internal workspace package - not published to npm."*

| Package | What it really contains |
|---|---|
| `@sewa/design-tokens` | `tokens.css` — real CSS custom properties and the Tailwind theme |
| `@sewa/framework-react` | a showcase card plus `REACT_SNIPPETS` code strings |
| `@sewa/framework-vue` | same shape, `STATUS = "upcoming"` |
| `@sewa/framework-angular` | same shape, `STATUS = "upcoming"` |
| `@sewa/sdk-playground` | `SDKExplorer` and `FrameworkBadge` components |

**The Vue and Angular packages are written in React.** Both
`FrameworkShowcase.tsx` files import React and render a card describing what a
Vue or Angular adapter *would* offer. There is no Vue or Angular code anywhere
in this repository. They exist so the docs can show a consistent preview for
frameworks that are not built yet.

Do not treat these as adapters to extend, and do not import them expecting SDK
behaviour. If someone asks to "add a method to the Vue adapter", the adapter
does not exist here — clarify before writing anything.

`SDKExplorer` is likewise a presentation component. Its `MethodSpec` entries
carry hard-coded `signature`, `description` and sample responses. It calls no
real SDK, so changing it changes the documentation, not any behaviour.

### Two re-export shims

`src/components/SDKExplorer/index.tsx` and `src/components/FrameworkBadge/index.tsx`
re-export from `packages/sdk-playground/`, reaching up three directories. The
first one says so:

```ts
// Portal shim - canonical source is `packages/sdk-playground/src/SDKExplorer.tsx`
```

Edit the package, never the shim.

## The types package name is configurable

Code samples across the docs must all name the same npm package for mini app
types. That name is not hard-coded in the `.mdx` files. It is resolved once at
build time in `docusaurus.config.ts` under `customFields.typesPackage`, from the
first of `TYPES_PACKAGE`, `SEWA_TYPES_PACKAGE` or `MINI_APP_TYPES_PACKAGE`,
falling back to `@govtech/mini-app-types`.

`src/components/TypesPackage.tsx` exposes it through `useTypesPackage()` and a
set of ready-made blocks: `InstallCommandBlock`, `ImportCodeBlock`,
`PackageJsonBlock`, `UseAppearanceBlock` and others.

**When writing a code sample that names the types package, use these components.**
Do not type the package name into an `.mdx` file. Only three docs use them
today, so the pattern is easy to miss and easy to break.

The current default, `@govtech/mini-app-types`, is a personal npm scope. `.env.example`
anticipates a rename to `@sewa/mini-app-types`. Expect that to change, which is
exactly why it is a variable.

## Internationalisation

Three locales: `en` (default), `si` (Sinhala), `ta` (Tamil). All are left to right.

Translation coverage is thin and it is worth knowing before promising anything:

| Locale | Translated docs | Total docs |
|---|---|---|
| si | 2 (`overview`, `getting-started`) | 33 |
| ta | 2 (`overview`, `getting-started`) | 33 |

Navbar, footer and UI strings are translated in
`i18n/<locale>/docusaurus-theme-classic/*.json` and `code.json`. Everything
else falls back to English silently, so a Sinhala visitor gets a translated
shell around English content.

`npm start` serves the default locale only. To see another:

```bash
npm start -- --locale si
```

After changing UI strings, run `npm run write-translations` to regenerate the
JSON, then fill in the new keys.

## Things that look wrong but are not

- **`editUrl: undefined`** in the docs preset. The "edit this page" link is
  deliberately absent — the repository is private.
- **`onBrokenLinks: "warn"`** rather than `throw`. Broken links will not fail
  the build. If you add cross-references, check the build output for warnings,
  because nothing else will tell you.
- **A deprecation warning on every build** for `siteConfig.onBrokenMarkdownLinks`.
  Harmless in 3.10, removed in Docusaurus v4. `future.v4` is already `true`, so
  this will need moving to `markdown.hooks.onBrokenMarkdownLinks` eventually.
- **`typescript: ~7.0.2`** in devDependencies. Unusual, and `npm run typecheck`
  passes, so leave it alone.

## Links that point somewhere else

The navbar and footer link to `https://github.com/anomalyco/sewa-platform`,
which is not this repository's remote and does not match the GitLab or
`GovTech-SL` organisations the backend services use. Treat it as a placeholder
and confirm the real destination before relying on it.

`url: "https://developer.sewa.gov"` is likewise unverified.

## Relationship to the rest of the workspace

This directory sits alongside the Sewa backend services, but shares nothing with
them: no imports, no build step, no runtime dependency in either direction. It
documents the mini app SDK that the container shell exposes, which is a
different surface from the backend HTTP APIs.

The root `docker-compose.yml` one level up does **not** include this site. It is
not part of the local backend stack and does not need the stack running.
