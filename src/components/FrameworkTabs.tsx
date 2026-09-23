import React, { useId } from "react";
import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

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

type Framework = "react" | "vue" | "angular" | "svelte" | "solid";

interface ScaffoldTabsProps {
  framework?: Framework;
  pkgName?: string;
  projectName?: string;
  /** Optional sync group - omit for an independent block. */
  groupId?: string;
}

const PKG_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
type PackageManager = typeof PKG_MANAGERS[number];

export function ScaffoldTabs({
  framework = "react",
  projectName = "my-mini-app",
  groupId: groupIdProp,
}: ScaffoldTabsProps) {
  const { groupId, queryString } = useTabGroup(groupIdProp);
  const getCommand = (pm: PackageManager): string => {
    switch (framework) {
      case "react":
        if (pm === "pnpm") return `pnpm create vite ${projectName} --template react-ts\ncd ${projectName} \npnpm i react-router\npnpm install`;
        if (pm === "npm") return `npm create vite@latest ${projectName} -- --template react-ts\ncd ${projectName}\nnpm i react-router\nnpm install`;
        if (pm === "yarn") return `yarn create vite ${projectName} --template react-ts\ncd ${projectName}\nyarn add react-router\nyarn install`;
        if (pm === "bun") return `bun create vite ${projectName} --template react-ts\ncd ${projectName}\nbun add react-router\nbun install`;
        break;

      case "vue":
        if (pm === "pnpm") return `pnpm create vite ${projectName} --template vue-ts\ncd ${projectName}\npnpm install`;
        if (pm === "npm") return `npm create vite@latest ${projectName} -- --template vue-ts\ncd ${projectName}\nnpm install`;
        if (pm === "yarn") return `yarn create vite ${projectName} --template vue-ts\ncd ${projectName}\nyarn install`;
        if (pm === "bun") return `bun create vite ${projectName} --template vue-ts\ncd ${projectName}\nbun install`;
        break;

      case "angular":
        if (pm === "pnpm") {
          return `npx -y @angular/cli@21 new ${projectName} --routing --style=css --ssr=false --skip-tests --skip-git --package-manager=pnpm\ncd ${projectName}`;
        }
        if (pm === "npm") {
          return `npx -y @angular/cli@21 new ${projectName} --routing --style=css --ssr=false --skip-tests --skip-git\ncd ${projectName}`;
        }
        if (pm === "yarn") {
          return `npx -y @angular/cli@21 new ${projectName} --routing --style=css --ssr=false --skip-tests --skip-git --package-manager=yarn\ncd ${projectName}`;
        }
        if (pm === "bun") {
          return `npx -y @angular/cli@21 new ${projectName} --routing --style=css --ssr=false --skip-tests --skip-git --package-manager=bun\ncd ${projectName}`;
        }
        break;

      case "svelte":
        if (pm === "pnpm") return `pnpm create vite ${projectName} --template svelte-ts\ncd ${projectName}\npnpm install`;
        if (pm === "npm") return `npm create vite@latest ${projectName} -- --template svelte-ts\ncd ${projectName}\nnpm install`;
        if (pm === "yarn") return `yarn create vite ${projectName} --template svelte-ts\ncd ${projectName}\nyarn install`;
        if (pm === "bun") return `bun create vite ${projectName} --template svelte-ts\ncd ${projectName}\nbun install`;
        break;

      case "solid":
        if (pm === "pnpm") return `pnpm create vite ${projectName} --template solid-ts\ncd ${projectName}\npnpm install`;
        if (pm === "npm") return `npm create vite@latest ${projectName} -- --template solid-ts\ncd ${projectName}\nnpm install`;
        if (pm === "yarn") return `yarn create vite ${projectName} --template solid-ts\ncd ${projectName}\nyarn install`;
        if (pm === "bun") return `bun create vite ${projectName} --template solid-ts\ncd ${projectName}\nbun install`;
        break;
    }
    return "";
  };

  return (
    <Tabs groupId={groupId} queryString={queryString} defaultValue="pnpm">
      {PKG_MANAGERS.map((pm) => (
        <TabItem key={pm} value={pm} label={pm}>
          <CodeBlock language="bash">{getCommand(pm)}</CodeBlock>
        </TabItem>
      ))}
    </Tabs>
  );
}

export interface RunCommandTabsProps {
  npm: string;
  pnpm: string;
  yarn: string;
  bun: string;
  /** Optional sync group - omit for an independent block. */
  groupId?: string;
}

/**
 * Package-manager tabs for run/dev/build commands (one command per manager).
 * Each block is independent by default; pass a shared groupId to sync
 * several blocks.
 *
 * Usage in MDX:
 * <RunCommandTabs npm="npm run build" pnpm="pnpm build" yarn="yarn build" bun="bun run build" />
 */
export function RunCommandTabs({ npm, pnpm, yarn, bun, groupId: groupIdProp }: RunCommandTabsProps) {
  const commands: Record<PackageManager, string> = { npm, pnpm, yarn, bun };
  const { groupId, queryString } = useTabGroup(groupIdProp);
  return (
    <Tabs groupId={groupId} queryString={queryString} defaultValue="pnpm">
      {PKG_MANAGERS.map((pm) => (
        <TabItem key={pm} value={pm} label={pm}>
          <CodeBlock language="bash">{commands[pm]}</CodeBlock>
        </TabItem>
      ))}
    </Tabs>
  );
}

// Convenient shorthand components
export function ReactScaffoldBlock(props: Omit<ScaffoldTabsProps, "framework">) {
  return <ScaffoldTabs framework="react" {...props} />;
}

export function VueScaffoldBlock(props: Omit<ScaffoldTabsProps, "framework">) {
  return <ScaffoldTabs framework="vue" {...props} />;
}

export function AngularScaffoldBlock(props: Omit<ScaffoldTabsProps, "framework">) {
  return <ScaffoldTabs framework="angular" {...props} />;
}

export function SvelteScaffoldBlock(props: Omit<ScaffoldTabsProps, "framework">) {
  return <ScaffoldTabs framework="svelte" {...props} />;
}

export function SolidScaffoldBlock(props: Omit<ScaffoldTabsProps, "framework">) {
  return <ScaffoldTabs framework="solid" {...props} />;
}