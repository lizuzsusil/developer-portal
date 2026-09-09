import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import Heading from "@theme/Heading";
import { PhIcon } from "../PhIcon";
import { ArrowLink } from "./ArrowLink";

interface Capability {
  title: string;
  href: string;
  desc: string;
  icon: string;
  descId: string;
  methods: string[];
}

const CAPABILITIES: Capability[] = [
  { title: "sdk.auth", href: "/docs/sdk/auth", desc: "getUser · isAuthenticated · logout — citizen identity", icon: "lock-key", descId: "homepage.capability.auth.desc", methods: ["getUser()", "isAuthenticated()", "logout()"] },
  { title: "sdk.device", href: "/docs/sdk/device", desc: "location · camera · gallery · files · biometric", icon: "device-mobile", descId: "homepage.capability.device.desc", methods: ["location()", "camera()", "gallery()"] },
  { title: "sdk.http", href: "/docs/sdk/http", desc: "get/post/put/patch/delete + streaming proxy", icon: "globe", descId: "homepage.capability.http.desc", methods: ["post()", "stream()", "getStream()"] },
  { title: "sdk.storage", href: "/docs/sdk/storage", desc: "scoped key-value & JSON helpers per mini app", icon: "database", descId: "homepage.capability.storage.desc", methods: ["setJson()", "getMany()", "scoped()"] },
  { title: "sdk.appearance", href: "/docs/sdk/appearance", desc: "getLocale · getTheme · theme/locale subscriptions", icon: "palette", descId: "homepage.capability.appearance.desc", methods: ["getTheme()", "getLocale()", "subscribe()"] },
  { title: "sdk.gicChat", href: "/docs/sdk/gic-chat", desc: "startSession · streamText — AI chat gateway", icon: "sparkle", descId: "homepage.capability.gicChat.desc", methods: ["startSession()", "streamText()"] },
];

const MORE_NAMESPACES: { label: string; href: string }[] = [
  { label: "permissions", href: "/docs/sdk/permissions" },
  { label: "flags", href: "/docs/sdk/flags" },
  { label: "navigation", href: "/docs/sdk/navigation" },
  { label: "notifications", href: "/docs/sdk/notifications" },
  { label: "links", href: "/docs/sdk/links" },
  { label: "config", href: "/docs/sdk/config" },
];

function CapabilityCard({ capability }: { capability: Capability }) {
  const c = capability;
  return (
    <Link key={c.title} to={c.href} className="portal-card p-[22px_20px]! no-underline">
      <div className="mb-3 flex items-center gap-3">
        <span className="landing-feature-icon--lg" aria-hidden><PhIcon name={c.icon} /></span>
        <span className="text-[1rem] font-extrabold text-text-primary">{c.title}</span>
        <span className="cap-arrow ml-auto inline-flex text-[1rem] text-(--landing-step-color)" aria-hidden><PhIcon name="arrow-right" /></span>
      </div>
      <div className="mb-2.5 flex flex-wrap gap-1.5">
        {c.methods.map((m) => (
          <code
            key={m}
            className="rounded-full border border-border-decorative bg-surface-sunken px-2.25 py-0.75 text-[0.72rem] font-semibold whitespace-nowrap text-text-secondary"
          >
            {m}
          </code>
        ))}
      </div>
      <span className="text-[0.88rem] leading-[1.55] text-text-secondary">{translate({ id: c.descId, message: c.desc, description: `Capability ${c.title} description` })}</span>
    </Link>
  );
}

export function CapabilityTeaser() {
  return (
    <section className="pt-12 pb-6">
      <div className="container">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="mb-1.5 text-[0.74rem] font-bold uppercase tracking-[0.08em] text-text-secondary">
              <Translate id="homepage.capability.kicker" description="Capability kicker">Capability catalog</Translate>
            </div>
            <Heading as="h2" className="m-0 text-[1.4rem] font-extrabold tracking-[-0.015em]">
              <Translate id="homepage.capability.title" description="Capability title">What you can build with</Translate>
            </Heading>
          </div>
          <ArrowLink
            to="/docs/sdk/core"
            id="homepage.capability.cta"
            description="Capability CTA"
            className="text-[0.9rem] font-semibold text-text-link"
          >
            {"Full SDK reference {arrow}"}
          </ArrowLink>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(310px,1fr))] gap-4">
          {CAPABILITIES.map((c) => (
            <CapabilityCard key={c.title} capability={c} />
          ))}
        </div>

        <div className="mt-5.5 flex flex-wrap items-center gap-2.5 rounded-[14px] border border-border-decorative bg-surface-sunken px-5 py-3.5 text-[0.88rem] text-text-secondary">
          <span className="font-semibold text-text-primary"><Translate id="homepage.capability.alsoAvailable" description="Capability also">Also available:</Translate></span>
          {MORE_NAMESPACES.map((o) => (
            <Link
              key={o.label}
              to={o.href}
              className="rounded-full border border-border-decorative bg-surface-card px-3 py-1 text-[0.82rem] font-semibold text-text-link no-underline"
            >
              {o.label}
            </Link>
          ))}
          <span className="ml-auto">
            <ArrowLink
              to="/docs/sdk/core"
              id="homepage.capability.browseAll"
              description="Capability browse"
              className="font-bold text-text-link"
            >
              {"Browse all 14 namespaces {arrow}"}
            </ArrowLink>
          </span>
        </div>
      </div>
    </section>
  );
}
