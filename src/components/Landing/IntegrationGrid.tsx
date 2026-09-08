import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import Heading from "@theme/Heading";
import { Angular, React, SolidJS, SvelteJS, VueJs } from "developer-icons";
import { ComponentType } from "react";
import { PhIcon } from "../PhIcon";

type IntegrationCard = {
  title: string;
  to: string;
  ctaId: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

export function IntegrationGrid() {
  const cards: IntegrationCard[] = [
    {
      title: "React",
      to: "/docs/integration/react",
      ctaId: "homepage.integrations.react.cta",
      icon: React,
    },
    {
      title: "Vue 3",
      to: "/docs/integration/vue",
      ctaId: "homepage.integrations.vue.cta",
      icon: VueJs,
    },
    {
      title: "Angular",
      to: "/docs/integration/angular",
      ctaId: "homepage.integrations.angular.cta",
      icon: Angular,
    },
    {
      title: "Svelte",
      to: "/docs/integration/svelte",
      ctaId: "homepage.integrations.angular.cta",
      icon: SvelteJS,
    },
    {  
      title: "Solid",
      to: "/docs/integration/solid",
      ctaId: "homepage.integrations.angular.cta",
      icon: SolidJS,
    },
  ];

  return (
    <section className="py-11 pb-8">
      <div className="container">
        <div className="mb-4.5 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="mb-1.5 text-[0.74rem] font-bold uppercase tracking-[0.08em] text-text-secondary">
              <Translate id="homepage.integrations.kicker" description="Integrations kicker">
                Choose your stack
              </Translate>
            </div>
            <Heading as="h2" className="m-0 text-[1.4rem] font-extrabold tracking-[-0.015em]">
              <Translate id="homepage.integrations.title" description="Integrations title">
                Framework guides & tools
              </Translate>
            </Heading>
          </div>

          <Link
            to="/docs/overview"
            className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-text-link transition-colors hover:opacity-80"
          >
            <Translate
              id="homepage.integrations.cta"
              description="Integrations CTA"
              values={{ arrow: <PhIcon name="arrow-right" /> }}
            >
              {"Platform overview {arrow}"}
            </Translate>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {cards.map((card) => {
            const IconComponent = card.icon;

            return (
              <Link
                key={card.title}
                to={card.to}
                className="group flex flex-col justify-between rounded-xl border border-(--ifm-color-emphasis-200) bg-(--ifm-card-background-color,#fff) p-5 no-underline transition-all hover:-translate-y-0.5 hover:border-text-link hover:shadow-md"
              >
                <div className="flex items-center justify-center gap-3.5">
                  <div className="flex flex-col gap-3 shrink-0 items-center transition-colors">
                    <div className="size-10">
                      <IconComponent size={30} className="size-full"/>
                    </div>
                    <span className="text-base font-extrabold text-white">
                      {card.title}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}