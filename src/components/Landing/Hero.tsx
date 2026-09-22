import Heading from "@theme/Heading";
import Translate from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import React from "react";

function HeroContent() {
  return (
    <div className="relative">
      <Heading
        as="h1"
        className="mb-3 font-bold 2xl:text-[56px]! lg:text-5xl!"
      >
          <span className="text-neutral-900 dark:text-white"><Translate id="homepage.hero.title.line1" description="Hero title line 1">Build mini app</Translate></span>
          {" "}<span className="text-gold-500"><Translate id="homepage.hero.title.line2" description="Hero title line 2">for the Sewa platform.</Translate></span>
      </Heading>

      <p className="mb-8 max-w-200 dark:text-white text-neutral-900 mx-auto lg:text-base text-sm">
        <Translate id="homepage.hero.subtitle" description="Hero subtitle">ES modules execute within the Sewa Citizen shell, with the SDK supplied by the host at runtime. Modules remain lightweight by declaring only their types and exports</Translate>{" "}
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/docs/getting-started"
          className="bg-gold-500 inline-block cursor-pointer rounded-lg px-6.5 py-2 text-center text-[17px]/[25px] font-medium text-neutral-900 no-underline"
        >
          <Translate id="homepage.hero.cta.getStarted" description="Hero CTA">Get Started</Translate>
        </Link>
        <Link
          to="/docs/sdk/core"
          className="inline-block cursor-pointer rounded-lg border border-(--hero-secondary-btn-border) bg-(--hero-secondary-btn-bg) dark:bg-neutral-800 px-6.5 py-2 text-center text-[17px]/[25px] font-medium text-neutral-900 dark:text-white no-underline transition-all duration-200"
        >
          <Translate id="homepage.hero.cta.apiReference" description="Hero CTA">API Reference</Translate>
        </Link>
      </div>
        <img
            src={useBaseUrl("/img/heroCode.png")}
            alt=""
            aria-hidden
            className="absolute top-0 -left-12.5 select-none pointer-events-none h-18.75 w-auto"
        />
        <img
            src={useBaseUrl("/img/heroBraces.png")}
            alt=""
            aria-hidden
            className="absolute top-0 -right-10 select-none pointer-events-none h-13.5 w-auto"
        />
        <img
            src={useBaseUrl("/img/heroCloud.png")}
            alt=""
            aria-hidden
            className="absolute -bottom-13.75 left-22.5 select-none pointer-events-none h-16.25 w-auto"
        />
        <img
            src={useBaseUrl("/img/heroApi.png")}
            alt=""
            aria-hidden
            className="absolute -bottom-15.75 right-20 select-none pointer-events-none h-21 w-auto"
        />
    </div>
  );
}

function HeroShell() {
  return (
    <section className="relative overflow-hidden py-60 max-[996px]:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-30%] right-[-15%] h-150 w-150 rounded-full bg-[radial-gradient(circle,rgba(255,199,0,0.06)_0%,transparent_70%)"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-100 w-100 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.04)_0%,transparent_70%)"
      />
      <div className="container relative z-1 text-center">
          <HeroContent />
      </div>
      <img
        aria-hidden
        src={useBaseUrl("/img/heroBg.png")}
        alt=""
        className="absolute bottom-0 inset-x-0 md:h-100 object-center pointer-events-none select-none w-full dark:opacity-25"
      />
        <img
            src={useBaseUrl("/img/headerGlow.png")}
            alt=""
            aria-hidden
            className="absolute top-0 left-0 w-full select-none pointer-events-none"
        />
    </section>
  );
}


export function HeroFrameworks() {
  return <HeroShell />;
}