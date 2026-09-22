import React, { createContext, useContext, useState, useEffect } from "react";
import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

type Language = "typescript" | "javascript";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "typescript",
  setLanguage: () => {},
});

const STORAGE_KEY = "code-tabs-language";

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(STORAGE_KEY) as Language) || "typescript";
    }
    return "typescript";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguage() {
  return useContext(LanguageContext);
}

interface CodeTabsProps {
  typescript: string;
  javascript: string;
  title?: string;
}

/**
 * Renders switchable JS/TS code examples using Docusaurus Tabs.
 * Language preference is synced across all instances via context and persisted to localStorage.
 *
 * Usage in MDX:
 * <CodeTabs
 *   typescript={`const sdk: MiniAppSdk = window.__GSA_SDK__;`}
 *   javascript={`const sdk = window.__GSA_SDK__;`}
 * />
 */
export function CodeTabs({ typescript, javascript, title }: CodeTabsProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <Tabs
      value={language}
      onChange={(value) => setLanguage(value as Language)}
    >
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
}

/**
 * For wrapping arbitrary JSX content in JS/TS tabs (not just code blocks).
 */
export function InlineCodeTabs({ typescript, javascript }: InlineCodeTabsProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <Tabs
      value={language}
      onChange={(value) => setLanguage(value as Language)}
    >
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
 * Wrap your MDX content with this provider to enable synced language tabs.
 * Add to the top of your MDX file:
 *
 * import {CodeTabs, LanguageProvider} from '@site/src/components/CodeTabs';
 *
 * <LanguageProvider>
 *   ... your content with CodeTabs ...
 * </LanguageProvider>
 */
export { LanguageProvider };
