import type { ReactNode } from "react";
import React from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import styles from "./index.module.css";
import { SDKExplorer } from "../components/SDKExplorer";
import { FrameworkBadge } from "../components/FrameworkBadge";

function Hero() {
  return (
    <header
      className={styles.heroBanner}
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #1a2744 100%)",
        borderBottom: "1px solid #2a2a2a",
        padding: "56px 0 48px",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "center",
          }}
          className={styles.heroGrid}
        >
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
                marginBottom: "20px",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffc700", display: "inline-block" }} />
              Sewa Developer Portal
            </div>
            <Heading as="h1" style={{ fontSize: "2.6rem", fontWeight: 800, lineHeight: 1.1, color: "#fff", marginBottom: "12px" }}>
              Build mini apps
              <br />
              <span style={{ color: "#ffc700" }}>for the Sewa platform.</span>
            </Heading>
            <p style={{ color: "#a0a0a0", fontSize: "1rem", lineHeight: 1.6, marginBottom: "24px", maxWidth: "480px" }}>
              Host-injected SDK via <code style={{ color: "#ffd740", background: "rgba(255,199,0,0.12)", padding: "1px 6px", borderRadius: 4 }}>window.__GSA_SDK__</code>.
              Types from <code style={{ color: "#e0e0e0" }}>@lizuz/mini-app-types</code>. Build as an ES library — the host does the rest.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                className="button button--primary button--lg"
                to="/docs/getting-started"
                style={{
                  background: "#ffc700",
                  color: "#111",
                  border: "none",
                  fontWeight: 700,
                  padding: "10px 22px",
                }}
              >
                Get started
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="/docs/sdk/core"
                style={{
                  fontWeight: 600,
                  padding: "10px 22px",
                  background: "transparent",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                API reference
              </Link>
            </div>
            <div style={{ display: "flex", gap: "16px", marginTop: "20px", fontSize: "0.82rem", color: "#666" }}>
              <span>14 capability namespaces</span>
              <span>·</span>
              <span>5 transport types</span>
              <span>·</span>
              <span>React / Vue / Angular</span>
            </div>
          </div>

          <div
            style={{
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 16px",
                borderBottom: "1px solid #222",
                fontSize: "0.78rem",
                color: "#888",
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e", display: "inline-block" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c940", display: "inline-block" }} />
              <span style={{ marginLeft: "8px", fontFamily: "monospace" }}>test-mini-app/src/hooks/usePlatformSDK.ts</span>
            </div>
            <pre
              style={{
                margin: 0,
                padding: "16px",
                fontSize: "0.82rem",
                lineHeight: 1.6,
                color: "#e0e0e0",
                overflow: "auto",
              }}
            >
              <code>{`import { usePlatformSDK } from "./hooks/usePlatformSDK";

function Profile() {
  const { sdk, user } = usePlatformSDK();
  const { theme } = useAppearance();

  const locate = async () => {
    const res = await sdk.device.location();
    if (res.status === "granted") {
      console.log(res.data.latitude, res.data.longitude);
    }
  };

  return <button onClick={locate}>Locate me</button>;
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </header>
  );
}

function CapabilityGrid() {
  const groups: { label: string; items: { href: string; title: string; desc: string }[] }[] = [
    {
      label: "Core",
      items: [
        { href: "/docs/sdk/auth", title: "auth", desc: "getUser · isAuthenticated · logout" },
        { href: "/docs/sdk/permissions", title: "permissions", desc: "has · list" },
        { href: "/docs/sdk/flags", title: "flags", desc: "isEnabled · getAll" },
        { href: "/docs/sdk/config", title: "config", desc: "get · getAll" },
        { href: "/docs/sdk/platform", title: "platform", desc: "type · isWeb · isFlutter" },
        { href: "/docs/sdk/appearance", title: "appearance", desc: "getLocale · getTheme · subscribe" },
        { href: "/docs/sdk/navigation", title: "navigation", desc: "navigate · router.back/push" },
        { href: "/docs/sdk/storage", title: "storage", desc: "get/set · getJson · scoped" },
      ],
    },
    {
      label: "Network & AI",
      items: [
        { href: "/docs/sdk/http", title: "http", desc: "get/post/put/patch/delete · stream" },
        { href: "/docs/sdk/gic-chat", title: "gicChat", desc: "startSession · stream · streamText" },
        { href: "/docs/sdk/api", title: "api", desc: "request — gateway proxy" },
      ],
    },
    {
      label: "Device & System",
      items: [
        { href: "/docs/sdk/device", title: "device", desc: "location · camera · gallery · files · biometric" },
        { href: "/docs/sdk/notifications", title: "notifications", desc: "register · onToken · onOpen" },
        { href: "/docs/sdk/links", title: "links", desc: "open · onOpen" },
      ],
    },
  ];

  return (
    <section style={{ padding: "48px 0 32px" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
          <Heading as="h2" style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            Capability namespaces
          </Heading>
          <Link to="/docs/sdk/core" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--blue-700)" }}>
            Full API reference →
          </Link>
        </div>
        {groups.map((group) => (
          <div key={group.label} style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--color-text-tertiary)",
                marginBottom: "8px",
              }}
            >
              {group.label}
            </div>
            <div className="card-grid" style={{ margin: 0 }}>
              {group.items.map((item) => (
                <Link key={item.title} to={item.href} className="portal-card" style={{ padding: "16px 18px" }}>
                  <code style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "4px" }}>sdk.{item.title}</code>
                  <span style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>{item.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div
          style={{
            marginTop: "16px",
            padding: "14px 18px",
            borderRadius: "var(--radius-lg, 12px)",
            background: "var(--color-surface-sunken)",
            border: "1px solid var(--color-border-decorative)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            fontSize: "0.82rem",
          }}
        >
          <Link to="/docs/sdk/protocol" style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>Protocol & handshake</Link>
          <Link to="/docs/sdk/transport" style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>Transport</Link>
          <Link to="/docs/sdk/rpc" style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>RPC · retry · dedup</Link>
          <Link to="/docs/sdk/events" style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>Events & bus</Link>
          <Link to="/docs/sdk/errors" style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>Errors</Link>
          <Link to="/docs/sdk/stream" style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>StreamBuilder</Link>
          <Link to="/docs/sdk/reliability" style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>Reliability</Link>
          <Link to="/docs/sdk/observability" style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>Observability</Link>
        </div>
      </div>
    </section>
  );
}

function FrameworkStrip() {
  return (
    <section style={{ padding: "24px 0 32px", borderTop: "1px solid var(--color-border-decorative)" }}>
      <div className="container">
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>
            Framework:
          </span>
          <Link to="/docs/integration/react" style={{ display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}>
            <FrameworkBadge framework="react" status="active" />
          </Link>
          <Link to="/docs/integration/vue" style={{ display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}>
            <FrameworkBadge framework="vue" status="upcoming" />
          </Link>
          <Link to="/docs/integration/angular" style={{ display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}>
            <FrameworkBadge framework="angular" status="upcoming" />
          </Link>
          <span style={{ fontSize: "0.82rem", color: "var(--color-text-tertiary)", marginLeft: "auto" }}>
            Reference: <code>test-mini-app/</code> · Vite lib · <code>mount(container, runtime)</code>
          </span>
        </div>
      </div>
    </section>
  );
}

function PlaygroundSection() {
  return (
    <section style={{ padding: "32px 0 48px", background: "var(--color-surface-sunken)" }}>
      <div className="container">
        <Heading as="h2" style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "4px" }}>
          SDK Playground
        </Heading>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginBottom: "16px" }}>
          Try any method below. The explorer is a doc widget from <code>packages/sdk-playground</code> — not a separate install.
        </p>
        <SDKExplorer />
        <div style={{ textAlign: "center", marginTop: "14px" }}>
          <Link to="/docs/playground" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--blue-700)" }}>
            Full playground page →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Sewa Developer Portal"
      description="Build mini apps for the Sewa government platform."
    >
      <Hero />
      <main>
        <CapabilityGrid />
        <FrameworkStrip />
        <PlaygroundSection />
      </main>
    </Layout>
  );
}
