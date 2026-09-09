import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import { CapabilityTeaser, FinalCTA, HeroFrameworks, HowItWorks, IntegrationGrid, PlaygroundGrid } from "../components/Landing";

export default function Home(): ReactNode {
  return (
    <Layout title="Sewa Developer Portal" description="Build mini apps for the Sewa government platform.">
      <main>
          <div className="border-b border-border-decorative bg-surface-sunken">
              <HeroFrameworks />
          </div>
        <HowItWorks />
        <CapabilityTeaser />
        <IntegrationGrid />
        <PlaygroundGrid />
        <FinalCTA />
      </main>
    </Layout>
  );
}
