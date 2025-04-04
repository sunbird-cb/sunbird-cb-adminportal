import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay'
import { APP_BASE_HREF, PlatformLocation } from '@angular/common'
import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
// Injectable
import { APP_INITIALIZER, NgModule, ErrorHandler } from '@angular/core'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
// GestureConfig
import { MatRippleModule } from '@angular/material/core'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MAT_LEGACY_PROGRESS_SPINNER_DEFAULT_OPTIONS as MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS } from '@angular/material/legacy-progress-spinner'
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider'
import { MAT_LEGACY_SNACK_BAR_DEFAULT_OPTIONS as MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/legacy-snack-bar'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
// HAMMER_GESTURE_CONFIG
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import {
  StickyHeaderModule,
  TourModule,
  PipeContentRoutePipe,
  AvatarPhotoModule,
  AuthorCardModule,
  AtGlanceModule,
  BtnAppsModule,
  BtnCallModule,
  BtnCatalogModule,
  BtnChannelAnalyticsModule,
  BtnContentDownloadModule,
  BtnContentFeedbackModule,
  BtnContentLikeModule,
  BtnContentMailMeModule,
  BtnContentShareModule,
  BtnFullscreenModule,
  BtnGoalsModule,
  BtnMailUserModule,
  BtnPageBackNavModule,
  BtnPageBackModule,
  BtnPlaylistModule,
  BtnPreviewModule,
  BtnSettingsModule,
  CardBreadcrumbModule,
  CardContentModule,
  CardChannelModule,
  CardWelcomeModule,
  CardNetworkModule,
  ChannelHubModule,
  CardHomeTopModule,
  CardBrowseCourseModule,
  CardTableModule,
  ContentStripMultipleModule,
  ContentStripSingleModule,
  // ContentStripVerticalModule,
  GraphGeneralModule,
  LayoutLinearModule,
  LayoutTabModule,
  PickerContentModule,
  PlayerAmpModule,
  PlayerAudioModule,
  PlayerPdfModule,
  PlayerSlidesModule,
  PlayerVideoModule,
  PlayerWebPagesModule,
  PlayerYoutubeModule,
  ReleaseNotesModule,
  SlidersModule,
  ElementHtmlModule,
  TreeModule,
  TreeCatalogModule,
  PageModule,
  EmbeddedPageModule,
  SelectorResponsiveModule,
  DiscussionForumModule,
  GridLayoutModule,
  ErrorResolverModule,
  BtnFeatureModule,
  GalleryViewModule,
  ImageMapResponsiveModule,
  IntranetSelectorModule,
  SlidersMobModule,
  CardHubsListModule,
  CardNetworkHomeModule,
  CardActivityModule,
  // ActivityStripMultipleModule,
  UIAdminTableModule,
  LeftMenuModule,
  UIORGTableModule,
  BreadcrumbsOrgModule,
  BtnPageBackModuleAdmin,
  WIDGET_REGISTRATION_CONFIG,
} from '@sunbird-cb/collection'
// import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { LoggerService, PipeSafeSanitizerModule } from '@sunbird-cb/utils'
import { SearchModule } from '@ws/app/src/public-api'
import 'hammerjs'
// import { KeycloakAngularModule } from 'keycloak-angular'
import { AppRoutingModule } from './app-routing.module'
import { InitService } from './services/init.service'
import { GlobalErrorHandlingService } from './services/global-error-handling.service'
import { RootComponent } from './component/root123/root.component'
import { LoginComponent } from './component/login/login.component'
import { AppFooterComponent } from './component/app-footer/app-footer.component'
import { AppNavBarComponent } from './component/app-nav-bar/app-nav-bar.component'
import { AppPublicNavBarComponent } from './component/app-public-nav-bar/app-public-nav-bar.component'
import { DialogConfirmComponent } from './component/dialog-confirm/dialog-confirm.component'
import { InvalidUserComponent } from './component/invalid-user/invalid-user.component'
import { LoginRootComponent } from './component/login-root/login-root.component'
import { LoginRootDirective } from './component/login-root/login-root.directive'
import { TncRendererComponent } from './component/tnc-renderer/tnc-renderer.component'
import { MobileAppModule } from './routes/public/mobile-app/mobile-app.module'
import { PublicAboutModule } from './routes/public/public-about/public-about.module'
import { PublicContactModule } from './routes/public/public-contact/public-contact.module'
import { PublicFaqModule } from './routes/public/public-faq/public-faq.module'
import { TncComponent } from './routes/tnc/tnc.component'
import { AppInterceptorService } from './services/app-interceptor.service'
import { AppRetryInterceptorService } from './services/app-retry-interceptor.service'
import { TncAppResolverService } from './services/tnc-app-resolver.service'
import { TncPublicResolverService } from './services/tnc-public-resolver.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { environment } from '../environments/environment'
import { PublicLogoutModule } from './routes/public/public-logout/public-logout.module'
import { PublicHomeComponent } from './routes/public/public-home/public-home.component'

/** Improt from Sunbird Collection */

// import { AvatarPhotoModule } from '@sunbird-cb/collection'
// import { AuthorCardModule } from '@sunbird-cb/collection'
// import { AtGlanceModule } from '@sunbird-cb/collection'
// import { BtnAppsModule } from '@sunbird-cb/collection'
// import { BtnCallModule } from '@sunbird-cb/collection'
// import { BtnCatalogModule } from '@sunbird-cb/collection'
// import { BtnChannelAnalyticsModule } from '@sunbird-cb/collection'
// import { BtnContentDownloadModule } from '@sunbird-cb/collection'
// import { BtnContentFeedbackModule } from '@sunbird-cb/collection'
// import { BtnContentLikeModule } from '@sunbird-cb/collection'
// import { BtnContentMailMeModule } from '@sunbird-cb/collection'
// import { BtnContentShareModule } from '@sunbird-cb/collection'
// import { BtnFullscreenModule } from '@sunbird-cb/collection'
// import { BtnGoalsModule } from '@sunbird-cb/collection'
// import { BtnMailUserModule } from '@sunbird-cb/collection'
// import { BtnPageBackNavModule } from '@sunbird-cb/collection'
// import { BtnPageBackModule } from '@sunbird-cb/collection'
// import { BtnPlaylistModule } from '@sunbird-cb/collection'
// import { BtnPreviewModule } from '@sunbird-cb/collection'
// import { BtnSettingsModule } from '@sunbird-cb/collection'
// import { CardBreadcrumbModule } from '@sunbird-cb/collection'
// import { CardContentModule } from '@sunbird-cb/collection'
// import { CardChannelModule } from '@sunbird-cb/collection'
// import { CardWelcomeModule } from '@sunbird-cb/collection'
// import { CardNetworkModule } from '@sunbird-cb/collection'
// import { ChannelHubModule } from '@sunbird-cb/collection'
// import { CardHomeTopModule } from '@sunbird-cb/collection'
// import { CardBrowseCourseModule } from '@sunbird-cb/collection'
// import { CardTableModule } from '@sunbird-cb/collection'
// import { ContentStripMultipleModule } from '@sunbird-cb/collection'
// import { ContentStripSingleModule } from '@sunbird-cb/collection'
// // import { ContentStripVerticalModule } from '@sunbird-cb/collection'
// import { GraphGeneralModule } from '@sunbird-cb/collection'
// import { LayoutLinearModule } from '@sunbird-cb/collection'
// import { LayoutTabModule } from '@sunbird-cb/collection'
// import { PickerContentModule } from '@sunbird-cb/collection'
// import { PlayerAmpModule } from '@sunbird-cb/collection'
// import { PlayerAudioModule } from '@sunbird-cb/collection'
// import { PlayerPdfModule } from '@sunbird-cb/collection'
// import { PlayerSlidesModule } from '@sunbird-cb/collection'
// import { PlayerVideoModule } from '@sunbird-cb/collection'
// import { PlayerWebPagesModule } from '@sunbird-cb/collection'
// import { PlayerYoutubeModule } from '@sunbird-cb/collection'
// import { ReleaseNotesModule } from '@sunbird-cb/collection'
// import { SlidersModule } from '@sunbird-cb/collection'
// import { ElementHtmlModule } from '@sunbird-cb/collection'
// import { TreeModule } from '@sunbird-cb/collection'
// import { TreeCatalogModule } from '@sunbird-cb/collection'
// import { PageModule } from '@sunbird-cb/collection'
// import { EmbeddedPageModule } from '@sunbird-cb/collection'
// import { SelectorResponsiveModule } from '@sunbird-cb/collection'
// import { DiscussionForumModule } from '@sunbird-cb/collection'
// import { GridLayoutModule } from '@sunbird-cb/collection'
// import { ErrorResolverModule } from '@sunbird-cb/collection'
// import { BtnFeatureModule } from '@sunbird-cb/collection'
// import { GalleryViewModule } from '@sunbird-cb/collection'
// import { ImageMapResponsiveModule } from '@sunbird-cb/collection'
// import { IntranetSelectorModule } from '@sunbird-cb/collection'
// import { SlidersMobModule } from '@sunbird-cb/collection'
// import { CardHubsListModule } from '@sunbird-cb/collection'
// import { CardNetworkHomeModule } from '@sunbird-cb/collection'
// import { CardActivityModule } from '@sunbird-cb/collection'
// import { LeftMenuModule } from '@sunbird-cb/collection'
// import { UIORGTableModule } from '@sunbird-cb/collection'
// import { BreadcrumbsOrgModule } from '@sunbird-cb/collection'
// import { BtnPageBackModuleAdmin } from '@sunbird-cb/collection'
// import { ServiceWorkerModule } from '@angular/service-worker'
// import { environment } from '../environments/environment'

// @Injectable()
// export class HammerConfig extends GestureConfig {
//   buildHammer(element: HTMLElement) {
//     return new GestureConfig({ touchAction: 'pan-y' }).buildHammer(element)
//   }
// }
const appInitializer = (initSvc: InitService, logger: LoggerService) => async () => {
  try {
    await initSvc.init()
  } catch (error) {
    logger.error('ERROR DURING APP INITIALIZATION >', error)
  }
}

const getBaseHref = (platformLocation: PlatformLocation): string => {
  return platformLocation.getBaseHrefFromDOM()
}

// tslint:disable-next-line: max-classes-per-file
@NgModule({
  declarations: [
    RootComponent,
    LoginComponent,
    AppNavBarComponent,
    AppPublicNavBarComponent,
    TncComponent,
    TncRendererComponent,
    AppFooterComponent,
    InvalidUserComponent,
    DialogConfirmComponent,
    LoginRootComponent,
    LoginRootDirective,
    PublicHomeComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserAnimationsModule,
    // KeycloakAngularModule,
    AppRoutingModule,
    AvatarPhotoModule,
    AuthorCardModule,
    AtGlanceModule,
    BtnAppsModule,
    BtnCallModule,
    BtnCatalogModule,
    BtnChannelAnalyticsModule,
    BtnContentDownloadModule,
    BtnContentFeedbackModule,
    BtnContentLikeModule,
    BtnContentMailMeModule,
    BtnContentShareModule,
    BtnFullscreenModule,
    BtnGoalsModule,
    BtnMailUserModule,
    BtnPageBackNavModule,
    BtnPageBackModule,
    BtnPlaylistModule,
    BtnPreviewModule,
    BtnSettingsModule,
    CardBreadcrumbModule,
    CardContentModule,
    CardChannelModule,
    CardWelcomeModule,
    CardNetworkModule,
    ChannelHubModule,
    CardHomeTopModule,
    CardBrowseCourseModule,
    CardTableModule,
    ContentStripMultipleModule,
    ContentStripSingleModule,
    // ContentStripVerticalModule,
    GraphGeneralModule,
    LayoutLinearModule,
    LayoutTabModule,
    PickerContentModule,
    PlayerAmpModule,
    PlayerAudioModule,
    PlayerPdfModule,
    PlayerSlidesModule,
    PlayerVideoModule,
    PlayerWebPagesModule,
    PlayerYoutubeModule,
    ReleaseNotesModule,
    SlidersModule,
    ElementHtmlModule,
    TreeModule,
    TreeCatalogModule,
    PageModule,
    EmbeddedPageModule,
    SelectorResponsiveModule,
    DiscussionForumModule,
    GridLayoutModule,
    ErrorResolverModule,
    BtnFeatureModule,
    GalleryViewModule,
    ImageMapResponsiveModule,
    IntranetSelectorModule,
    SlidersMobModule,
    CardHubsListModule,
    CardNetworkHomeModule,
    CardActivityModule,
    // ActivityStripMultipleModule,
    UIAdminTableModule,
    LeftMenuModule,
    UIORGTableModule,
    BreadcrumbsOrgModule,
    BtnPageBackModuleAdmin,
    // ...WIDGET_REGISTERED_MODULES,
    // WidgetResolverModule.forRoot(WIDGET_REGISTRATION_CONFIG),
    StickyHeaderModule,
    ErrorResolverModule,
    // Material Imports
    MatSliderModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatRippleModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    SearchModule,
    BtnFeatureModule,
    PublicAboutModule,
    PublicContactModule,
    PublicFaqModule,
    MobileAppModule,
    PublicLogoutModule,
    PipeSafeSanitizerModule,
    TourModule,
    WidgetResolverModule.forRoot(WIDGET_REGISTRATION_CONFIG),
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  exports: [
    TncComponent,
  ],
  bootstrap: [RootComponent],
  providers: [
    { provide: 'environment', useValue: environment },
    {
      deps: [InitService, LoggerService],
      multi: true,
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 5000 },
    },
    {
      provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,
      useValue: {
        diameter: 55,
        strokeWidth: 4,
      },
    },
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AppRetryInterceptorService, multi: true },
    TncAppResolverService,
    TncPublicResolverService,
    PipeContentRoutePipe,
    // AppTocResolverService,
    {
      provide: APP_BASE_HREF,
      useFactory: getBaseHref,
      deps: [PlatformLocation],
    },
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
    // { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig },
    { provide: ErrorHandler, useClass: GlobalErrorHandlingService },
  ]
})
export class AppModule { }
