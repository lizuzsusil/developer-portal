import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import Heading from "@theme/Heading";
import { PhIcon } from "../PhIcon";

export function PlaygroundTeaser() {
  return (
    <section className="pt-9 pb-12">
      <div className="container">
        <div
          className="grid grid-cols-[1.05fr_0.95fr] items-center gap-6 max-[900px]:grid-cols-1 rounded-[20px] border border-border-decorative bg-surface-card px-6 py-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
        >
          <div>
            <Heading as="h3" className="m-0 mb-2.5 text-[1.3rem] font-extrabold tracking-[-0.01em]">
              <Translate id="homepage.playground.title" description="Playground title">Try the SDK before you ship</Translate>
            </Heading>
            <p className="m-0 mb-5 text-[0.94rem] leading-[1.65] text-text-secondary">
              <Translate id="homepage.playground.description" description="Playground description">Call any sdk.* method with a mock transport, inspect request/response shapes, and copy the snippet into your mini app. Built from the SDK playground package — no extra install.</Translate>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/docs/playground" className="inline-block cursor-pointer rounded-[12px] border border-border-default bg-action-primary px-5 py-2.5 text-center text-[0.875rem] font-bold text-action-primary-foreground no-underline">
                <Translate id="homepage.playground.cta.open" description="Playground CTA">Open playground</Translate>
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[14px] border border-border-decorative bg-surface-sunken">
            <div className="flex items-center gap-1.5 border-b border-border-decorative px-3.5 py-2.5 text-[0.8rem] text-text-secondary">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c940]" />
              <span className="ml-2 font-mono">Playground</span>
            </div>
            <div className="p-4 font-mono text-[0.8rem] leading-[1.6]">
              <div className="flex items-center gap-1.5 text-text-secondary"><PhIcon name="caret-right" /> sdk.auth.getUser()</div>
              <div className="mt-2 rounded-[10px] border border-border-decorative bg-surface-card px-3 py-2.5 text-text-secondary">
                {"{"} <span className="text-(--landing-code-string)">"id": "citizen_12"</span>, <span className="text-(--landing-code-string)">"name": "Demo User"</span> {"}"}
              </div>
              <div className="mt-2.5 flex items-center gap-1.5 text-text-secondary"><PhIcon name="caret-right" /> sdk.device.location()</div>
                <div className="mt-2 rounded-[10px] border border-border-decorative bg-surface-card px-3 py-2.5 text-text-secondary">
                    {"{"} <span className="text-(--landing-code-string)">"status": "granted"</span>, <span className="text-(--landing-code-string)">"data": {"{ "}latitude, longitude{" }"}</span> {"}"}
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
