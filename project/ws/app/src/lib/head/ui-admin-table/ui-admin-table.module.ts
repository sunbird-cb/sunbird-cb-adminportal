import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UIAdminUserTableComponent } from './user-list/ui-admin-user-table.component'
import { UIUserTablePopUpComponent } from './user-list-popup/ui-user-table-pop-up.component'
import { UIDirectoryTableComponent } from './directory-list/directory-table.component'
import { UIDiscussionPostComponent } from './discussion-list/discussion-post.component'
import { DialogTextProfanityComponent } from './discussion-list/discussion-post-popup.component'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatSortModule } from '@angular/material/sort'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatIconModule } from '@angular/material/icon'
import { AppButtonModule } from '../app-button/app-button.module'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { DefaultThumbnailModule, PipeCountTransformModule, PipeDurationTransformModule, PipeHtmlTagRemovalModule, PipePartialContentModule } from '@sunbird-cb/utils'
import { BtnChannelAnalyticsModule } from '../btn-channel-analytics/btn-channel-analytics.module'
import { BtnContentFeedbackV2Module } from '../btn-content-feedback-v2/btn-content-feedback-v2.module'
// import { BtnContentLikeModule } from '../btn-content-like/btn-content-like.module'
// import { BtnContentMailMeModule } from '../btn-content-mail-me/btn-content-mail-me.module'
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator'
import { UserPopupComponent } from './user-popup/user-popup'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { ImageCropperModule } from 'ngx-image-cropper'
import { ReverseDateFormatPipe } from './user-list/reverse-date-format.pipe'
import { CreateOrganisationComponent } from './create-organisation/create-organisation.component'
import { MatSidenavModule } from '@angular/material/sidenav'
import { InfoModalModule } from '../info-modal/info-modal.module'
import { CustomSelfRegistrationComponent } from './custom-self-registration/custom-self-registration.component'
// import { BtnPageBackModule } from '../btn-page-back/btn-page-back.module'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatLegacyProgressSpinnerModule as MatProgressBarModule } from '@angular/material/legacy-progress-spinner'
import { ClipboardModule } from '@angular/cdk/clipboard'
import { LoaderService } from '../../routes/home/services/loader.service'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { MAT_DATE_LOCALE } from '@angular/material/core'
@NgModule({
  declarations: [
    UIAdminUserTableComponent,
    UIDirectoryTableComponent,
    UserPopupComponent,
    UIUserTablePopUpComponent,
    UIDiscussionPostComponent,
    DialogTextProfanityComponent,
    ReverseDateFormatPipe,
    CreateOrganisationComponent,
    CustomSelfRegistrationComponent
  ],
  imports: [
    AppButtonModule,
    CommonModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    DefaultThumbnailModule, PipeCountTransformModule,
    PipeDurationTransformModule, PipeHtmlTagRemovalModule,
    PipePartialContentModule,
    BtnChannelAnalyticsModule,
    BtnContentFeedbackV2Module,
    MatPaginatorModule,
    MatDialogModule, MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    MatRadioModule,
    MatInputModule, MatOptionModule, MatSelectModule, ReactiveFormsModule,
    MatChipsModule,
    ImageCropperModule,
    MatSidenavModule,
    InfoModalModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatProgressBarModule,
    ClipboardModule,
    MatAutocompleteModule
    // MatRadioButton, MatRadioGroup
  ],
  exports: [
    UIAdminUserTableComponent,
    UIDirectoryTableComponent,
    UIUserTablePopUpComponent,
    UIDiscussionPostComponent,
    ReverseDateFormatPipe
  ],
  providers: [LoaderService, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class UIAdminTableModule { }
