import Heading from "@theme/Heading";
import Translate from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import { PhIcon } from "../PhIcon";
import { useTypesPackage } from "../TypesPackage";
import { ArrowLink } from "./ArrowLink";

function HeroKicker() {
  return (
    <div className="mb-[22px] inline-flex items-center gap-2 rounded-full border border-[var(--hero-kicker-border)] bg-[var(--hero-kicker-bg)] px-[14px] py-[5px] text-[0.82rem] font-semibold text-[var(--hero-kicker-text)] backdrop-blur-sm">
      <span className="inline-block h-[7px] w-[7px] animate-pulse-dot rounded-full bg-[var(--hero-kicker-dot)]" />
      <Translate id="homepage.hero.kicker" description="Hero kicker">Sewa Developer Portal · Government of Sri Lanka</Translate>
    </div>
  );
}

function HeroCopy() {
  const typesPackage = useTypesPackage();
  return (
    <div>
      <HeroKicker />

      <Heading
        as="h1"
        className="mb-[18px] text-[clamp(2.2rem,4.5vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-[var(--hero-text)]"
      >
        <Translate id="homepage.hero.title.line1" description="Hero title line 1">Build mini apps</Translate>
        <br />
        <span className="text-[var(--hero-text-accent)]"><Translate id="homepage.hero.title.line2" description="Hero title line 2">for the Sewa platform.</Translate></span>
      </Heading>

      <p className="mb-7 max-w-[540px] text-[1.1rem] leading-[1.65] text-[var(--hero-subtext)]">
        <Translate id="homepage.hero.subtitle" description="Hero subtitle">Ship lightweight ES modules that run inside the Sewa Citizen shell. The host injects the SDK at runtime — you just declare types and export</Translate>{" "}
        <code className="rounded-md bg-[var(--hero-inline-code-bg)] px-2 py-[2px] text-[0.9em] font-semibold text-[var(--hero-inline-code-text)]">mount(container, runtime?)</code>.
      </p>

      <div className="flex flex-wrap gap-[14px]">
        <Link
          to="/docs/getting-started"
          className="landing-cta-primary inline-block cursor-pointer rounded-[12px] px-[26px] py-[12px] text-center text-[1.18rem] font-bold no-underline shadow-[0_4px_14px_rgba(255,199,0,0.25)]"
        >
          <Translate id="homepage.hero.cta.getStarted" description="Hero CTA">Get started</Translate>
        </Link>
        <Link
          to="/docs/sdk/core"
          className="inline-block cursor-pointer rounded-[12px] border border-[var(--hero-secondary-btn-border)] bg-[var(--hero-secondary-btn-bg)] px-[26px] py-[12px] text-center text-[1.18rem] font-semibold text-[var(--hero-secondary-btn-text)] no-underline transition-all duration-200"
        >
          <Translate id="homepage.hero.cta.apiReference" description="Hero CTA">API reference</Translate>
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-[0.82rem] text-[var(--hero-subtext)]">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <Translate id="homepage.hero.badge1" description="Hero badge">Host-injected · zero runtime install</Translate>
        </span>
        <span>·</span>
        <span><Translate id="homepage.hero.badge2" description="Hero badge" values={{ package: typesPackage }}>{'Type-safe with {package}'}</Translate></span>
        <span>·</span>
        <span className="inline-flex items-center gap-1">
          <PhIcon name="shield" />
          <Translate id="homepage.hero.badge3" description="Hero badge">Secure by design</Translate>
        </span>
      </div>
    </div>
  );
}

function HeroCodePanel() {
  const typesPackage = useTypesPackage();
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-[var(--hero-code-border)] bg-[var(--hero-code-bg)] shadow-[0_25px_60px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-1.5 border-b border-[var(--hero-code-header-border)] bg-[var(--hero-code-header-bg)] px-[18px] py-[14px] text-[0.82rem] text-[var(--hero-code-header-text)]">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c940]" />
          <span className="ml-[10px] font-mono text-[0.8rem] text-[var(--hero-code-header-text)]">src/main.tsx</span>
        </div>
        <pre className="m-0 overflow-auto bg-[var(--hero-code-bg)] px-[18px] py-5 text-[0.84rem] leading-[1.7] text-[var(--hero-code-text)]">
          <code>{`// No SDK npm install — host injects it
import type { MiniAppSdkInterface } from "${typesPackage}";

export function mount(container: HTMLElement, runtime?: { initialPath?: string }) {
  const sdk = window.__GSA_SDK__!;

  // type-safe from day one
  const user = await sdk.auth.getUser();
  const res  = await sdk.device.location();

  render(<App user={user} />, container);
  return { unmount() { /* cleanup */ } };
}`}</code>
        </pre>
        <div className="flex items-center justify-between border-t border-[var(--hero-code-footer-border)] bg-[var(--hero-code-header-bg)] px-[18px] py-3 text-[0.82rem]">
          <span className="font-mono text-[var(--hero-code-footer-text)]"><Translate id="homepage.hero.code.footer" description="Hero code footer" values={{ arrow: <PhIcon name="arrow-right" /> }}>{"vite build --lib {arrow} ES module"}</Translate></span>
          <ArrowLink
            to="/docs/getting-started"
            id="homepage.hero.code.craft"
            description="Hero code craft"
            className="font-semibold text-[var(--hero-code-link)] no-underline"
          >
            {"Scaffold in 4 steps {arrow}"}
          </ArrowLink>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <header className="relative overflow-hidden pt-[80px] pb-[72px] max-[996px]:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[30%] -right-[15%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,199,0,0.06)_0%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[20%] -left-[10%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.04)_0%,transparent_70%)]"
      />
      <div className="container relative z-[1]">
        <div className="grid items-center gap-9 grid-cols-[1.05fr_0.95fr] max-[900px]:grid-cols-1 max-[900px]:gap-7">
          <HeroCopy />
          <HeroCodePanel />
        </div>
      </div>
    </header>
  );
}
