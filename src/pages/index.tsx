import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import { CapabilityTeaser, FinalCTA, HeroFrameworks, HowItWorks, IntegrationGrid, PlaygroundGrid, PlaygroundTeaser } from "../components/Landing";

export default function Home(): ReactNode {
  return (
    <Layout title="Sewa Developer Portal" description="Build mini apps for the Sewa government platform.">
      <div className="border-b border-[var(--color-border-decorative)] bg-[var(--color-surface-sunken)]">
        <HeroFrameworks />
      </div>
      <main>
        <HowItWorks />
        <CapabilityTeaser />
        <IntegrationGrid />
        <PlaygroundGrid />
        <PlaygroundTeaser />
        <FinalCTA />
      </main>
    </Layout>
  );
}
