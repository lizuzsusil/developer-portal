import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

// Canonical source is `packages/host-playground/src` — the very same shell the
// standalone Vite app renders. Loaded browser-only: the playground reads
// `localStorage` for the last config, installs a `message` listener for the SDK
// handshake and mounts vendor bundles into a Shadow DOM, none of which exist
// during the static build.
export function HostExplorer(): React.ReactElement {
  return (
    <BrowserOnly
      fallback={<div className="hp-embed"><div className="hp-embed__fallback">Loading the host playground…</div></div>}
    >
      {() => {
        const HostPlaygroundEmbed =
          require("../../../packages/host-playground/src/Embed").default as React.ComponentType;
        return <HostPlaygroundEmbed />;
      }}
    </BrowserOnly>
  );
}

export default HostExplorer;
