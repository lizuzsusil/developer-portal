import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

const FALLBACK = "@lizuz/mini-app-types";

export function useTypesPackage(): string {
  const { siteConfig } = useDocusaurusContext();
  const fromConfig = siteConfig.customFields?.typesPackage as string | undefined;
  // handle "N/A" or empty from older builds
  if (fromConfig && fromConfig.trim() && fromConfig !== "N/A") {
    return fromConfig.trim();
  }
  return FALLBACK;
}

export function TypesPackageName(): React.ReactNode {
  const pkg = useTypesPackage();
  return <>{pkg}</>;
}

export function InstallCommandBlock({ prefix = "pnpm add -D " }: { prefix?: string }) {
  const pkg = useTypesPackage();
  return <CodeBlock language="bash">{`${prefix}${pkg}`}</CodeBlock>;
}

const PKG_MANAGERS: [string, string][] = [
  ["pnpm", "pnpm add -D "],
  ["npm", "npm install -D "],
  ["yarn", "yarn add --dev "],
  ["bun", "bun add -d "],
];

/**
 * Renders switchable install commands (one tab per package manager) using the
 * Docusaurus theme's <Tabs>/<TabItem> + <CodeBlock>.
 */
export function InstallCommandTabs() {
  const pkg = useTypesPackage();
  return (
    <Tabs
      groupId="pkg-install"
      queryString
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

export function ImportCodeBlock() {
  const pkg = useTypesPackage();
  return (
    <CodeBlock language="typescript">
      {`// src/gov-sdk.d.ts
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
    __GSA_SDK__?: MiniAppSdk; // set by host before mount()
  }
}`}
    </CodeBlock>
  );
}

export function ReactGovSdkImportBlock() {
  const pkg = useTypesPackage();
  return (
    <CodeBlock language="typescript">
      {`// src/gov-sdk.d.ts
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
