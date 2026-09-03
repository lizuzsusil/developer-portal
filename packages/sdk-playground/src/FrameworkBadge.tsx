import React from "react";

export interface FrameworkBadgeProps {
  framework: "react" | "vue" | "angular" | "ng";
  status?: "active" | "upcoming";
}

export function FrameworkBadge({ framework, status }: FrameworkBadgeProps) {
  const fwName =
    framework === "react"
      ? "React"
      : framework === "vue"
      ? "Vue.js"
      : "Angular (NG)";

  // An explicit status always wins; otherwise React defaults to active and
  // every other framework defaults to upcoming.
  const isUpcoming =
    status === "upcoming" || (status !== "active" && framework !== "react");

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "0.8rem",
        fontWeight: 600,
        letterSpacing: "0.02em",
        backgroundColor: isUpcoming
          ? "rgba(245, 158, 11, 0.15)"
          : "rgba(16, 185, 129, 0.15)",
        color: isUpcoming ? "#d97706" : "#059669",
        border: `1px solid ${isUpcoming ? "rgba(245, 158, 11, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
        margin: "4px 0 16px 0",
      }}
    >
      <span
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          backgroundColor: isUpcoming ? "#f59e0b" : "#10b981",
        }}
      />
      <span>{fwName}</span>
      <span
        style={{
          fontSize: "0.7rem",
          textTransform: "uppercase",
          opacity: 0.85,
          fontWeight: 700,
        }}
      >
        [{isUpcoming ? "Upcoming / Roadmap" : "Active / Production Ready"}]
      </span>
    </div>
  );
}
