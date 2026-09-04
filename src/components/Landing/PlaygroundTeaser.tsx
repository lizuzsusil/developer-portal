import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import Heading from "@theme/Heading";
import { PhIcon } from "../PhIcon";

export function PlaygroundTeaser() {
  return (
    <section className="pt-9 pb-12">
      <div className="container">
        <div
          className="grid grid-cols-[1.05fr_0.95fr] items-center gap-6 max-[900px]:grid-cols-1 rounded-[20px] border border-[var(--color-border-decorative)] bg-[var(--color-surface-card)] px-6 py-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
        >
          <div>
            <div className="mb-[10px] inline-flex items-center gap-1.5 text-[0.74rem] font-bold uppercase tracking-[0.06em] text-[var(--color-text-secondary)]">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <Translate id="homepage.playground.kicker" description="Playground kicker">Live SDK Playground</Translate>
            </div>
            <Heading as="h3" className="m-0 mb-[10px] text-[1.3rem] font-extrabold tracking-[-0.01em]">
              <Translate id="homepage.playground.title" description="Playground title">Try the SDK before you ship</Translate>
            </Heading>
            <p className="m-0 mb-5 text-[0.94rem] leading-[1.65] text-[var(--color-text-secondary)]">
              <Translate id="homepage.playground.description" description="Playground description">Call any sdk.* method with a mock transport, inspect request/response shapes, and copy the snippet into your mini app. Built from the SDK playground package — no extra install.</Translate>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/docs/playground" className="inline-block cursor-pointer rounded-[12px] border border-[var(--color-border-default)] bg-[var(--color-action-primary)] px-5 py-[10px] text-center text-[0.875rem] font-bold text-[var(--color-action-primary-foreground)] no-underline">
                <Translate id="homepage.playground.cta.open" description="Playground CTA">Open playground</Translate>
              </Link>
              <Link
                to="/docs/sdk/core"
                className="inline-block cursor-pointer rounded-[12px] border border-[var(--color-border-default)] bg-transparent px-5 py-[10px] text-center text-[0.875rem] font-semibold text-[var(--color-text-primary)] no-underline"
              >
                <Translate id="homepage.playground.cta.catalog" description="Playground CTA">View method catalog</Translate>
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[14px] border border-[var(--color-border-decorative)] bg-[var(--color-surface-sunken)]">
            <div className="flex items-center gap-1.5 border-b border-[var(--color-border-decorative)] px-[14px] py-[10px] text-[0.8rem] text-[var(--color-text-secondary)]">
              <span className="h-[10px] w-[10px] rounded-full bg-[#ff5f57]" />
              <span className="h-[10px] w-[10px] rounded-full bg-[#ffbd2e]" />
              <span className="h-[10px] w-[10px] rounded-full bg-[#28c940]" />
              <span className="ml-2 font-mono">playground · sdk.auth.getUser()</span>
            </div>
            <div className="p-4 font-mono text-[0.8rem] leading-[1.6]">
              <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]"><PhIcon name="caret-right" /> sdk.auth.getUser()</div>
              <div className="mt-2 rounded-[10px] border border-[var(--color-border-decorative)] bg-[var(--color-surface-card)] px-3 py-[10px] text-[var(--color-text-secondary)]">
                {"{"} <span className="text-[var(--landing-code-string)]">"id": "citizen_12"</span>, <span className="text-[var(--landing-code-string)]">"name": "Demo User"</span> {"}"}
              </div>
              <div className="mt-[10px] flex items-center gap-1.5 text-[var(--color-text-secondary)]"><PhIcon name="caret-right" /> sdk.device.location()</div>
              <div className="mt-1 text-[var(--color-text-secondary)] italic">{"{ status: \"granted\", data: { latitude, longitude } }"}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
