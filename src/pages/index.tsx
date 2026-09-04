import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import { CapabilityTeaser } from "../components/Landing/CapabilityTeaser";
import { FinalCTA } from "../components/Landing/FinalCTA";
import { Hero } from "../components/Landing/Hero";
import { HowItWorks } from "../components/Landing/HowItWorks";
import { IntegrationGrid } from "../components/Landing/IntegrationGrid";
import { PlaygroundTeaser } from "../components/Landing/PlaygroundTeaser";

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
