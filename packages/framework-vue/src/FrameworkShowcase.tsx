import React from "react";

export function VueFrameworkShowcase() {
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
        <span style={{ fontSize: "1.4rem" }}>💚</span>
        <strong>Vue 3 Adapter</strong>
        <span
          style={{
            fontSize: "0.7rem",
            padding: "2px 8px",
            borderRadius: "9999px",
            background: "var(--gold-100, #fff8d6)",
            color: "var(--gold-800, #806300)",
            border: "1px solid var(--gold-300, #ffd740)",
            fontWeight: 700,
          }}
        >
          Upcoming
        </span>
        <code style={{ fontSize: "0.7rem", marginLeft: "auto" }}>packages/framework-vue</code>
      </div>
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", margin: "0 0 12px" }}>
        Composition API <code>provide/inject</code> SDK context with reactive composables.
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
        <code>{`// Preview - not yet implemented
// Planned: provide/inject SDK context + reactive composables
// See docs/integration/vue.mdx for the roadmap pattern`}</code>
      </pre>
    </div>
  );
}
