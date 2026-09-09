import Heading from "@theme/Heading";
import Translate from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import { PhIcon } from "../PhIcon";
import { useTypesPackage } from "../TypesPackage";
import { ArrowLink } from "./ArrowLink";
import { React as ReactIcon, VueJs, Angular, SvelteJS, SolidJS } from "developer-icons";

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

/* ──────────────────────────────────────────────────────────
   Option 1 — Architecture visual (framework-agnostic, no code)
   ────────────────────────────────────────────────────────── */
function HeroArchitecturePanel() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-[var(--hero-code-border)] bg-[var(--hero-code-bg)] shadow-[0_25px_60px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-1.5 border-b border-[var(--hero-code-header-border)] bg-[var(--hero-code-header-bg)] px-[18px] py-[14px] text-[0.82rem] text-[var(--hero-code-header-text)]">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c940]" />
          <span className="ml-[10px] font-mono text-[0.8rem] text-[var(--hero-code-header-text)]">
            <Translate id="homepage.hero.arch.header" description="Arch header">Sewa runtime · Host loads on demand</Translate>
          </span>
          <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-[var(--hero-code-header-border)] bg-[var(--hero-code-bg)] px-2.5 py-1 text-[0.7rem] font-semibold text-[var(--hero-code-header-text)] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <Translate id="homepage.hero.arch.badge" description="Arch badge">Framework-agnostic</Translate>
          </span>
        </div>

        <div className="bg-[var(--hero-code-bg)] px-[18px] py-5">
          {/* Flow: You ship → Host does */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3">
            <div className="rounded-xl border border-[var(--hero-code-border)] bg-[var(--hero-code-header-bg)] p-3.5">
              <div className="text-[0.68rem] font-extrabold tracking-[0.08em] text-[var(--hero-code-header-text)]">
                <Translate id="homepage.hero.arch.youShip" description="Arch youShip">YOU SHIP</Translate>
              </div>
              <div className="mt-2.5 space-y-2">
                <div className="flex items-center gap-2 rounded-lg border border-[var(--hero-code-border)] bg-[var(--hero-code-bg)] px-2.5 py-2 text-[0.78rem] font-medium text-[var(--hero-code-text)]">
                  <PhIcon name="code" />
                  <span className="font-mono">manifest.json</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-[var(--hero-code-border)] bg-[var(--hero-code-bg)] px-2.5 py-2 text-[0.78rem] font-medium text-[var(--hero-code-text)]">
                  <PhIcon name="atom" />
                  <span className="font-mono">ES module</span>
                </div>
              </div>
              <div className="mt-2.5 text-[0.72rem] leading-[1.5] text-[var(--hero-code-footer-text)]">
                <Translate id="homepage.hero.arch.youShip.note" description="Arch note">vite build → dist/ · types only, no SDK install</Translate>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-1.5 px-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--hero-code-border)] bg-[var(--hero-code-header-bg)] text-[var(--hero-code-header-text)]">
                <PhIcon name="arrow-right" />
              </span>
              <span className="hidden text-[0.65rem] font-semibold tracking-widest text-[var(--hero-code-footer-text)] sm:block">
                <Translate id="homepage.hero.arch.arrow" description="Arch arrow">HOST</Translate>
              </span>
            </div>

            <div className="rounded-xl border border-[var(--hero-code-border)] bg-[var(--hero-code-header-bg)] p-3.5">
              <div className="text-[0.68rem] font-extrabold tracking-[0.08em] text-[var(--hero-code-header-text)]">
                <Translate id="homepage.hero.arch.hostDoes" description="Arch hostDoes">HOST DOES</Translate>
              </div>
              <ul className="mt-2.5 space-y-1.5 text-[0.78rem] leading-[1.5] text-[var(--hero-code-text)]">
                <li className="flex gap-1.5"><span className="text-emerald-400">✓</span><Translate id="homepage.hero.arch.step1" description="Arch step1">Verifies manifest</Translate></li>
                <li className="flex gap-1.5"><span className="text-emerald-400">✓</span><Translate id="homepage.hero.arch.step2" description="Arch step2">Loads ES module</Translate></li>
                <li className="flex gap-1.5"><span className="text-emerald-400">✓</span><Translate id="homepage.hero.arch.step3" description="Arch step3">Injects SDK & calls mount(container)</Translate></li>
              </ul>
            </div>
          </div>

          {/* bottom contract strip */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-[var(--hero-code-border)] bg-[var(--hero-code-header-bg)] px-3 py-2.5">
            <span className="font-mono text-[0.74rem] font-semibold text-[var(--hero-code-text)]">mount(container, runtime?)</span>
            <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[0.68rem] font-bold text-white">
              <Translate id="homepage.hero.arch.contract" description="Arch contract">One contract · any framework</Translate>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--hero-code-footer-border)] bg-[var(--hero-code-header-bg)] px-[18px] py-3 text-[0.82rem]">
          <span className="font-mono text-[var(--hero-code-footer-text)]">
            <Translate id="homepage.hero.arch.footer" description="Arch footer" values={{ arrow: <PhIcon name="arrow-right" /> }}>
              {"dist/manifest.json {arrow} Citizen shell"}
            </Translate>
          </span>
          <ArrowLink
            to="/docs/getting-started"
            id="homepage.hero.arch.cta"
            description="Arch CTA"
            className="shrink-0 font-semibold text-[var(--hero-code-link)] no-underline"
          >
            {"How it works {arrow}"}
          </ArrowLink>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Option 2 — Framework wall (one contract)
   ────────────────────────────────────────────────────────── */
function HeroFrameworkPanel() {
  const frameworks = [
    { icon: ReactIcon, label: "React" },
    { icon: VueJs, label: "Vue" },
    { icon: Angular, label: "Angular" },
    { icon: SvelteJS, label: "Svelte" },
    { icon: SolidJS, label: "Solid" },
  ];
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-[var(--hero-code-border)] bg-[var(--hero-code-bg)] shadow-[0_25px_60px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-1.5 border-b border-[var(--hero-code-header-border)] bg-[var(--hero-code-header-bg)] px-[18px] py-[14px] text-[0.82rem] text-[var(--hero-code-header-text)]">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c940]" />
          <span className="ml-[10px] font-mono text-[0.8rem] text-[var(--hero-code-header-text)]">
            <Translate id="homepage.hero.frameworks.header" description="Fw header">Any stack · one contract</Translate>
          </span>
          <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-[var(--hero-code-header-border)] bg-[var(--hero-code-bg)] px-2.5 py-1 text-[0.7rem] font-semibold text-[var(--hero-code-header-text)] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <Translate id="homepage.hero.frameworks.badge" description="Fw badge">5 guides</Translate>
          </span>
        </div>

        <div className="bg-[var(--hero-code-bg)] px-[18px] pt-5 pb-3">
          <div className="rounded-xl border border-[var(--hero-code-border)] bg-[var(--hero-code-header-bg)] px-4 py-3.5 text-center">
            <div className="font-mono text-[0.86rem] font-bold tracking-[-0.01em] text-[var(--hero-code-text)]">export function mount(container, runtime?)</div>
            <div className="mt-1.5 font-mono text-[0.74rem] text-[var(--hero-code-footer-text)]">
              <Translate id="homepage.hero.frameworks.contract" description="Fw contract">{"\u2192 { unmount() } \u00B7 same in every framework"}</Translate>
            </div>
          </div>
          <p className="mt-3 text-center text-[0.76rem] leading-[1.5] text-[var(--hero-code-footer-text)]">
            <Translate id="homepage.hero.frameworks.note" description="Fw note">No lock-in. Keep your stack — the host handles auth, permissions & device access.</Translate>
          </p>
        </div>

        <div className="grid grid-cols-5 gap-2 bg-[var(--hero-code-bg)] px-[18px] pb-5">
          {frameworks.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--hero-code-border)] bg-[var(--hero-code-header-bg)] px-2 py-3">
              <div className="h-7 w-7"><Icon size={28} className="h-full w-full" /></div>
              <span className="text-[0.7rem] font-bold text-[var(--hero-code-text)]">{label}</span>
              <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[0.62rem] font-bold text-emerald-400">✓</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--hero-code-footer-border)] bg-[var(--hero-code-header-bg)] px-[18px] py-3 text-[0.82rem]">
          <span className="text-[0.78rem] text-[var(--hero-code-footer-text)]">
            <Translate id="homepage.hero.frameworks.footer" description="Fw footer">React · Vue · Angular · Svelte · Solid</Translate>
          </span>
          <ArrowLink
            to="/docs/integration/react"
            id="homepage.hero.frameworks.cta"
            description="Fw CTA"
            className="shrink-0 font-semibold text-[var(--hero-code-link)] no-underline"
          >
            {"Pick your guide {arrow}"}
          </ArrowLink>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Legacy code panel kept for easy revert (not rendered)
   ────────────────────────────────────────────────────────── */
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
          <span className="ml-auto hidden items-center gap-1.5 rounded-full border border-[var(--hero-code-header-border)] bg-[var(--hero-code-bg)] px-2.5 py-1 text-[0.7rem] font-semibold text-[var(--hero-code-header-text)] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <Translate id="homepage.hero.code.badge" description="Hero code badge">ES module · host loads on demand</Translate>
          </span>
        </div>
        <pre className="m-0 overflow-auto bg-[var(--hero-code-bg)] px-[18px] py-5 text-[0.84rem] leading-[1.7] text-[var(--hero-code-text)]">
          <code>{`// Host injects SDK — you only install types: pnpm add -D ${typesPackage}
// Build outputs manifest.json + ES module the host loads on demand
import { createRoot } from "react-dom/client";
import App from "./App";

export function mount(container: HTMLElement, runtime?: { initialPath?: string }) {
  const root = createRoot(container);
  if (runtime?.initialPath) location.hash = \`#\${runtime.initialPath}\`;
  root.render(<App />);
  return { unmount() { root.unmount(); } };
}`}</code>
        </pre>
        <div className="flex items-center justify-between gap-3 border-t border-[var(--hero-code-footer-border)] bg-[var(--hero-code-header-bg)] px-[18px] py-3 text-[0.82rem]">
          <span className="font-mono text-[var(--hero-code-footer-text)]">
            <Translate id="homepage.hero.code.footer" description="Hero code footer" values={{ arrow: <PhIcon name="arrow-right" /> }}>
              {"vite build --lib {arrow} dist/manifest.json + ES module"}
            </Translate>
          </span>
          <ArrowLink
            to="/docs/getting-started"
            id="homepage.hero.code.craft"
            description="Hero code craft"
            className="shrink-0 font-semibold text-[var(--hero-code-link)] no-underline"
          >
            {"4 steps to ship {arrow}"}
          </ArrowLink>
        </div>
      </div>
    </div>
  );
}

function HeroShell({ panel }: { panel: React.ReactNode }) {
  return (
    <header className="relative overflow-hidden pt-[72px] pb-[64px] max-[996px]:p-8">
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
          {panel}
        </div>
      </div>
    </header>
  );
}

export function HeroArchitecture() {
  return <HeroShell panel={<HeroArchitecturePanel />} />;
}

export function HeroFrameworks() {
  return <HeroShell panel={<HeroFrameworkPanel />} />;
}

// Default single hero (kept for backwards compat) — currently points to Architecture
export function Hero() {
  return <HeroArchitecture />;
}

export { HeroCodePanel, HeroArchitecturePanel, HeroFrameworkPanel };
