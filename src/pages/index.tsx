import type { ReactNode } from "react";
import React from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Translate, { translate } from "@docusaurus/Translate";
import styles from "./index.module.css";
import { useTypesPackage } from "../components/TypesPackage";

// ---------------------------------------------------------------------------
// Hero - clean, benefit-driven, strictly within .container
// ---------------------------------------------------------------------------
function Hero() {
  const typesPackage = useTypesPackage();
  return (
    <header
      className={styles.heroBanner}
      style={{
        background: "var(--hero-bg)",
        borderBottom: "1px solid var(--hero-border)",
        padding: "64px 0 56px",
      }}
    >
      <div className="container">
        <div className={styles.heroGrid}>
          {/* Left - copy */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 12px",
                borderRadius: "9999px",
                background: "var(--hero-kicker-bg)",
                border: "1px solid var(--hero-kicker-border)",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--hero-kicker-text)",
                marginBottom: "18px",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--hero-kicker-dot)",
                  display: "inline-block",
                }}
              />
              <Translate id="homepage.hero.kicker" description="Hero kicker">Sewa Developer Portal · Government of Sri Lanka</Translate>
            </div>

            <Heading
              as="h1"
              style={{
                fontSize: "2.55rem",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "var(--hero-text)",
                marginBottom: "14px",
                letterSpacing: "-0.02em",
              }}
            >
              <Translate id="homepage.hero.title.line1" description="Hero title line 1">Build mini apps</Translate>
              <br />
              <span style={{ color: "var(--hero-text-accent)" }}><Translate id="homepage.hero.title.line2" description="Hero title line 2">for the Sewa platform.</Translate></span>
            </Heading>

            <p
              style={{
                color: "var(--hero-subtext)",
                fontSize: "1.05rem",
                lineHeight: 1.6,
                marginBottom: "22px",
                maxWidth: "520px",
              }}
            >
              <Translate id="homepage.hero.subtitle" description="Hero subtitle">Ship lightweight ES modules that run inside the Sewa Citizen shell. The host injects the SDK at runtime — you just declare types and export</Translate>{" "}
              <code style={{ color: "var(--hero-inline-code-text)", background: "var(--hero-inline-code-bg)", padding: "1px 6px", borderRadius: 4, fontSize: "0.9em" }}>mount(container, runtime)</code>.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                className="button button--primary button--lg landing-cta-primary"
                to="/docs/getting-started"
                style={{ padding: "10px 22px", borderRadius: 10 }}
              >
                <Translate id="homepage.hero.cta.getStarted" description="Hero CTA">Get started</Translate>
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="/docs/sdk/core"
                style={{
                  fontWeight: 600,
                  padding: "10px 22px",
                  borderRadius: 10,
                  background: "var(--hero-secondary-btn-bg)",
                  color: "var(--hero-secondary-btn-text)",
                  border: "1px solid var(--hero-secondary-btn-border)",
                }}
              >
                <Translate id="homepage.hero.cta.apiReference" description="Hero CTA">API reference</Translate>
              </Link>
            </div>

            <div
              style={{
                display: "flex",
                gap: "14px",
                marginTop: "18px",
                fontSize: "0.78rem",
                color: "var(--hero-subtext)",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} />
                <Translate id="homepage.hero.badge1" description="Hero badge">Host-injected · zero runtime install</Translate>
              </span>
              <span>·</span>
              <span><Translate id="homepage.hero.badge2" description="Hero badge" values={{package: typesPackage}}>{'Type-safe with {package}'}</Translate></span>
            </div>
          </div>

          {/* Right - minimal code preview (not a docs dump) */}
          <div
            style={{
              background: "var(--hero-code-bg)",
              border: "1px solid var(--hero-code-border)",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 16px",
                borderBottom: "1px solid var(--hero-code-header-border)",
                fontSize: "0.78rem",
                color: "var(--hero-code-header-text)",
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c940" }} />
              <span style={{ marginLeft: "8px", fontFamily: "monospace", color: "var(--hero-code-header-text)" }}>src/main.tsx</span>
            </div>
            <pre
              style={{
                margin: 0,
                padding: "18px 16px",
                fontSize: "0.82rem",
                lineHeight: 1.65,
                color: "var(--hero-code-text)",
                overflow: "auto",
                background: "var(--hero-code-bg)",
              }}
            >
              <code>{`// No SDK npm install - host injects it
import type { MiniAppSdkInterface } from "${typesPackage}";

export function mount(container: HTMLElement, runtime?: { initialPath?: string }) {
  const sdk = window.__GSA_SDK__!; // injected by host shell

  // type-safe from day one
  const user = await sdk.auth.getUser();
  const res  = await sdk.device.location();

  render(<App user={user} />, container);
  return { unmount() { /* cleanup */ } };
}`}</code>
            </pre>
            <div
              style={{
                padding: "10px 16px",
                borderTop: "1px solid var(--hero-code-footer-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.78rem",
              }}
            >
              <span style={{ color: "var(--hero-code-footer-text)", fontFamily: "monospace" }}><Translate id="homepage.hero.code.footer" description="Hero code footer">vite build --lib → ES module</Translate></span>
              <Link to="/docs/getting-started" style={{ color: "var(--hero-code-link)", fontWeight: 600, textDecoration: "none" }}>
                <Translate id="homepage.hero.code.craft" description="Hero code craft">Scaffold in 4 steps →</Translate>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// How it works - 3 steps, reassuring & scannable
// ---------------------------------------------------------------------------
function HowItWorks() {
  const typesPackage = useTypesPackage();
  const steps = [
    {
      n: "01",
      title: translate({ id: "homepage.howItWorks.step1.title", message: "Install types", description: "How it works step 1 title" }),
      desc: translate({ id: "homepage.howItWorks.step1.desc", message: "Add {package} as a devDependency for full sdk.* typings.", description: "How it works step 1 desc" }, { package: typesPackage }),
      code: `pnpm add -D ${typesPackage}`,
      href: "/docs/getting-started",
    },
    {
      n: "02",
      title: translate({ id: "homepage.howItWorks.step2.title", message: "Export mount()", description: "How it works step 2 title" }),
      desc: translate({ id: "homepage.howItWorks.step2.desc", message: "Your bundle exports mount(container, runtime). The host calls it when the user opens the mini app.", description: "How it works step 2 desc" }),
      code: "export function mount(container, runtime) { … }",
      href: "/docs/getting-started",
    },
    {
      n: "03",
      title: translate({ id: "homepage.howItWorks.step3.title", message: "Build as ES lib", description: "How it works step 3 title" }),
      desc: translate({ id: "homepage.howItWorks.step3.desc", message: "Vite lib mode outputs a single ES module the shell loads on demand. No SDK bundling.", description: "How it works step 3 desc" }),
      code: "vite build - lib src/main.tsx",
      href: "/docs/getting-started",
    },
  ];
  return (
    <section style={{ padding: "48px 0 8px" }}>
      <div className="container">
        <div style={{ maxWidth: 640, marginBottom: 22 }}>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text-secondary)",
              marginBottom: 8,
            }}
          >
            <Translate id="homepage.howItWorks.kicker" description="How it works kicker">How it works</Translate>
          </div>
          <Heading as="h2" style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.015em" }}>
            <Translate id="homepage.howItWorks.title" description="How it works title">Three steps to a shippable mini app</Translate>
          </Heading>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
            <Translate id="homepage.howItWorks.description" description="How it works description">The pattern mirrors</Translate>{" "}
            <code style={{ fontSize: "0.85em" }}>test-mini-app/</code> <Translate id="homepage.howItWorks.description2" description="How it works description 2">in the</Translate>{" "}
            <a href="https://github.com/anomalyco/sewa-platform" style={{ color: "var(--color-text-link)", fontWeight: 600 }}>
              sewa-platform repo
            </a>
            <Translate id="homepage.howItWorks.description3" description="How it works description 3">. You keep your stack - the host handles auth, permissions, and device access.</Translate>
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 18 }}>
          {steps.map((s) => (
            <Link
              key={s.n}
              to={s.href}
              className="portal-card"
              style={{ padding: "20px 18px", textDecoration: "none" }}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--landing-step-color)", letterSpacing: "0.04em", marginBottom: 6 }}>
                STEP {s.n}
              </div>
              <div style={{ fontWeight: 700, fontSize: "1.02rem", marginBottom: 6, color: "var(--color-text-primary)" }}>{s.title}</div>
              <div style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", lineHeight: 1.55, marginBottom: 12 }}>{s.desc}</div>
              <code
                style={{
                  fontSize: "0.78rem",
                  background: "var(--color-surface-sunken)",
                  border: "1px solid var(--color-border-decorative)",
                  padding: "6px 8px",
                  borderRadius: 8,
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "var(--color-text-primary)",
                }}
              >
                {s.code}
              </code>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Capability teaser - curated 6, not exhaustive 14
// ---------------------------------------------------------------------------
function CapabilityTeaser() {
  const caps: { title: string; href: string; desc: string; icon: string; descId: string }[] = [
    { title: "sdk.auth", href: "/docs/sdk/auth", desc: "getUser · isAuthenticated · logout - citizen identity", icon: "🔐", descId: "homepage.capability.auth.desc" },
    { title: "sdk.device", href: "/docs/sdk/device", desc: "location · camera · gallery · files · biometric", icon: "📱", descId: "homepage.capability.device.desc" },
    { title: "sdk.http", href: "/docs/sdk/http", desc: "get/post/put/patch/delete + streaming proxy", icon: "🌐", descId: "homepage.capability.http.desc" },
    { title: "sdk.storage", href: "/docs/sdk/storage", desc: "scoped key-value & JSON helpers per mini app", icon: "💾", descId: "homepage.capability.storage.desc" },
    { title: "sdk.appearance", href: "/docs/sdk/appearance", desc: "getLocale · getTheme · theme/locale subscriptions", icon: "🎨", descId: "homepage.capability.appearance.desc" },
    { title: "sdk.gicChat", href: "/docs/sdk/gic-chat", desc: "startSession · streamText - AI chat gateway", icon: "✦", descId: "homepage.capability.gicChat.desc" },
  ];
  return (
    <section style={{ padding: "40px 0 16px" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <Heading as="h2" style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, letterSpacing: "-0.015em" }}>
            <Translate id="homepage.capability.title" description="Capability title">What you can build with</Translate>
          </Heading>
          <Link to="/docs/sdk/core" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-link)" }}>
            <Translate id="homepage.capability.cta" description="Capability CTA">Full SDK reference →</Translate>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {caps.map((c) => (
            <Link key={c.title} to={c.href} className="portal-card" style={{ padding: "18px", textDecoration: "none", flexDirection: "row", gap: 14, alignItems: "flex-start" }}>
              <span className="landing-feature-icon" aria-hidden>{c.icon}</span>
              <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <code style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>{c.title}</code>
                <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{translate({ id: c.descId, message: c.desc, description: `Capability ${c.title} description` })}</span>
              </span>
            </Link>
          ))}
        </div>

        <div
          style={{
            marginTop: 18,
            padding: "12px 16px",
            borderRadius: 12,
            background: "var(--color-surface-sunken)",
            border: "1px solid var(--color-border-decorative)",
            fontSize: "0.85rem",
            color: "var(--color-text-secondary)",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}><Translate id="homepage.capability.alsoAvailable" description="Capability also">Also available:</Translate></span>
          <Link to="/docs/sdk/permissions" style={{ fontWeight: 500, color: "var(--color-text-link)" }}>permissions</Link>
          <span>·</span> <Link to="/docs/sdk/flags" style={{ fontWeight: 500, color: "var(--color-text-link)" }}>flags</Link>
          <span>·</span> <Link to="/docs/sdk/navigation" style={{ fontWeight: 500, color: "var(--color-text-link)" }}>navigation</Link>
          <span>·</span> <Link to="/docs/sdk/notifications" style={{ fontWeight: 500, color: "var(--color-text-link)" }}>notifications</Link>
          <span>·</span> <Link to="/docs/sdk/links" style={{ fontWeight: 500, color: "var(--color-text-link)" }}>links</Link>
          <span>·</span> <Link to="/docs/sdk/config" style={{ fontWeight: 500, color: "var(--color-text-link)" }}>config</Link>
          <span style={{ marginLeft: "auto" }}>
            <Link to="/docs/sdk/core" style={{ fontWeight: 700, color: "var(--color-text-link)" }}><Translate id="homepage.capability.browseAll" description="Capability browse">Browse all 14 namespaces →</Translate></Link>
          </span>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Integrations - reassigned header links now live here
// ---------------------------------------------------------------------------
function IntegrationGrid() {
  const cards: { title: string; to: string; badge: string; badgeId: string; badgeVariant: "active" | "upcoming"; desc: string; descId: string; cta: string; ctaId: string }[] = [
    {
      title: "React",
      to: "/docs/integration/react",
      badge: "Active · Production ready",
      badgeId: "homepage.integrations.react.badge",
      badgeVariant: "active",
      desc: "Reference implementation. Hooks + Provider wrap window.__GSA_SDK__ with full typings.",
      descId: "homepage.integrations.react.desc",
      cta: "View React guide →",
      ctaId: "homepage.integrations.react.cta",
    },
    {
      title: "Vue.js",
      to: "/docs/integration/vue",
      badge: "Upcoming · Roadmap",
      badgeId: "homepage.integrations.vue.badge",
      badgeVariant: "upcoming",
      desc: "Composition API adapter for Vue 3. Tracks the same mount() lifecycle.",
      descId: "homepage.integrations.vue.desc",
      cta: "View Vue guide →",
      ctaId: "homepage.integrations.vue.cta",
    },
    {
      title: "Angular (NG)",
      to: "/docs/integration/angular",
      badge: "Upcoming · Roadmap",
      badgeId: "homepage.integrations.angular.badge",
      badgeVariant: "upcoming",
      desc: "Standalone components & injectable SDK service - aligned with Angular 17+ patterns.",
      descId: "homepage.integrations.angular.desc",
      cta: "View Angular guide →",
      ctaId: "homepage.integrations.angular.cta",
    },
    {
      title: "SDK Playground",
      to: "/docs/playground",
      badge: "Interactive · Live in docs",
      badgeId: "homepage.integrations.playground.badge",
      badgeVariant: "active",
      desc: "Try every sdk.* method against a mock transport. No local setup - runs inside the docs site.",
      descId: "homepage.integrations.playground.desc",
      cta: "Open playground →",
      ctaId: "homepage.integrations.playground.cta",
    },
  ];
  return (
    <section style={{ padding: "36px 0 24px" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 4 }}>
              <Translate id="homepage.integrations.kicker" description="Integrations kicker">Choose your stack</Translate>
            </div>
            <Heading as="h2" style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, letterSpacing: "-0.015em" }}>
              <Translate id="homepage.integrations.title" description="Integrations title">Framework guides & tools</Translate>
            </Heading>
          </div>
          <Link to="/docs/overview" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-link)" }}>
            <Translate id="homepage.integrations.cta" description="Integrations CTA">Platform overview →</Translate>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {cards.map((card) => (
            <Link key={card.title} to={card.to} className="portal-card" style={{ padding: "20px 18px", textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--color-text-primary)" }}>{card.title}</span>
                <span
                  className={card.badgeVariant === "active" ? "badge-active" : "badge-upcoming"}
                  style={{ fontSize: "0.68rem", padding: "2px 8px" }}
                >
                  {translate({ id: card.badgeId, message: card.badge, description: `${card.title} badge` })}
                </span>
              </div>
              <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", lineHeight: 1.55, margin: "0 0 14px", flex: 1 }}>{translate({ id: card.descId, message: card.desc, description: `${card.title} description` })}</p>
              <span style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--color-text-link)" }}>{translate({ id: card.ctaId, message: card.cta, description: `${card.title} CTA` })}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Playground teaser - static preview, not full explorer
// ---------------------------------------------------------------------------
function PlaygroundTeaser() {
  return (
    <section style={{ padding: "28px 0 40px" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 20,
            alignItems: "center",
            border: "1px solid var(--color-border-decorative)",
            borderRadius: 16,
            background: "var(--color-surface-card)",
            padding: 20,
          }}
          className={styles.teaserGrid}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--color-text-secondary)",
                marginBottom: 8,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              <Translate id="homepage.playground.kicker" description="Playground kicker">Live SDK Playground</Translate>
            </div>
            <Heading as="h3" style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
              <Translate id="homepage.playground.title" description="Playground title">Try the SDK before you ship</Translate>
            </Heading>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.92rem", lineHeight: 1.6, margin: "0 0 16px" }}>
              <Translate id="homepage.playground.description" description="Playground description">Call any sdk.* method with a mock transport, inspect request/response shapes, and copy the snippet into your mini app. Built from packages/sdk-playground - no extra install.</Translate>
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/docs/playground" className="button button--primary" style={{ fontWeight: 700, borderRadius: 10, padding: "8px 16px", background: "var(--color-action-primary)", color: "var(--color-action-primary-foreground)", border: "1px solid var(--color-border-default)" }}>
                <Translate id="homepage.playground.cta.open" description="Playground CTA">Open playground</Translate>
              </Link>
              <Link
                to="/docs/sdk/core"
                className="button button--secondary"
                style={{
                  fontWeight: 600,
                  borderRadius: 10,
                  padding: "8px 16px",
                  background: "transparent",
                  border: "1px solid var(--color-border-default)",
                  color: "var(--color-text-primary)",
                }}
              >
                <Translate id="homepage.playground.cta.catalog" description="Playground CTA">View method catalog</Translate>
              </Link>
            </div>
          </div>

          <div
            style={{
              background: "var(--color-surface-sunken)",
              border: "1px solid var(--color-border-decorative)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                borderBottom: "1px solid var(--color-border-decorative)",
                fontSize: "0.78rem",
                color: "var(--color-text-secondary)",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c940" }} />
              <span style={{ marginLeft: 6, fontFamily: "monospace" }}>playground · sdk.auth.getUser()</span>
            </div>
            <div style={{ padding: "12px", fontFamily: "monospace", fontSize: "0.78rem", lineHeight: 1.55 }}>
              <div style={{ color: "var(--color-text-secondary)" }}>▸ sdk.auth.getUser()</div>
              <div style={{ color: "var(--color-text-secondary)", marginTop: 8, background: "var(--color-surface-card)", border: "1px solid var(--color-border-decorative)", borderRadius: 8, padding: "8px 10px" }}>
                {"{"} <span style={{ color: "var(--landing-code-string)" }}>"id": "citizen_12"</span>, <span style={{ color: "var(--landing-code-string)" }}>"name": "Demo User"</span> {"}"}
              </div>
              <div style={{ color: "var(--color-text-secondary)", marginTop: 8 }}>▸ sdk.device.location()</div>
              <div style={{ color: "var(--color-text-secondary)", marginTop: 4, fontStyle: "italic" }}>→ {"{ status: \"granted\", data: { latitude, longitude } }"}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Final CTA - dark band
// ---------------------------------------------------------------------------
function FinalCTA() {
  return (
    <section
      style={{
        padding: "40px 0 48px",
        background: "var(--color-surface-masthead)",
        borderTop: "1px solid var(--color-border-decorative)",
      }}
    >
      <div className="container" style={{ textAlign: "center" }}>
        <Heading as="h2" style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.015em" }}>
          <Translate id="homepage.final.title" description="Final CTA title">Ready to build for Sewa?</Translate>
        </Heading>
        <p style={{ color: "#9aa0b0", maxWidth: 560, margin: "0 auto 20px", fontSize: "0.95rem", lineHeight: 1.6 }}>
          <Translate id="homepage.final.subtitle" description="Final CTA subtitle">Scaffold from test-mini-app/, read the platform overview, or dive straight into the API reference.</Translate>
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/docs/getting-started" className="button button--primary button--lg landing-cta-primary" style={{ borderRadius: 10, padding: "10px 22px" }}>
            <Translate id="homepage.final.cta.getStarted" description="Final CTA">Get started</Translate>
          </Link>
          <Link
            to="/docs/overview"
            className="button button--secondary button--lg"
            style={{
              borderRadius: 10,
              padding: "10px 22px",
              background: "transparent",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.22)",
              fontWeight: 600,
            }}
          >
            <Translate id="homepage.final.cta.overview" description="Final CTA">Platform overview</Translate>
          </Link>
          <a
            href="https://github.com/anomalyco/sewa-platform"
            target="_blank"
            rel="noreferrer"
            className="button button--secondary button--lg"
            style={{
              borderRadius: 10,
              padding: "10px 22px",
              background: "transparent",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.16)",
              fontWeight: 500,
            }}
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout title="Sewa Developer Portal" description="Build mini apps for the Sewa government platform.">
      <Hero />
      <main>
        <HowItWorks />
        <CapabilityTeaser />
        <IntegrationGrid />
        <PlaygroundTeaser />
        <FinalCTA />
      </main>
    </Layout>
  );
}
