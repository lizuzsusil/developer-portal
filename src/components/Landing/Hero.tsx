import Heading from "@theme/Heading";
import Translate from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import { useTypesPackage } from "../TypesPackage";
import { React as ReactIcon, VueJs, Angular, SvelteJS, SolidJS } from "developer-icons";
import {ReactNode} from "react";

function HeroKicker() {
  return (
    <div className="mb-5.5 inline-flex items-center gap-2 rounded-full border border-(--hero-kicker-border) bg-(--hero-kicker-bg) px-3.5 py-1.25 text-[0.82rem] font-semibold text-(--hero-kicker-text) backdrop-blur-sm">
      <span className="inline-block h-1.75 w-1.75 animate-pulse-dot rounded-full bg-(--hero-kicker-dot)" />
      <Translate id="homepage.hero.kicker" description="Hero kicker">Sewa Developer Portal · Government of Sri Lanka</Translate>
    </div>
  );
}

function HeroContent() {
  const typesPackage = useTypesPackage();
  return (
    <div>
      <HeroKicker />

      <Heading
        as="h1"
        className="mb-4.5 text-[clamp(2.2rem,4.5vw,3rem) font-extrabold leading-[1.08] tracking-[-0.03em] text-(--hero-text)"
      >
        <Translate id="homepage.hero.title.line1" description="Hero title line 1">Build mini apps</Translate>
        <br />
        <span className="text-(--hero-text-accent)"><Translate id="homepage.hero.title.line2" description="Hero title line 2">for the Sewa platform.</Translate></span>
      </Heading>

      <p className="mb-7 max-w-135 text-[1.1rem] leading-[1.65] text-(--hero-subtext)">
        <Translate id="homepage.hero.subtitle" description="Hero subtitle">Ship lightweight ES modules that run inside the Sewa shell. The host injects the SDK at runtime - you just declare types and export</Translate>{" "}
        <code className="rounded-md bg-(--hero-inline-code-bg) px-2 py-0.5 text-[0.9em] font-semibold text-(--hero-inline-code-text)">mount(container, runtime)</code>.
      </p>

      <div className="flex flex-wrap gap-3.5">
        <Link
          to="/docs/getting-started"
          className="landing-cta-primary inline-block cursor-pointer rounded-[12px] px-6.5 py-3 text-center text-[1.18rem] font-bold no-underline shadow-[0_4px_14px_rgba(255,199,0,0.25)"
        >
          <Translate id="homepage.hero.cta.getStarted" description="Hero CTA">Get started</Translate>
        </Link>
        <Link
          to="/docs/sdk/core"
          className="inline-block cursor-pointer rounded-[12px] border border-(--hero-secondary-btn-border) bg-(--hero-secondary-btn-bg) px-6.5 py-3 text-center text-[1.18rem] font-semibold text-(--hero-secondary-btn-text) no-underline transition-all duration-200"
        >
          <Translate id="homepage.hero.cta.apiReference" description="Hero CTA">API reference</Translate>
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-[0.82rem] text-(--hero-subtext)">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <Translate id="homepage.hero.badge1" description="Hero badge">Host-injected · zero runtime install</Translate>
        </span>
        <span>·</span>
        <span><Translate id="homepage.hero.badge2" description="Hero badge" values={{ package: typesPackage }}>{'Type-safe with {package}'}</Translate></span>
      </div>
    </div>
  );
}

function HeroFrameworkPanel() {
  const frameworks = [
    { icon: ReactIcon, label: "React" },
    { icon: VueJs, label: "Vue 3" },
    { icon: Angular, label: "Angular" },
    { icon: SvelteJS, label: "Svelte" },
    { icon: SolidJS, label: "Solid" },
  ];
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-130 overflow-hidden rounded-2xl border border-(--hero-code-border) bg-(--hero-code-bg) shadow-[0_25px_60px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.05)">
        <div className="flex items-center gap-1.5 border-b border-(--hero-code-header-border) bg-(--hero-code-header-bg) px-4.5 py-3.5 text-[0.82rem] text-(--hero-code-header-text)">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c940]" />
          <span className="ml-2.5 font-mono text-[0.8rem] text-(--hero-code-header-text)">
            <Translate id="homepage.hero.frameworks.header" description="Fw header">5 stacks · one contract</Translate>
          </span>
        </div>

        <div className="bg-(--hero-code-bg) px-4.5 pt-5 pb-3">
          <div className="rounded-xl border border-(--hero-code-border) bg-(--hero-code-header-bg) px-4 py-3.5 text-center">
            <div className="font-mono text-[0.86rem] font-bold tracking-[-0.01em] text-(--hero-code-text)">export function mount(container, runtime)</div>
            <div className="mt-1.5 font-mono text-[0.74rem] text-(--hero-code-footer-text)">
              <Translate id="homepage.hero.frameworks.contract" description="Fw contract">{"{ unmount() } \u00B7 same in every framework"}</Translate>
            </div>
          </div>
          <p className="mt-3 text-center text-[0.76rem] leading-normal text-(--hero-code-footer-text)">
            <Translate id="homepage.hero.frameworks.note" description="Fw note">No lock-in. Keep your stack, the host handles auth, permissions & device access.</Translate>
          </p>
        </div>

        <div className="grid grid-cols-5 gap-2 bg-(--hero-code-bg) px-4.5 pb-5">
          {frameworks.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl border border-(--hero-code-border) bg-(--hero-code-header-bg) px-2 py-3">
              <div className="h-7 w-7"><Icon size={28} className="h-full w-full" /></div>
              <span className="text-[0.7rem] font-bold text-(--hero-code-text)">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroShell({ panel }: { panel: ReactNode }) {
  return (
    <header className="relative overflow-hidden pt-18 pb-16 max-[996px]:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-30%] right-[-15%] h-150 w-150 rounded-full bg-[radial-gradient(circle,rgba(255,199,0,0.06)_0%,transparent_70%)"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-100 w-100 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.04)_0%,transparent_70%)"
      />
      <div className="container relative z-1">
        <div className="grid items-center gap-9 grid-cols-[1.05fr_0.95fr] max-[900px]:grid-cols-1 max-[900px]:gap-7">
          <HeroContent />
          {panel}
        </div>
      </div>
    </header>
  );
}


export function HeroFrameworks() {
  return <HeroShell panel={<HeroFrameworkPanel />} />;
}

export { HeroFrameworkPanel };
