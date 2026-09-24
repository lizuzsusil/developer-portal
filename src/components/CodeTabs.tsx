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

interface CodeTabsProps {
  typescript: string;
  javascript: string;
  title?: string;
  /**
   * Optional sync group. Blocks sharing a groupId switch together;
   * omit it (default) and each block keeps an independent selection.
   */
  groupId?: string;
}

/**
 * Renders switchable JS/TS code examples using Docusaurus Tabs.
 * Each block is independent by default; pass the same groupId to
 * several blocks to sync them (including ?queryString persistence).
 * TypeScript is the default tab.
 *
 * Usage in MDX:
 * <CodeTabs
 *   typescript={`const sdk: MiniAppSdk = window.__SEWA_SDK__;`}
 *   javascript={`const sdk = window.__SEWA_SDK__;`}
 * />
 */
export function CodeTabs({ typescript, javascript, title, groupId: groupIdProp }: CodeTabsProps) {
  const { groupId, queryString } = useTabGroup(groupIdProp);
  return (
    <Tabs groupId={groupId} queryString={queryString}>
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
  /** See CodeTabs.groupId - omit for an independent block. */
  groupId?: string;
}

/**
 * For wrapping arbitrary JSX content in JS/TS tabs (not just code blocks).
 */
export function InlineCodeTabs({ typescript, javascript, groupId: groupIdProp }: InlineCodeTabsProps) {
  const { groupId, queryString } = useTabGroup(groupIdProp);
  return (
    <Tabs groupId={groupId} queryString={queryString}>
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
 * content in <LanguageProvider>. Blocks are independent unless given a
 * shared groupId, so no provider is needed.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
