import React, { useId } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

const FALLBACK = "@lizuz/mini-app-types";

/**
 * Resolves the tab sync group: an explicit groupId keeps shared selection
 * (plus URL query-string persistence); otherwise each block gets its own
 * unique group so a selection never leaks into other blocks.
 */
function useTabGroup(groupId: string | undefined): { groupId: string; queryString: boolean } {
  const autoId = useId();
  if (groupId) return { groupId, queryString: true };
  return { groupId: `auto-${autoId}`, queryString: false };
}

interface InstallCommandTabsProps {
  pkgName?: string;
  /** Optional sync group - omit for an independent block. */
  groupId?: string;
}

export function useTypesPackage(overridePkg?: string): string {
  if (overridePkg && overridePkg.trim()) {
    return overridePkg.trim();
  }
  const { siteConfig } = useDocusaurusContext();
  const fromConfig = siteConfig.customFields?.typesPackage as string | undefined;
  if (fromConfig && fromConfig.trim() && fromConfig !== "N/A") {
    return fromConfig.trim();
  }
  return FALLBACK;
}

export function TypesPackageName({pkgName}:{pkgName?:string}): React.ReactNode {
  const pkg = useTypesPackage(pkgName);
  return <>{pkg}</>;
}

export function InstallCommandBlock({ prefix = "pnpm add -D ", pkgName }: { prefix?: string ; pkgName?:string }) {
  const pkg = useTypesPackage(pkgName);
  return <CodeBlock language="bash">{`${prefix}${pkg}`}</CodeBlock>;
}

const PKG_MANAGERS: [string, string][] = [
  ["pnpm", "pnpm add -D "],
  ["npm", "npm install -D "],
  ["yarn", "yarn add --dev "],
  ["bun", "bun add -d "],
];
const PACKAGE_MANAGERS: [string, string][] = [
  ["pnpm", "pnpm add "],
  ["npm", "npm install "],
  ["yarn", "yarn add "],
  ["bun", "bun add "],
];

/**
 * Renders switchable install commands (one tab per package manager) using the
 * Docusaurus theme's <Tabs>/<TabItem> + <CodeBlock>.
 */
export function InstallCommandTabs({pkgName, groupId: groupIdProp}:InstallCommandTabsProps) {
  const pkg = useTypesPackage(pkgName);
  const { groupId, queryString } = useTabGroup(groupIdProp);
  return (
    <Tabs
      groupId={groupId}
      queryString={queryString}
      defaultValue="pnpm"
    >
      {PKG_MANAGERS.map((mgr) => {
        const [label, prefix] = mgr;
        return (
          <TabItem key={label} value={label}>
            <CodeBlock language="bash">
              {`${prefix}${pkg}`}
            </CodeBlock>
          </TabItem>
        );
      })}
    </Tabs>
  );
}
export function InstallProdCommandTabs({ pkgName, groupId: groupIdProp }: InstallCommandTabsProps) {
  const pkg = useTypesPackage(pkgName);
  const { groupId, queryString } = useTabGroup(groupIdProp);

  return (
    <Tabs groupId={groupId} queryString={queryString} defaultValue="pnpm">
      {PACKAGE_MANAGERS.map(([label, prefix]) => (
        <TabItem key={label} value={label} label={label}>
          <CodeBlock language="bash">
            {`${prefix}${pkg}`}
          </CodeBlock>
        </TabItem>
      ))}
    </Tabs>
  );
}

export function ImportCodeBlock() {
  const pkg = useTypesPackage();
  return (
    <CodeBlock language="typescript">
      {`// src/global.d.ts
import type {
  MiniAppSdkInterface,
  PlatformUser,
  DeviceBiometricOptions,
  AppearanceState,
} from "${pkg}";

declare global {
  type MiniAppSdk = MiniAppSdkInterface;
  type SdkPlatformUser = PlatformUser;

  interface Window {
    __GSA_SDK__?: MiniAppSdk;
  }
}`}
    </CodeBlock>
  );
}

export function ImportCodeTabs({ groupId: groupIdProp }: { groupId?: string }) {
  const pkg = useTypesPackage();
  const { groupId, queryString } = useTabGroup(groupIdProp);
  return (
    <Tabs groupId={groupId} queryString={queryString}>
      <TabItem value="typescript" label="TypeScript">
        <CodeBlock language="typescript">
          {`// src/global.d.ts
import type {
  MiniAppSdkInterface,
  PlatformUser,
  DeviceBiometricOptions,
  AppearanceState,
} from "${pkg}";

declare global {
  type MiniAppSdk = MiniAppSdkInterface;
  type SdkPlatformUser = PlatformUser;

  interface Window {
    __GSA_SDK__?: MiniAppSdk;
  }
}`}
        </CodeBlock>
      </TabItem>
      <TabItem value="javascript" label="JavaScript">
        <CodeBlock language="javascript">
          {`// src/global.js — JSDoc hints only, no runtime cost (optional)
/**
 * @typedef {import("${pkg}").MiniAppSdkInterface} MiniAppSdk
 * @typedef {import("${pkg}").PlatformUser} SdkPlatformUser
 */
// Use directly: const sdk = window.__GSA_SDK__;`}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
}

export function ReactGovSdkImportBlock() {  const pkg = useTypesPackage();
  return (
    <CodeBlock language="typescript">
      {`// src/global.d.ts
import type { MiniAppSdkInterface, PlatformUser } from "${pkg}";

declare global {
  type MiniAppSdk = MiniAppSdkInterface;
  type SdkPlatformUser = PlatformUser;
  interface Window { __GSA_SDK__?: MiniAppSdk; }
}`}
    </CodeBlock>
  );
}

export function AppearanceImportBlock() {
  const pkg = useTypesPackage();
  return (
    <CodeBlock language="typescript">
      {`import type { AppearanceState, LocaleState, ThemeState } from "${pkg}";`}
    </CodeBlock>
  );
}

export function PackageJsonBlock() {
  const pkg = useTypesPackage();
  return (
    <CodeBlock language="json">
      {`{
  "devDependencies": {
    "${pkg}": "1.1.2",
    "react": "^19.0.0",
    "react-router": "^8.3.0"
  }
}`}
    </CodeBlock>
  );
}

export function UseAppearanceBlock() {
  const pkg = useTypesPackage();
  return (
    <CodeBlock language="typescript">
      {`// src/hooks/useAppearance.ts
import type { AppearanceState, LocaleState, ThemeState } from "${pkg}";

const DEFAULT_STATE: AppearanceState = {
  locale: { locale: "en-LK", language: "en", direction: "ltr" },
  theme: { preference: "system", mode: "light" },
};

export function useAppearance(): { locale: LocaleState; theme: ThemeState } {
  const { sdk, isReady } = usePlatformSDK();
  const [state, setState] = useState<AppearanceState>(() =>
    sdk && isReady ? sdk.appearance.state() : DEFAULT_STATE,
  );
  useEffect(() => {
    if (!sdk) return;
    setState(sdk.appearance.state());
    return sdk.appearance.subscribe(setState);
  }, [sdk]);
  return { locale: state.locale, theme: state.theme };
}`}
    </CodeBlock>
  );
}
