/**
 * @sewa/framework-react - React adapter for the Sewa Mini App SDK
 *
 * Provides PlatformSDKProvider, hooks (useMiniAppSdk, useAuth, useAppearance),
 * and React Router integration.
 *
 * Internal workspace package - not published to npm.
 * See docs/integration/react.mdx for the reference implementation in test-mini-app.
 */

export const FRAMEWORK = "react" as const;
export const STATUS = "active" as const;

export { ReactFrameworkShowcase } from "./FrameworkShowcase";

/** Re-export SDK hooks pattern for React consumers */
export const REACT_SNIPPETS = {
  setup: `import { PlatformSDKProvider } from "@sewa/framework-react";

function App() {
  return (
    <PlatformSDKProvider miniAppId="my-mini-app" devMode>
      <MyMiniApp />
    </PlatformSDKProvider>
  );
}`,

  useSdk: `import { useMiniAppSdk } from "@sewa/framework-react";

function MyComponent() {
  const sdk = useMiniAppSdk();
  const [user, setUser] = useState(null);

  useEffect(() => {
    sdk.auth.getUser().then(setUser);
  }, [sdk]);
}`,

  useAuth: `import { useAuth } from "@sewa/framework-react";

function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  if (!isAuthenticated) return <LoginButton />;
  return <div>Welcome, {user.name}</div>;
}`,

  useAppearance: `import { useAppearance } from "@sewa/framework-react";

function ThemedApp() {
  const { theme, locale } = useAppearance();
  return <div data-theme={theme.mode}>{locale.language}</div>;
}`,
} as const;
