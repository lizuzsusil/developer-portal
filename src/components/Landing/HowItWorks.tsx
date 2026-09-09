import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import Heading from "@theme/Heading";
import { useTypesPackage } from "../TypesPackage";

interface Step {
  n: string;
  title: string;
  desc: string;
  href: string;
}

function StepCard({ step }: { step: Step }) {
  return (
    <Link
      key={step.n}
      to={step.href}
      className="portal-card relative overflow-hidden p-[28px_22px]! no-underline"
    >
      <div aria-hidden className="absolute top-0 left-0 h-full w-1 rounded-l bg-(--landing-step-color)" />
      <div className="mb-2 text-[0.78rem] font-extrabold tracking-[0.04em] text-(--landing-step-color)">
        STEP {step.n}
      </div>
      <div className="mb-2.5 text-[1.08rem] font-bold text-text-primary">{step.title}</div>
      <div className="mb-4 text-[0.9rem] leading-[1.6] text-text-secondary">{step.desc}</div>
    </Link>
  );
}

export function HowItWorks() {
  const typesPackage = useTypesPackage();
  const steps: Step[] = [
    {
      n: "01",
      title: translate({ id: "homepage.howItWorks.step1.title", message: "Install types", description: "How it works step 1 title" }),
      desc: translate({ id: "homepage.howItWorks.step1.desc", message: "Add {package} as a devDependency for full sdk.* typings.", description: "How it works step 1 desc" }, { package: typesPackage }),
      href: "/docs/getting-started",
    },
    {
      n: "02",
      title: translate({ id: "homepage.howItWorks.step2.title", message: "Export mount()", description: "How it works step 2 title" }),
      desc: translate({ id: "homepage.howItWorks.step2.desc", message: "Your bundle exports mount(container, runtime?). The host calls it when the user opens the mini app.", description: "How it works step 2 desc" }),
      href: "/docs/getting-started",
    },
    {
      n: "03",
      title: translate({ id: "homepage.howItWorks.step3.title", message: "Build as ES lib", description: "How it works step 3 title" }),
      desc: translate({ id: "homepage.howItWorks.step3.desc", message: "Vite lib mode outputs a single ES module the shell loads on demand. No SDK bundling.", description: "How it works step 3 desc" }),
      href: "/docs/getting-started",
    },
  ];
  return (
    <section className="pt-16 pb-4">
      <div className="container">
        <div className="mb-7 max-w-160">
          <div className="mb-2.5 text-[0.74rem] font-bold uppercase tracking-[0.08em] text-text-secondary">
            <Translate id="homepage.howItWorks.kicker" description="How it works kicker">How it works</Translate>
          </div>
          <Heading as="h2" className="m-0 mb-2.5 text-[1.75rem] font-extrabold tracking-[-0.015em]">
            <Translate id="homepage.howItWorks.title" description="How it works title">Three steps to a shippable mini app</Translate>
          </Heading>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((s) => (
            <StepCard key={s.n} step={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
