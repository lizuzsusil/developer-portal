import React from "react";
import { PhIcon } from "../../../src/components/PhIcon";

export function ReactFrameworkShowcase() {
  return (
    <div
      style={{
        border: "1px solid var(--color-border-decorative, #e2e8f0)",
        borderRadius: "var(--radius-lg, 12px)",
        padding: "20px",
        background: "var(--color-surface-card, #fff)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ fontSize: "1.4rem", display: "inline-flex" }}><PhIcon name="atom" /></span>
        <strong>React Adapter</strong>
        <span
          style={{
            fontSize: "0.7rem",
            padding: "2px 8px",
            borderRadius: "9999px",
            background: "var(--green-100, #e0f2ec)",
            color: "var(--green-700, #086b53)",
            border: "1px solid var(--green-300, #5dc896)",
            fontWeight: 700,
          }}
        >
          Active
        </span>
        <code style={{ fontSize: "0.7rem", marginLeft: "auto" }}>packages/framework-react</code>
      </div>
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", margin: "0 0 12px" }}>
        <code>PlatformSDKProvider</code> + hooks (<code>useMiniAppSdk</code>, <code>useAuth</code>,{" "}
        <code>useAppearance</code>) with React Router integration.
      </p>
      <pre
        style={{
          margin: 0,
          padding: "12px",
          borderRadius: "var(--radius-md, 8px)",
          background: "var(--neutral-900, #111)",
          color: "var(--gold-300, #ffd740)",
          fontSize: "0.78rem",
          overflowX: "auto",
        }}
      >
        <code>{`// test-mini-app/src/providers/PlatformSDKProvider.tsx
import { SDKContext } from "../context/SDKContext";
import { retry } from "../utils/retry";

function getSDK(): MiniAppSdk {
  return window.__GSA_SDK__ ?? createStandaloneMockSDK();
}`}</code>
      </pre>
    </div>
  );
}
