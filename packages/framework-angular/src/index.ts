/**
 * @sewa/framework-angular - Angular adapter for the Sewa Mini App SDK
 *
 * Provides an injectable MiniAppSdkService singleton, RxJS Observable event
 * streams, route guards, and Angular lifecycle integration.
 *
 * Internal workspace package - not published to npm.
 * See docs/integration/angular.mdx for the preview pattern.
 */

export const FRAMEWORK = "angular" as const;
export const STATUS = "upcoming" as const;

export { AngularFrameworkShowcase } from "./FrameworkShowcase";

export const NG_SNIPPETS = {
  setup: `import { provideMiniAppSdk } from "@sewa/framework-angular";

bootstrapApplication(AppComponent, {
  providers: [
    provideMiniAppSdk({ miniAppId: "my-mini-app" }),
  ],
});`,

  useSdk: `import { MiniAppSdkService } from "@sewa/framework-angular";

@Component({ selector: "app-profile" })
export class ProfileComponent {
  constructor(private sdk: MiniAppSdkService) {}

  async ngOnInit() {
    const user = await this.sdk.auth.getUser();
    console.log(user);
  }
}`,

  useAuth: `import { MiniAppSdkService } from "@sewa/framework-angular";

@Component({ selector: "app-auth" })
export class AuthComponent {
  user$ = this.sdk.auth.getUser$(); // Observable<PlatformUser | null>

  constructor(private sdk: MiniAppSdkService) {}
}`,
} as const;
