import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UIAdminUserTableComponent } from './user-list/ui-admin-user-table.component'
import { UIUserTablePopUpComponent } from './user-list-popup/ui-user-table-pop-up.component'
import { UIDirectoryTableComponent } from './directory-list/directory-table.component'
import { UIDiscussionPostComponent, DialogTextProfanity } from './discussion-list/discussion-post.component'
import { MatTableModule } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatSortModule } from '@angular/material/sort'
import { MatCardModule } from '@angular/material'
import { MatIconModule } from '@angular/material/icon'
import { AppButtonModule } from '../app-button/app-button.module'
import { MatMenuModule } from '@angular/material/menu'
import { DefaultThumbnailModule, PipeCountTransformModule, PipeDurationTransformModule, PipeHtmlTagRemovalModule, PipePartialContentModule } from '@sunbird-cb/utils'
import { BtnChannelAnalyticsModule } from '../btn-channel-analytics/btn-channel-analytics.module'
import { BtnContentFeedbackV2Module } from '../btn-content-feedback-v2/btn-content-feedback-v2.module'
// import { BtnContentLikeModule } from '../btn-content-like/btn-content-like.module'
// import { BtnContentMailMeModule } from '../btn-content-mail-me/btn-content-mail-me.module'
import { MatPaginatorModule } from '@angular/material/paginator'
import { UserPopupComponent } from './user-popup/user-popup'
import { MatDialogModule, MatButtonModule, MatCheckboxModule } from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatRadioModule } from '@angular/material/radio'
import { MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material'
import { } from '@angular/forms'
import { MatChipsModule } from '@angular/material/chips'
import { ImageCropperModule } from 'ngx-image-cropper'

// import { BtnPageBackModule } from '../btn-page-back/btn-page-back.module'
@NgModule({
  declarations: [UIAdminUserTableComponent, UIDirectoryTableComponent, UserPopupComponent, UIUserTablePopUpComponent, UIDiscussionPostComponent, DialogTextProfanity],
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
    // MatRadioButton, MatRadioGroup
  ],
  entryComponents: [UserPopupComponent, DialogTextProfanity],
  exports: [UIAdminUserTableComponent, UIDirectoryTableComponent, UIUserTablePopUpComponent, UIDiscussionPostComponent],
})
export class UIAdminTableModule { }
