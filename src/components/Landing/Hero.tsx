import Heading from "@theme/Heading";
import Translate from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import React from "react";
import {MotionConfig, motion} from "framer-motion";

function floatProps(delay: number, duration: number, distance: number) {
  return {
    animate: {y: [0, -distance, 0]},
    transition: {duration, delay, repeat: Infinity, ease: "easeInOut" as const},
  };
}

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
        <span className="inline-block w-full rounded-lg sm:w-auto">
          <Link
            to="/docs/getting-started"
            className="bg-gold-500 hover:bg-gold-600 transition-all block cursor-pointer rounded-lg px-6.5 py-2 text-center text-[17px]/[25px] font-medium text-neutral-900 no-underline"
          >
            <Translate id="homepage.hero.cta.getStarted" description="Hero CTA">Get Started</Translate>
          </Link>
        </span>
        <span className="inline-block w-full rounded-lg sm:w-auto">
          <Link
            to="/docs/sdk/core"
            className="block cursor-pointer hover:bg-neutral-200 transition-all rounded-lg border border-(--hero-secondary-btn-border) bg-(--hero-secondary-btn-bg) dark:bg-neutral-800 px-6.5 py-2 text-center text-[17px]/[25px] font-medium text-neutral-900 dark:text-white no-underline"
          >
            <Translate id="homepage.hero.cta.apiReference" description="Hero CTA">API Reference</Translate>
          </Link>
        </span>
      </div>
        <motion.img
            src={useBaseUrl("/img/heroCode.png")}
            alt=""
            aria-hidden
            {...floatProps(0, 5, 10)}
            className="absolute md:-top-20 xl:top-0 lg:left-0 xl:-left-12.5 select-none pointer-events-none h-18.75 w-auto hidden md:block"
        />
        <motion.img
            src={useBaseUrl("/img/heroBraces.png")}
            alt=""
            aria-hidden
            {...floatProps(0.6, 6, 8)}
            className="absolute md:-top-10 xl:top-0 md:right-0 xl:-right-10 select-none pointer-events-none h-13.5 w-auto hidden md:block"
        />
        <motion.img
            src={useBaseUrl("/img/heroCloud.png")}
            alt=""
            aria-hidden
            {...floatProps(1.1, 7, 12)}
            className="absolute -bottom-13.75 md:left-10 xl:left-22.5 select-none pointer-events-none h-16.25 w-auto hidden md:block"
        />
        <motion.img
            src={useBaseUrl("/img/heroApi.png")}
            alt=""
            aria-hidden
            {...floatProps(0.3, 5.5, 9)}
            className="absolute -bottom-15.75 md:right-5 xl:right-20 select-none pointer-events-none h-21 w-auto hidden md:block"
        />
    </div>
  );
}

function HeroShell() {
  return (
    <MotionConfig reducedMotion="user">
    <section className="relative overflow-hidden md:py-60 p-8">
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
    </MotionConfig>
  );
}


export function HeroFrameworks() {
  return <HeroShell />;
}
