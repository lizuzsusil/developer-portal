import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import Heading from "@theme/Heading";
import { PhIcon } from "../PhIcon";
import { ArrowLink } from "./ArrowLink";

interface Integration {
  title: string;
  to: string;
  desc: string;
  descId: string;
  cta: string;
  ctaId: string;
}

const INTEGRATIONS: Integration[] = [
  {
    title: "React",
    to: "/docs/integration/react",
    desc: "Reference implementation. Hooks + Provider wrap window.__GSA_SDK__ with full typings.",
    descId: "homepage.integrations.react.desc",
    cta: "View React guide",
    ctaId: "homepage.integrations.react.cta",
  },
  {
    title: "Vue.js",
    to: "/docs/integration/vue",
    desc: "Composition API adapter for Vue 3. Tracks the same mount() lifecycle.",
    descId: "homepage.integrations.vue.desc",
    cta: "View Vue guide",
    ctaId: "homepage.integrations.vue.cta",
  },
  {
    title: "Angular (NG)",
    to: "/docs/integration/angular",
    desc: "Standalone components & injectable SDK service — aligned with Angular 17+ patterns.",
    descId: "homepage.integrations.angular.desc",
    cta: "View Angular guide",
    ctaId: "homepage.integrations.angular.cta",
  },
  {
    title: "SDK Playground",
    to: "/docs/playground",
    desc: "Try every sdk.* method against a mock transport. No local setup — runs inside the docs site.",
    descId: "homepage.integrations.playground.desc",
    cta: "Open playground",
    ctaId: "homepage.integrations.playground.cta",
  },
  {
    title: "Host Playground",
    to: "/docs/host-playground",
    desc: "Test your mini app. Get the manifest & frontend URL and select your required SDK version.",
    descId: "homepage.integrations.hostPlayground.desc",
    cta: "Open playground",
    ctaId: "homepage.integrations.hostPlayground.cta",
  },
];

function IntegrationCard({ card }: { card: Integration }) {
  return (
    <Link key={card.title} to={card.to} className="portal-card p-[24px_22px]! no-underline">
      <span className="mb-[10px] block text-[1.1rem] font-extrabold text-[var(--color-text-primary)]">{card.title}</span>
      <p className="m-0 mb-4 flex-1 text-[0.9rem] leading-[1.6] text-[var(--color-text-secondary)]">{translate({ id: card.descId, message: card.desc, description: `${card.title} description` })}</p>
      <span className="inline-flex items-center gap-1.5 text-[0.88rem] font-bold text-[var(--color-text-link)]">{translate({ id: card.ctaId, message: card.cta, description: `${card.title} CTA` })}<PhIcon name="arrow-right" /></span>
    </Link>
  );
}

export function IntegrationGrid() {
  return (
    <section className="pt-[44px] pb-8">
      <div className="container">
        <div className="mb-[18px] flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="mb-1.5 text-[0.74rem] font-bold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
              <Translate id="homepage.integrations.kicker" description="Integrations kicker">Choose your stack</Translate>
            </div>
            <Heading as="h2" className="m-0 text-[1.4rem] font-extrabold tracking-[-0.015em]">
              <Translate id="homepage.integrations.title" description="Integrations title">Framework guides & tools</Translate>
            </Heading>
          </div>
          <ArrowLink
            to="/docs/overview"
            id="homepage.integrations.cta"
            description="Integrations CTA"
            className="text-[0.9rem] font-semibold text-[var(--color-text-link)]"
          >
            {"Platform overview {arrow}"}
          </ArrowLink>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {INTEGRATIONS.map((card) => (
            <IntegrationCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
