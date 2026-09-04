import type { ReactNode } from "react";
import React from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Translate, { translate } from "@docusaurus/Translate";
import styles from "./index.module.css";
import { PhIcon } from "../components/PhIcon";
import { useTypesPackage } from "../components/TypesPackage";

function Hero() {
  const typesPackage = useTypesPackage();
  return (
    <header
      className={styles.heroBanner}
      style={{
        background: "var(--hero-bg)",
        borderBottom: "1px solid var(--hero-border)",
        padding: "80px 0 72px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-30%",
          right: "-15%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,199,0,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className={styles.heroGrid}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "5px 14px",
                borderRadius: "9999px",
                background: "var(--hero-kicker-bg)",
                border: "1px solid var(--hero-kicker-border)",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--hero-kicker-text)",
                marginBottom: "22px",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--hero-kicker-dot)",
                  display: "inline-block",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <Translate id="homepage.hero.kicker" description="Hero kicker">Sewa Developer Portal · Government of Sri Lanka</Translate>
            </div>

            <Heading
              as="h1"
              style={{
                fontSize: "clamp(2.2rem, 4.5vw, 3rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                color: "var(--hero-text)",
                marginBottom: "18px",
                letterSpacing: "-0.03em",
              }}
            >
              <Translate id="homepage.hero.title.line1" description="Hero title line 1">Build mini apps</Translate>
              <br />
              <span style={{ color: "var(--hero-text-accent)" }}><Translate id="homepage.hero.title.line2" description="Hero title line 2">for the Sewa platform.</Translate></span>
            </Heading>

            <p
              style={{
                color: "var(--hero-subtext)",
                fontSize: "1.1rem",
                lineHeight: 1.65,
                marginBottom: "28px",
                maxWidth: "540px",
              }}
            >
              <Translate id="homepage.hero.subtitle" description="Hero subtitle">Ship lightweight ES modules that run inside the Sewa Citizen shell. The host injects the SDK at runtime — you just declare types and export</Translate>{" "}
              <code style={{ color: "var(--hero-inline-code-text)", background: "var(--hero-inline-code-bg)", padding: "2px 8px", borderRadius: 6, fontSize: "0.9em", fontWeight: 600 }}>mount(container, runtime?)</code>.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link
                className="button button--primary button--lg landing-cta-primary"
                to="/docs/getting-started"
                style={{ padding: "12px 26px", borderRadius: 12, fontWeight: 700, boxShadow: "0 4px 14px rgba(255,199,0,0.25)" }}
              >
                <Translate id="homepage.hero.cta.getStarted" description="Hero CTA">Get started</Translate>
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="/docs/sdk/core"
                style={{
                  fontWeight: 600,
                  padding: "12px 26px",
                  borderRadius: 12,
                  background: "var(--hero-secondary-btn-bg)",
                  color: "var(--hero-secondary-btn-text)",
                  border: "1px solid var(--hero-secondary-btn-border)",
                  transition: "all 0.2s ease",
                }}
              >
                <Translate id="homepage.hero.cta.apiReference" description="Hero CTA">API reference</Translate>
              </Link>
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop: "24px",
                fontSize: "0.82rem",
                color: "var(--hero-subtext)",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
                <Translate id="homepage.hero.badge1" description="Hero badge">Host-injected · zero runtime install</Translate>
              </span>
              <span>·</span>
              <span><Translate id="homepage.hero.badge2" description="Hero badge" values={{package: typesPackage}}>{'Type-safe with {package}'}</Translate></span>
              <span>·</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <Translate id="homepage.hero.badge3" description="Hero badge">Secure by design</Translate>
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                background: "var(--hero-code-bg)",
                border: "1px solid var(--hero-code-border)",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 25px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.05)",
                width: "100%",
                maxWidth: "520px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "14px 18px",
                  borderBottom: "1px solid var(--hero-code-header-border)",
                  fontSize: "0.82rem",
                  color: "var(--hero-code-header-text)",
                  background: "var(--hero-code-header-bg)",
                }}
              >
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c940" }} />
                <span style={{ marginLeft: "10px", fontFamily: "monospace", color: "var(--hero-code-header-text)", fontSize: "0.8rem" }}>src/main.tsx</span>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: "20px 18px",
                  fontSize: "0.84rem",
                  lineHeight: 1.7,
                  color: "var(--hero-code-text)",
                  overflow: "auto",
                  background: "var(--hero-code-bg)",
                }}
              >
                <code>{`// No SDK npm install — host injects it
import type { MiniAppSdkInterface } from "${typesPackage}";

export function mount(container: HTMLElement, runtime?: { initialPath?: string }) {
  const sdk = window.__GSA_SDK__!;

  // type-safe from day one
  const user = await sdk.auth.getUser();
  const res  = await sdk.device.location();

  render(<App user={user} />, container);
  return { unmount() { /* cleanup */ } };
}`}</code>
              </pre>
              <div
                style={{
                  padding: "12px 18px",
                  borderTop: "1px solid var(--hero-code-footer-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.82rem",
                  background: "var(--hero-code-header-bg)",
                }}
              >
<span style={{ color: "var(--hero-code-footer-text)", fontFamily: "monospace" }}><Translate id="homepage.hero.code.footer" description="Hero code footer" values={{ arrow: <PhIcon name="arrow-right" /> }}>{"vite build --lib {arrow} ES module"}</Translate></span>
                <Link to="/docs/getting-started" style={{ color: "var(--hero-code-link)", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Translate id="homepage.hero.code.craft" description="Hero code craft" values={{ arrow: <PhIcon name="arrow-right" /> }}>{"Scaffold in 4 steps {arrow}"}</Translate>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

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
      desc: translate({ id: "homepage.howItWorks.step2.desc", message: "Your bundle exports mount(container, runtime?). The host calls it when the user opens the mini app.", description: "How it works step 2 desc" }),
      code: "export function mount(container, runtime?) { … }",
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
    <section style={{ padding: "64px 0 16px" }}>
      <div className="container">
        <div style={{ maxWidth: 640, marginBottom: 28 }}>
          <div
            style={{
              fontSize: "0.74rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text-secondary)",
              marginBottom: 10,
            }}
          >
            <Translate id="homepage.howItWorks.kicker" description="How it works kicker">How it works</Translate>
          </div>
          <Heading as="h2" style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 10px", letterSpacing: "-0.015em" }}>
            <Translate id="homepage.howItWorks.title" description="How it works title">Three steps to a shippable mini app</Translate>
          </Heading>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.98rem", lineHeight: 1.65, margin: 0 }}>
            <Translate id="homepage.howItWorks.description" description="How it works description">The pattern mirrors</Translate>{" "}
            <code style={{ fontSize: "0.85em" }}>reference-app/</code> <Translate id="homepage.howItWorks.description2" description="How it works description 2">in the</Translate>{" "}
            <a href="https://github.com/anomalyco/sewa-platform" style={{ color: "var(--color-text-link)", fontWeight: 600 }}>
              sewa-platform repo
            </a>
            <Translate id="homepage.howItWorks.description3" description="How it works description 3">. You keep your stack — the host handles auth, permissions, and device access.</Translate>
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginTop: 24 }}>
          {steps.map((s) => (
            <Link
              key={s.n}
              to={s.href}
              className="portal-card"
              style={{ padding: "28px 22px", textDecoration: "none", position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "var(--landing-step-color)", borderRadius: "4px 0 0 4px" }} />
              <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--landing-step-color)", letterSpacing: "0.04em", marginBottom: 8 }}>
                STEP {s.n}
              </div>
              <div style={{ fontWeight: 700, fontSize: "1.08rem", marginBottom: 10, color: "var(--color-text-primary)" }}>{s.title}</div>
              <div style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</div>
              <code
                style={{
                  fontSize: "0.8rem",
                  background: "var(--color-surface-sunken)",
                  border: "1px solid var(--color-border-decorative)",
                  padding: "8px 10px",
                  borderRadius: 10,
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "var(--color-text-primary)",
                  fontWeight: 500,
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

function CapabilityTeaser() {
  const caps: { title: string; href: string; desc: string; icon: string; descId: string; methods: string[] }[] = [
    { title: "sdk.auth", href: "/docs/sdk/auth", desc: "getUser · isAuthenticated · logout — citizen identity", icon: "lock-key", descId: "homepage.capability.auth.desc", methods: ["getUser()", "isAuthenticated()", "logout()"] },
    { title: "sdk.device", href: "/docs/sdk/device", desc: "location · camera · gallery · files · biometric", icon: "device-mobile", descId: "homepage.capability.device.desc", methods: ["location()", "camera()", "gallery()"] },
    { title: "sdk.http", href: "/docs/sdk/http", desc: "get/post/put/patch/delete + streaming proxy", icon: "globe", descId: "homepage.capability.http.desc", methods: ["post()", "stream()", "getStream()"] },
    { title: "sdk.storage", href: "/docs/sdk/storage", desc: "scoped key-value & JSON helpers per mini app", icon: "database", descId: "homepage.capability.storage.desc", methods: ["setJson()", "getMany()", "scoped()"] },
    { title: "sdk.appearance", href: "/docs/sdk/appearance", desc: "getLocale · getTheme · theme/locale subscriptions", icon: "palette", descId: "homepage.capability.appearance.desc", methods: ["getTheme()", "getLocale()", "subscribe()"] },
    { title: "sdk.gicChat", href: "/docs/sdk/gic-chat", desc: "startSession · streamText — AI chat gateway", icon: "sparkle", descId: "homepage.capability.gicChat.desc", methods: ["startSession()", "streamText()"] },
  ];
  const others: { label: string; href: string }[] = [
    { label: "permissions", href: "/docs/sdk/permissions" },
    { label: "flags", href: "/docs/sdk/flags" },
    { label: "navigation", href: "/docs/sdk/navigation" },
    { label: "notifications", href: "/docs/sdk/notifications" },
    { label: "links", href: "/docs/sdk/links" },
    { label: "config", href: "/docs/sdk/config" },
  ];
  return (
    <section style={{ padding: "48px 0 24px" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 6 }}>
              <Translate id="homepage.capability.kicker" description="Capability kicker">Capability catalog</Translate>
            </div>
            <Heading as="h2" style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, letterSpacing: "-0.015em" }}>
              <Translate id="homepage.capability.title" description="Capability title">What you can build with</Translate>
            </Heading>
          </div>
          <Link to="/docs/sdk/core" style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-text-link)", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Translate id="homepage.capability.cta" description="Capability CTA" values={{ arrow: <PhIcon name="arrow-right" /> }}>{"Full SDK reference {arrow}"}</Translate>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: 16 }}>
          {caps.map((c) => (
            <Link key={c.title} to={c.href} className="portal-card" style={{ padding: "22px 20px", textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span className="landing-feature-icon" aria-hidden style={{ width: 44, height: 44, fontSize: "1.35rem", borderRadius: 12 }}><PhIcon name={c.icon} /></span>
                <code style={{ fontSize: "1rem", fontWeight: 800, color: "var(--color-text-primary)" }}>{c.title}</code>
                <span className="cap-arrow" aria-hidden style={{ marginLeft: "auto", color: "var(--landing-step-color)", fontSize: "1rem", display: "inline-flex" }}><PhIcon name="arrow-right" /></span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {c.methods.map((m) => (
                  <code
                    key={m}
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      background: "var(--color-surface-sunken)",
                      border: "1px solid var(--color-border-decorative)",
                      padding: "3px 9px",
                      borderRadius: 9999,
                      color: "var(--color-text-secondary)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m}
                  </code>
                ))}
              </div>
              <span style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", lineHeight: 1.55 }}>{translate({ id: c.descId, message: c.desc, description: `Capability ${c.title} description` })}</span>
            </Link>
          ))}
        </div>

        <div
          style={{
            marginTop: 22,
            padding: "14px 20px",
            borderRadius: 14,
            background: "var(--color-surface-sunken)",
            border: "1px solid var(--color-border-decorative)",
            fontSize: "0.88rem",
            color: "var(--color-text-secondary)",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}><Translate id="homepage.capability.alsoAvailable" description="Capability also">Also available:</Translate></span>
          {others.map((o) => (
            <Link
              key={o.label}
              to={o.href}
              style={{
                fontWeight: 600,
                fontSize: "0.82rem",
                color: "var(--color-text-link)",
                background: "var(--color-surface-card)",
                border: "1px solid var(--color-border-decorative)",
                padding: "4px 12px",
                borderRadius: 9999,
                textDecoration: "none",
              }}
            >
              {o.label}
            </Link>
          ))}
          <span style={{ marginLeft: "auto" }}>
            <Link to="/docs/sdk/core" style={{ fontWeight: 700, color: "var(--color-text-link)", display: "inline-flex", alignItems: "center", gap: 6 }}><Translate id="homepage.capability.browseAll" description="Capability browse" values={{ arrow: <PhIcon name="arrow-right" /> }}>{"Browse all 14 namespaces {arrow}"}</Translate></Link>
          </span>
        </div>
      </div>
    </section>
  );
}

function IntegrationGrid() {
  const cards: { title: string; to: string; desc: string; descId: string; cta: string; ctaId: string }[] = [
    {
      title: "React",
      to: "/docs/integration/react",
      desc: "Reference implementation. Hooks + Provider wrap window.__GSA_SDK__ with full typings.",
      descId: "homepage.integrations.react.desc",
      cta: "View React guide",
      ctaId: "homepage.integrations.react.cta",
    },
    {
      title: "Vue.js",
      to: "/docs/integration/vue",
      desc: "Composition API adapter for Vue 3. Tracks the same mount() lifecycle.",
      descId: "homepage.integrations.vue.desc",
      cta: "View Vue guide",
      ctaId: "homepage.integrations.vue.cta",
    },
    {
      title: "Angular (NG)",
      to: "/docs/integration/angular",
      desc: "Standalone components & injectable SDK service — aligned with Angular 17+ patterns.",
      descId: "homepage.integrations.angular.desc",
      cta: "View Angular guide",
      ctaId: "homepage.integrations.angular.cta",
    },
    {
      title: "SDK Playground",
      to: "/docs/playground",
      desc: "Try every sdk.* method against a mock transport. No local setup — runs inside the docs site.",
      descId: "homepage.integrations.playground.desc",
      cta: "Open playground",
      ctaId: "homepage.integrations.playground.cta",
    },
    {
      title: "Host Playground",
      to: "/docs/host-playground",
      desc: "Test your mini app. Get the manifest & frontend URL and select your required SDK version.",
      descId: "homepage.integrations.hostPlayground.desc",
      cta: "Open playground",
      ctaId: "homepage.integrations.hostPlayground.cta",
    },
  ];
  return (
    <section style={{ padding: "44px 0 32px" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 6 }}>
              <Translate id="homepage.integrations.kicker" description="Integrations kicker">Choose your stack</Translate>
            </div>
            <Heading as="h2" style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, letterSpacing: "-0.015em" }}>
              <Translate id="homepage.integrations.title" description="Integrations title">Framework guides & tools</Translate>
            </Heading>
          </div>
          <Link to="/docs/overview" style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-text-link)", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Translate id="homepage.integrations.cta" description="Integrations CTA" values={{ arrow: <PhIcon name="arrow-right" /> }}>{"Platform overview {arrow}"}</Translate>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {cards.map((card) => (
            <Link key={card.title} to={card.to} className="portal-card" style={{ padding: "24px 22px", textDecoration: "none" }}>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--color-text-primary)", marginBottom: 10, display: "block" }}>{card.title}</span>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: "0 0 16px", flex: 1 }}>{translate({ id: card.descId, message: card.desc, description: `${card.title} description` })}</p>
              <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--color-text-link)", display: "inline-flex", alignItems: "center", gap: 6 }}>{translate({ id: card.ctaId, message: card.cta, description: `${card.title} CTA` })}<PhIcon name="arrow-right" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlaygroundTeaser() {
  return (
    <section style={{ padding: "36px 0 48px" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 24,
            alignItems: "center",
            border: "1px solid var(--color-border-decorative)",
            borderRadius: "20px",
            background: "var(--color-surface-card)",
            padding: "28px 24px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          }}
          className={styles.teaserGrid}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.74rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--color-text-secondary)",
                marginBottom: 10,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              <Translate id="homepage.playground.kicker" description="Playground kicker">Live SDK Playground</Translate>
            </div>
            <Heading as="h3" style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 10px", letterSpacing: "-0.01em" }}>
              <Translate id="homepage.playground.title" description="Playground title">Try the SDK before you ship</Translate>
            </Heading>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.94rem", lineHeight: 1.65, margin: "0 0 20px" }}>
              <Translate id="homepage.playground.description" description="Playground description">Call any sdk.* method with a mock transport, inspect request/response shapes, and copy the snippet into your mini app. Built from the SDK playground package — no extra install.</Translate>
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to="/docs/playground" className="button button--primary" style={{ fontWeight: 700, borderRadius: 12, padding: "10px 20px", background: "var(--color-action-primary)", color: "var(--color-action-primary-foreground)", border: "1px solid var(--color-border-default)" }}>
                <Translate id="homepage.playground.cta.open" description="Playground CTA">Open playground</Translate>
              </Link>
              <Link
                to="/docs/sdk/core"
                className="button button--secondary"
                style={{
                  fontWeight: 600,
                  borderRadius: 12,
                  padding: "10px 20px",
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
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 14px",
                borderBottom: "1px solid var(--color-border-decorative)",
                fontSize: "0.8rem",
                color: "var(--color-text-secondary)",
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c940" }} />
              <span style={{ marginLeft: 8, fontFamily: "monospace" }}>playground · sdk.auth.getUser()</span>
            </div>
            <div style={{ padding: "16px", fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.6 }}>
              <div style={{ color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 6 }}><PhIcon name="caret-right" /> sdk.auth.getUser()</div>
              <div style={{ color: "var(--color-text-secondary)", marginTop: 8, background: "var(--color-surface-card)", border: "1px solid var(--color-border-decorative)", borderRadius: 10, padding: "10px 12px" }}>
                {"{"} <span style={{ color: "var(--landing-code-string)" }}>"id": "citizen_12"</span>, <span style={{ color: "var(--landing-code-string)" }}>"name": "Demo User"</span> {"}"}
              </div>
              <div style={{ color: "var(--color-text-secondary)", marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}><PhIcon name="caret-right" /> sdk.device.location()</div>
              <div style={{ color: "var(--color-text-secondary)", marginTop: 4, fontStyle: "italic" }}>{"{ status: \"granted\", data: { latitude, longitude } }"}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section
      style={{
        padding: "48px 0 56px",
        background: "var(--color-surface-masthead)",
        borderTop: "1px solid var(--color-border-decorative)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,199,0,0.04) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <Heading as="h2" style={{ color: "#fff", fontSize: "1.75rem", fontWeight: 800, marginBottom: 12, letterSpacing: "-0.015em" }}>
          <Translate id="homepage.final.title" description="Final CTA title">Ready to build for Sewa?</Translate>
        </Heading>
        <p style={{ color: "#9aa0b0", maxWidth: 580, margin: "0 auto 28px", fontSize: "0.98rem", lineHeight: 1.65 }}>
          <Translate id="homepage.final.subtitle" description="Final CTA subtitle">Scaffold from the reference implementation, read the platform overview, or dive straight into the API reference.</Translate>
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/docs/getting-started" className="button button--primary button--lg landing-cta-primary" style={{ borderRadius: 12, padding: "12px 28px", boxShadow: "0 4px 14px rgba(255,199,0,0.2)" }}>
            <Translate id="homepage.final.cta.getStarted" description="Final CTA">Get started</Translate>
          </Link>
          <Link
            to="/docs/overview"
            className="button button--secondary button--lg"
            style={{
              borderRadius: 12,
              padding: "12px 28px",
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
              borderRadius: 12,
              padding: "12px 28px",
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