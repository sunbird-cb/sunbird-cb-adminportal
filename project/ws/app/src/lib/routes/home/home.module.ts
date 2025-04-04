import { CommsComponent } from './routes/comms/comms.component'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { PipeFilterModule, PipeHtmlTagRemovalModule, PipeOrderByModule, PipeRelativeTimeModule } from '@sunbird-cb/utils'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDividerModule } from '@angular/material/divider'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatSortModule } from '@angular/material/sort'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { InitResolver } from './resolvers/init-resolve.service'
import { RouterModule } from '@angular/router'
import { HomeRoutingModule } from './home.rounting.module'
import { HomeComponent } from './routes/home/home.component'
import { UsersViewComponent } from './routes/users-view/users-view.component'
import {
    AvatarPhotoModule,
    BtnPageBackModuleAdmin,
    UserAutocompleteModule,
    BreadcrumbsOrgModule,
    UIORGTableModule,
    ScrollspyLeftMenuModule,
} from '@sunbird-cb/collection'
// TO-DO need to enable for image crop
// import { ImageCropModule } from './routes/image-crop/image-crop.module'
import { AboutComponent } from './routes/about/about.component'
import { RolesAccessComponent } from './routes/roles-access/roles-access.component'
import { DirectoryViewComponent } from './routes/directory/directroy.component'
import { CreateMdoComponent } from './routes/create-mdo/create-mdo.component'
import { UserPopupComponent } from './routes/user-popup/user-popup'
import { UsersComponent } from './routes/users/users.component'
import { OpenRolesDialogComponent } from './routes/users/components/open-roles-dialog/open-roles-dialog.component'
import { EditDepartmentDialogComponent } from './routes/users/components/edit-department-dialog/edit-department-dialog.component'
import { CreateUserComponent } from './routes/create-user/create-user.component'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'
import { UIAdminTableModule } from '../../head/ui-admin-table/ui-admin-table.module'
import { ModerationViewComponent } from './routes/moderation/moderation.component'
import { RolesUsersComponent } from './routes/roles-users/roles-users.component'
import { ReportsComponent } from './routes/reports/reports.component'
import { PositionsModule } from './routes/positions/positions.module'
import { OnboardingRequestsComponent } from './routes/onboarding-requests/onboarding-requests.component'
import { RequestsApprovalComponent } from './routes/requests-approval/requests-approval.component'
import { AcsendingOrderPipe } from './pipes/acsending-order.pipe'
import { RejectReasonDialogComponent } from './routes/reject-reason-dialog/reject-reason-dialog.component'
import { EmailDomainsComponent } from './routes/email-domains/email-domains.component'
import { EventsListComponent } from './routes/events/events-list/events-list.component'
import { EventListViewComponent } from './routes/events/event-list-view/event-list-view.component'
import { EventThumbnailComponent } from './routes/events/event-thumbnail/event-thumbnail.component'
import { CreateEventComponent } from './routes/events/create-event/create-event.component'
import { ParticipantsComponent } from './routes/events/participants/participants.component'
import { SuccessComponent } from './routes/events/success/success.component'
import { PipeEmailPipe } from './pipes/pipe-email.pipe'
import { EditEventComponent } from './routes/events/edit-event/edit-event.component'
import { PipePublicURLModule } from './pipes/pipe-public-URL/pipe-public-URL.module'
import { AcbpReportsComponent } from './routes/acbp-reports/acbp-reports.component'
import { GeneralReportsComponent } from './routes/general-reports/general-reports.component'
import { SectorsComponent } from './routes/sectors/sectors.component'
import { SectorListViewComponent } from './routes/sectors/sector-list-view/sector-list-view.component'
import { AddSectorComponent } from './routes/sectors/add-sector/add-sector.component'
import { EditSectorComponent } from './routes/sectors/edit-sector/edit-sector.component'
import { AddThumbnailComponent } from './routes/add-thumbnail/add-thumbnail.component'
import { AllRequestComponent } from './routes/request/all-request/all-request.component'
import { RequestCopyDetailsComponent } from './routes/request/request-copy-details/request-copy-details.component'
import { CompetencyViewComponent } from './routes/request/competency-view/competency-view.component'
import { ConfirmationPopupComponent } from './routes/request/confirmation-popup/confirmation-popup.component'
import { AssignListPopupComponent } from './routes/request/assign-list-popup/assign-list-popup.component'
import { KCMMappingComponent } from './routes/kcm-mapping/kcm-mapping.component'
import { TaxonomyEditorModule } from '@sunbird-cb/taxonomy-editor'
import { SingleAssignPopupComponent } from './routes/request/single-assign-popup/single-assign-popup.component'
import { DemoVideoPopupComponent } from './components/demo-video-popup/demo-video-popup.component'
import { PublicGcpUrlPipe } from './pipes/public-gcp-url.pipe'
import { SurveyComponent } from './routes/survey/survey.component'
import { SurveyListComponent } from './routes/survey/survey-list/survey-list.component'
import { SolutionSurveyUploadComponent } from './components/solution-survey-upload/solution-survey-upload.component'
import { CapitalizePipe } from './pipes/capitalize.pipe'
import { PipePublicURL } from './pipes/pipe-public-URL/pipe-public-URL.pipe'
import { ConfirmationBoxComponent } from './components/confirmation-box/confirmation.box.component'
import { SelectedDesignationPopupComponent } from './components/selected-designation-popup/selected-designation-popup.component'
import { ConformationPopupDesignationComponent } from './components/conformation-popup/conformation-popup-designation.component'
import { FileProgressComponent } from './components/file-progress/file-progress.component'
@NgModule({
    declarations: [
        HomeComponent,
        UsersViewComponent,
        AboutComponent,
        RolesAccessComponent,
        DirectoryViewComponent,
        OnboardingRequestsComponent,
        EmailDomainsComponent,
        RequestsApprovalComponent,
        CreateMdoComponent,
        UserPopupComponent,
        UsersComponent,
        OpenRolesDialogComponent,
        EditDepartmentDialogComponent,
        CreateUserComponent,
        ModerationViewComponent,
        RolesUsersComponent,
        ReportsComponent,
        CommsComponent,
        AcbpReportsComponent,
        GeneralReportsComponent,
        SectorsComponent,
        AddSectorComponent,
        EditSectorComponent,
        AddThumbnailComponent,
        EventsListComponent,
        EventListViewComponent,
        EventThumbnailComponent,
        CreateEventComponent,
        SectorListViewComponent,
        EditEventComponent,
        ParticipantsComponent,
        SuccessComponent,
        AcsendingOrderPipe,
        PipeEmailPipe,
        RejectReasonDialogComponent,
        AllRequestComponent,
        RequestCopyDetailsComponent,
        CompetencyViewComponent,
        ConfirmationPopupComponent,
        AssignListPopupComponent,
        KCMMappingComponent,
        SingleAssignPopupComponent,
        DemoVideoPopupComponent,
        PublicGcpUrlPipe,
        SurveyComponent,
        SurveyListComponent,
        SolutionSurveyUploadComponent,
        CapitalizePipe,
        ConfirmationBoxComponent,
        SelectedDesignationPopupComponent,
        ConformationPopupDesignationComponent,
        FileProgressComponent
    ],
    imports: [
        CommonModule,
        WidgetResolverModule,
        ReactiveFormsModule,
        HomeRoutingModule,
        PositionsModule,
        FormsModule,
        RouterModule,
        MatGridListModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatDividerModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        MatListModule,
        MatSelectModule,
        MatAutocompleteModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatSidenavModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        PipeFilterModule,
        MatDatepickerModule,
        MatNativeDateModule,
        PipeHtmlTagRemovalModule,
        PipeRelativeTimeModule,
        AvatarPhotoModule,
        BreadcrumbsOrgModule,
        PipeOrderByModule,
        BtnPageBackModuleAdmin,
        WidgetResolverModule,
        UserAutocompleteModule,
        MatTooltipModule,
        // TO-DO need to enable for image crop
        // ImageCropModule,
        UIAdminTableModule,
        UIORGTableModule,
        MatTableModule,
        MatSortModule,
        MatMenuModule,
        MatPaginatorModule,
        PipePublicURLModule,
        ScrollspyLeftMenuModule,
        MatRadioModule,
        MatTooltipModule,
        // TO-DO need to enable for image crop
        // ImageCropModule,
        NgMultiSelectDropDownModule.forRoot(),
        TaxonomyEditorModule,
    ],
    providers: [
        // CKEditorService,
        // LoaderService,
        InitResolver,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        MatDatepickerModule, MatNativeDateModule,
        ConfirmationPopupComponent, PipePublicURL,
        DatePipe
    ],
    exports: [AddThumbnailComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {
}
