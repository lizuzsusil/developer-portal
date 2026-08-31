/**
 * @sewa/framework-vue — Vue 3 adapter for the Sewa Mini App SDK
 *
 * Provides provide/inject SDK context, reactive composables (useMiniAppSdk),
 * and Vue Router navigation hooks.
 *
 * Internal workspace package — not published to npm.
 * See docs/integration/vue.mdx for the preview pattern.
 */

export const FRAMEWORK = "vue" as const;
export const STATUS = "upcoming" as const;

export { VueFrameworkShowcase } from "./FrameworkShowcase";

export const VUE_SNIPPETS = {
  setup: `import { provideMiniAppSdk } from "@sewa/framework-vue";

// In your app entry
const app = createApp(App);
app.use(provideMiniAppSdk({ miniAppId: "my-mini-app" }));
app.mount("#app");`,

  useSdk: `import { useMiniAppSdk } from "@sewa/framework-vue";

export default {
  setup() {
    const sdk = useMiniAppSdk();
    const user = ref(null);

    onMounted(async () => {
      user.value = await sdk.auth.getUser();
    });

    return { user };
  }
}`,

  useAppearance: `import { useAppearance } from "@sewa/framework-vue";

export default {
  setup() {
    const { theme, locale } = useAppearance();
    return { theme, locale };
  }
}`,
} as const;
