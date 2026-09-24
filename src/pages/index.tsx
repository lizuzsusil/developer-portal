import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import { HeroFrameworks, IntegrationGrid } from "../components/Landing";

export default function Home(): ReactNode {
  return (
    <Layout title="Sewa Developer Portal" description="Build mini apps for the Sewa government platform.">
      <main>
          <HeroFrameworks />
        <IntegrationGrid />
      </main>
    </Layout>
  );
}
