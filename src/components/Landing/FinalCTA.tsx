import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import Heading from "@theme/Heading";
import { PhIcon } from "../PhIcon";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border-decorative bg-surface-masthead pt-12 pb-14">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-200 w-200 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,199,0,0.04)_0%,transparent_60%)]"
      />
      <div className="container relative z-1 text-center">
        <Heading as="h2" className="mb-3 text-[1.75rem] font-extrabold tracking-[-0.015em] text-white">
          <Translate id="homepage.final.title" description="Final CTA title">Ready to build for Sewa?</Translate>
        </Heading>
        <p className="mx-auto mt-0 mb-7 max-w-145 text-[0.98rem] leading-[1.65] text-[#9aa0b0]">
          <Translate id="homepage.final.subtitle" description="Final CTA subtitle">Scaffold from the reference implementation, read the platform overview, or dive straight into the API reference.</Translate>
        </p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <Link to="/docs/getting-started" className="landing-cta-primary inline-block cursor-pointer rounded-[12px] px-7 py-3 text-center text-[1.18rem] font-bold no-underline shadow-[0_4px_14px_rgba(255,199,0,0.2)]">
            <Translate id="homepage.final.cta.getStarted" description="Final CTA">Get started</Translate>
          </Link>
          <Link
            to="/docs/overview"
            className="inline-block cursor-pointer rounded-[12px] border border-[rgba(255,255,255,0.22)] bg-transparent px-7 py-3 text-center text-[1.18rem] font-semibold text-white no-underline"
          >
            <Translate id="homepage.final.cta.overview" description="Final CTA">Platform overview</Translate>
          </Link>
          <a
            href="https://github.com/anomalyco/sewa-platform"
            target="_blank"
            rel="noreferrer"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-[12px] border border-[rgba(255,255,255,0.16)] bg-transparent px-7 py-3 text-center text-[1.18rem] font-medium text-white no-underline"
          >
            GitHub <PhIcon name="arrow-up-right" />
          </a>
        </div>
      </div>
    </section>
  );
}
