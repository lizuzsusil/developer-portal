import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import { CapabilityTeaser, FinalCTA, Hero, HowItWorks, IntegrationGrid, PlaygroundGrid, PlaygroundTeaser } from "../components/Landing";

export default function Home(): ReactNode {
  return (
    <Layout title="Sewa Developer Portal" description="Build mini apps for the Sewa government platform.">
      <Hero />
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
