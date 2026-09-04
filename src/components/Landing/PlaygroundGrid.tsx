import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import { PhIcon } from "../PhIcon";
import Heading from "@theme/Heading";


export function PlaygroundGrid() {
    const cards: { title: string; to: string; desc: string; descId: string; cta: string; ctaId: string }[] = [
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

    return (
        <section className="py-11 pb-8">
            <div className="container">
                <div className="mb-4.5 flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                        <div className="mb-1.5 text-[0.74rem] font-bold uppercase tracking-[0.08em] text-text-secondary">
                            <Translate id="homepage.integrations.playground" description="Integrations kicker">
                                Check SDK or Test Mini App
                            </Translate>
                        </div>
                        <Heading as="h2" className="m-0 text-[1.4rem] font-extrabold tracking-[-0.015em]">
                            <Translate id="homepage.playground.title" description="Playground title">
                                Playgrounds
                            </Translate>
                        </Heading>
                    </div>
                    <Link
                        to="/docs/playground"
                        className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-text-link"
                    >
                        <Translate
                            id="homepage.playground.cta"
                            description="Playground integration"
                            values={{ arrow: <PhIcon name="arrow-right" /> }}
                        >
                            {"Playground overview {arrow}"}
                        </Translate>
                    </Link>
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
                    {cards.map((card) => (
                        <Link
                            key={card.title}
                            to={card.to}
                            className="portal-card flex flex-col p-[24px_22px] no-underline"
                        >
                            <span className="mb-2.5 block text-[1.1rem] font-extrabold text-text-primary">
                                {card.title}
                            </span>
                            <p className="mb-4 flex-1 text-[0.9rem] leading-relaxed text-text-secondary">
                                {translate({ id: card.descId, message: card.desc, description: `${card.title} description` })}
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-[0.88rem] font-bold text-text-link">
                                {translate({ id: card.ctaId, message: card.cta, description: `${card.title} CTA` })}
                                <PhIcon name="arrow-right" />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}