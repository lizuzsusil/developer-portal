import type { ReactNode } from "react";
import React from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import styles from "./index.module.css";

// ---------------------------------------------------------------------------
// Hero — clean, benefit-driven, strictly within .container
// ---------------------------------------------------------------------------
function Hero() {
  return (
    <header
      className={styles.heroBanner}
      style={{
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #1a2744 100%)",
        borderBottom: "1px solid #2a2a2a",
        padding: "64px 0 56px",
      }}
    >
      <div className="container">
        <div className={styles.heroGrid}>
          {/* Left — copy */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 12px",
                borderRadius: "9999px",
                background: "rgba(255,199,0,0.12)",
                border: "1px solid rgba(255,199,0,0.25)",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#ffd740",
                marginBottom: "18px",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#ffc700",
                  display: "inline-block",
                }}
              />
              Sewa Developer Portal · Government of Nepal
            </div>

            <Heading
              as="h1"
              style={{
                fontSize: "2.55rem",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#fff",
                marginBottom: "14px",
                letterSpacing: "-0.02em",
              }}
            >
              Build mini apps
              <br />
              <span style={{ color: "#ffc700" }}>for the Sewa platform.</span>
            </Heading>

            <p
              style={{
                color: "#9aa0b0",
                fontSize: "1.05rem",
                lineHeight: 1.6,
                marginBottom: "22px",
                maxWidth: "520px",
              }}
            >
              Ship lightweight ES modules that run inside the Sewa Citizen shell.
              The host injects the SDK at runtime — you just declare types and
              export <code style={{ color: "#ffd740", background: "rgba(255,199,0,0.12)", padding: "1px 6px", borderRadius: 4, fontSize: "0.9em" }}>mount(container, runtime)</code>.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                className="button button--primary button--lg landing-cta-primary"
                to="/docs/getting-started"
                style={{ padding: "10px 22px", borderRadius: 10 }}
              >
                Get started
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="/docs/sdk/core"
                style={{
                  fontWeight: 600,
                  padding: "10px 22px",
                  borderRadius: 10,
                  background: "transparent",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.22)",
                }}
              >
                API reference
              </Link>
            </div>

            <div
              style={{
                display: "flex",
                gap: "14px",
                marginTop: "18px",
                fontSize: "0.78rem",
                color: "#6b7280",
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
                Host-injected · zero runtime install
              </span>
              <span>·</span>
              <span>Type-safe with @lizuz/mini-app-types</span>
            </div>
          </div>

          {/* Right — minimal code preview (not a docs dump) */}
          <div
            style={{
              background: "#0f1115",
              border: "1px solid #242836",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 16px",
                borderBottom: "1px solid #1f2433",
                fontSize: "0.78rem",
                color: "#6b7280",
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c940" }} />
              <span style={{ marginLeft: "8px", fontFamily: "monospace", color: "#8b95a8" }}>src/main.tsx</span>
            </div>
            <pre
              style={{
                margin: 0,
                padding: "18px 16px",
                fontSize: "0.82rem",
                lineHeight: 1.65,
                color: "#e5e7eb",
                overflow: "auto",
              }}
            >
              <code>{`// No SDK npm install — host injects it
import type { MiniAppSdkInterface } from "@lizuz/mini-app-types";

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
                borderTop: "1px solid #1f2433",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.78rem",
              }}
            >
              <span style={{ color: "#6b7280", fontFamily: "monospace" }}>vite build --lib → ES module</span>
              <Link to="/docs/getting-started" style={{ color: "#ffd740", fontWeight: 600, textDecoration: "none" }}>
                Scaffold in 4 steps →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// How it works — 3 steps, reassuring & scannable
// ---------------------------------------------------------------------------
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Install types",
      desc: "Add @lizuz/mini-app-types as a devDependency for full sdk.* typings.",
      code: "pnpm add -D @lizuz/mini-app-types",
      href: "/docs/getting-started",
    },
    {
      n: "02",
      title: "Export mount()",
      desc: "Your bundle exports mount(container, runtime). The host calls it when the user opens the mini app.",
      code: "export function mount(container, runtime) { … }",
      href: "/docs/getting-started#2-entry-point-maintsx",
    },
    {
      n: "03",
      title: "Build as ES lib",
      desc: "Vite lib mode outputs a single ES module the shell loads on demand. No SDK bundling.",
      code: "vite build — lib src/main.tsx",
      href: "/docs/getting-started#3-vite-build-viteconfigts",
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
              color: "var(--color-text-tertiary)",
              marginBottom: 8,
            }}
          >
            How it works
          </div>
          <Heading as="h2" style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.015em" }}>
            Three steps to a shippable mini app
          </Heading>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
            The pattern mirrors{" "}
            <code style={{ fontSize: "0.85em" }}>test-mini-app/</code> in the{" "}
            <a href="https://github.com/anomalyco/sewa-platform" style={{ color: "var(--blue-700)", fontWeight: 600 }}>
              sewa-platform repo
            </a>
            . You keep your stack — the host handles auth, permissions, and device access.
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
              <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--gold-700)", letterSpacing: "0.04em", marginBottom: 6 }}>
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
// Capability teaser — curated 6, not exhaustive 14
// ---------------------------------------------------------------------------
function CapabilityTeaser() {
  const caps: { title: string; href: string; desc: string; icon: string }[] = [
    { title: "sdk.auth", href: "/docs/sdk/auth", desc: "getUser · isAuthenticated · logout — citizen identity", icon: "🔐" },
    { title: "sdk.device", href: "/docs/sdk/device", desc: "location · camera · gallery · files · biometric", icon: "📱" },
    { title: "sdk.http", href: "/docs/sdk/http", desc: "get/post/put/patch/delete + streaming proxy", icon: "🌐" },
    { title: "sdk.storage", href: "/docs/sdk/storage", desc: "scoped key-value & JSON helpers per mini app", icon: "💾" },
    { title: "sdk.appearance", href: "/docs/sdk/appearance", desc: "getLocale · getTheme · theme/locale subscriptions", icon: "🎨" },
    { title: "sdk.gicChat", href: "/docs/sdk/gic-chat", desc: "startSession · streamText — AI chat gateway", icon: "✦" },
  ];
  return (
    <section style={{ padding: "40px 0 16px" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <Heading as="h2" style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, letterSpacing: "-0.015em" }}>
            What you can build with
          </Heading>
          <Link to="/docs/sdk/core" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--blue-700)" }}>
            Full SDK reference →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {caps.map((c) => (
            <Link key={c.title} to={c.href} className="portal-card" style={{ padding: "18px", textDecoration: "none", flexDirection: "row", gap: 14, alignItems: "flex-start" }}>
              <span className="landing-feature-icon" aria-hidden>{c.icon}</span>
              <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <code style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>{c.title}</code>
                <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{c.desc}</span>
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
          <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Also available:</span>
          <Link to="/docs/sdk/permissions" style={{ fontWeight: 500 }}>permissions</Link>
          <span>·</span> <Link to="/docs/sdk/flags" style={{ fontWeight: 500 }}>flags</Link>
          <span>·</span> <Link to="/docs/sdk/navigation" style={{ fontWeight: 500 }}>navigation</Link>
          <span>·</span> <Link to="/docs/sdk/notifications" style={{ fontWeight: 500 }}>notifications</Link>
          <span>·</span> <Link to="/docs/sdk/links" style={{ fontWeight: 500 }}>links</Link>
          <span>·</span> <Link to="/docs/sdk/config" style={{ fontWeight: 500 }}>config</Link>
          <span style={{ marginLeft: "auto" }}>
            <Link to="/docs/sdk/core" style={{ fontWeight: 700, color: "var(--blue-700)" }}>Browse all 14 namespaces →</Link>
          </span>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Integrations — reassigned header links now live here
// ---------------------------------------------------------------------------
function IntegrationGrid() {
  const cards: { title: string; to: string; badge: string; badgeVariant: "active" | "upcoming"; desc: string; cta: string }[] = [
    {
      title: "React",
      to: "/docs/integration/react",
      badge: "Active · Production ready",
      badgeVariant: "active",
      desc: "Reference implementation. Hooks + Provider wrap window.__GSA_SDK__ with full typings.",
      cta: "View React guide →",
    },
    {
      title: "Vue.js",
      to: "/docs/integration/vue",
      badge: "Upcoming · Roadmap",
      badgeVariant: "upcoming",
      desc: "Composition API adapter for Vue 3. Tracks the same mount() lifecycle.",
      cta: "View Vue guide →",
    },
    {
      title: "Angular (NG)",
      to: "/docs/integration/angular",
      badge: "Upcoming · Roadmap",
      badgeVariant: "upcoming",
      desc: "Standalone components & injectable SDK service — aligned with Angular 17+ patterns.",
      cta: "View Angular guide →",
    },
    {
      title: "SDK Playground",
      to: "/docs/playground",
      badge: "Interactive · Live in docs",
      badgeVariant: "active",
      desc: "Try every sdk.* method against a mock transport. No local setup — runs inside the docs site.",
      cta: "Open playground →",
    },
  ];
  return (
    <section style={{ padding: "36px 0 24px" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: 4 }}>
              Choose your stack
            </div>
            <Heading as="h2" style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, letterSpacing: "-0.015em" }}>
              Framework guides & tools
            </Heading>
          </div>
          <Link to="/docs/overview" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--blue-700)" }}>
            Platform overview →
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
                  {card.badge}
                </span>
              </div>
              <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", lineHeight: 1.55, margin: "0 0 14px", flex: 1 }}>{card.desc}</p>
              <span style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--blue-700)" }}>{card.cta}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Playground teaser — static preview, not full explorer
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
                color: "var(--color-text-tertiary)",
                marginBottom: 8,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              Live SDK Playground
            </div>
            <Heading as="h3" style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
              Try the SDK before you ship
            </Heading>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.92rem", lineHeight: 1.6, margin: "0 0 16px" }}>
              Call any <code>sdk.*</code> method with a mock transport, inspect request/response shapes, and copy the snippet into your mini app.
              Built from <code>packages/sdk-playground</code> — no extra install.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/docs/playground" className="button button--primary" style={{ fontWeight: 700, borderRadius: 10, padding: "8px 16px", background: "var(--neutral-900)", color: "#fff", border: "none" }}>
                Open playground
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
                View method catalog
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
                color: "var(--color-text-tertiary)",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c940" }} />
              <span style={{ marginLeft: 6, fontFamily: "monospace" }}>playground · sdk.auth.getUser()</span>
            </div>
            <div style={{ padding: "12px", fontFamily: "monospace", fontSize: "0.78rem", lineHeight: 1.55 }}>
              <div style={{ color: "var(--color-text-tertiary)" }}>▸ sdk.auth.getUser()</div>
              <div style={{ color: "var(--color-text-secondary)", marginTop: 8, background: "var(--color-surface-card)", border: "1px solid var(--color-border-decorative)", borderRadius: 8, padding: "8px 10px" }}>
                {"{"} <span style={{ color: "#059669" }}>"id": "citizen_12"</span>, <span style={{ color: "#059669" }}>"name": "Demo User"</span> {"}"}
              </div>
              <div style={{ color: "var(--color-text-tertiary)", marginTop: 8 }}>▸ sdk.device.location()</div>
              <div style={{ color: "var(--color-text-tertiary)", marginTop: 4, fontStyle: "italic" }}>→ {"{ status: \"granted\", data: { latitude, longitude } }"}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Final CTA — dark band
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
          Ready to build for Sewa?
        </Heading>
        <p style={{ color: "#9aa0b0", maxWidth: 560, margin: "0 auto 20px", fontSize: "0.95rem", lineHeight: 1.6 }}>
          Scaffold from <code style={{ color: "#ffd740", background: "rgba(255,199,0,0.12)", padding: "1px 6px", borderRadius: 4 }}>test-mini-app/</code>,
          read the platform overview, or dive straight into the API reference.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/docs/getting-started" className="button button--primary button--lg landing-cta-primary" style={{ borderRadius: 10, padding: "10px 22px" }}>
            Get started
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
            Platform overview
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
