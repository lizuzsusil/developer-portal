import React from "react";
import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { useTypesPackage } from "./TypesPackage";

type Framework = "react" | "vue" | "angular" | "svelte" | "solid";

interface ScaffoldTabsProps {
  framework?: Framework;
  pkgName?: string;
  projectName?: string;
}

const PKG_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
type PackageManager = typeof PKG_MANAGERS[number];

export function ScaffoldTabs({
  framework = "react",
  pkgName,
  projectName = "my-mini-app",
}: ScaffoldTabsProps) {
  const pkg = useTypesPackage(pkgName);

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
          return `mkdir ${projectName} && cd ${projectName}\npnpm init\npnpm add @analogjs/vite-plugin-angular @angular/common @angular/compiler @angular/core @angular/platform-browser @angular/router lucide-angular tailwindcss @tailwindcss/vite zone.js\npnpm add -D @angular/build @angular/compiler-cli "${pkg}" @types/node typescript@^5 vite`;
        }
        if (pm === "npm") {
          return `mkdir ${projectName} && cd ${projectName}\nnpm init -y\nnpm install @analogjs/vite-plugin-angular @angular/common @angular/compiler @angular/core @angular/platform-browser @angular/router lucide-angular tailwindcss @tailwindcss/vite zone.js\nnpm install -D @angular/build @angular/compiler-cli "${pkg}" @types/node typescript@^5 vite`;
        }
        if (pm === "yarn") {
          return `mkdir ${projectName} && cd ${projectName}\nyarn init -y\nyarn add @analogjs/vite-plugin-angular @angular/common @angular/compiler @angular/core @angular/platform-browser @angular/router lucide-angular tailwindcss @tailwindcss/vite zone.js\nyarn add -D @angular/build @angular/compiler-cli "${pkg}" @types/node typescript@^5 vite`;
        }
        if (pm === "bun") {
          return `mkdir ${projectName} && cd ${projectName}\nbun init -y\nbun add @analogjs/vite-plugin-angular @angular/common @angular/compiler @angular/core @angular/platform-browser @angular/router lucide-angular tailwindcss @tailwindcss/vite zone.js\nbun add -d @angular/build @angular/compiler-cli "${pkg}" @types/node typescript@^5 vite`;
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
    <Tabs groupId="pkg-scaffold" queryString>
      {PKG_MANAGERS.map((pm) => (
        <TabItem key={pm} value={pm} label={pm}>
          <CodeBlock language="bash">{getCommand(pm)}</CodeBlock>
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