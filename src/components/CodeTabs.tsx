import React from "react";
import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

interface CodeTabsProps {
  typescript: string;
  javascript: string;
  title?: string;
  /**
   * Tab sync group. Blocks sharing a groupId switch together page-wide.
   * Defaults to "code-language" (all instances in sync); pass a unique id
   * to make one block independent.
   */
  groupId?: string;
}

/**
 * Renders switchable JS/TS code examples using Docusaurus Tabs.
 * Instances sharing a groupId stay in sync (Docusaurus syncs same-group
 * tabs automatically, including ?queryString). TypeScript is the default tab.
 *
 * Usage in MDX:
 * <CodeTabs
 *   typescript={`const sdk: MiniAppSdk = window.__GSA_SDK__;`}
 *   javascript={`const sdk = window.__GSA_SDK__;`}
 * />
 */
export function CodeTabs({ typescript, javascript, title, groupId = "code-language" }: CodeTabsProps) {
  return (
    <Tabs groupId={groupId} queryString>
      <TabItem value="typescript" label="TypeScript">
        <CodeBlock language="typescript" title={title}>
          {typescript}
        </CodeBlock>
      </TabItem>
      <TabItem value="javascript" label="JavaScript">
        <CodeBlock language="javascript" title={title}>
          {javascript}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
}

interface InlineCodeTabsProps {
  typescript: React.ReactNode;
  javascript: React.ReactNode;
  /** See CodeTabs.groupId - defaults to "code-language" (synced). */
  groupId?: string;
}

/**
 * For wrapping arbitrary JSX content in JS/TS tabs (not just code blocks).
 */
export function InlineCodeTabs({ typescript, javascript, groupId = "code-language" }: InlineCodeTabsProps) {
  return (
    <Tabs groupId={groupId} queryString>
      <TabItem value="typescript" label="TypeScript">
        {typescript}
      </TabItem>
      <TabItem value="javascript" label="JavaScript">
        {javascript}
      </TabItem>
    </Tabs>
  );
}

/**
 * No-op wrapper kept for backward compatibility with docs that wrap their
 * content in <LanguageProvider>. Sync is handled by the `code-language`
 * groupId, so no provider is needed.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
