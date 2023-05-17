import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeFilterModule, PipeHtmlTagRemovalModule, PipeOrderByModule, PipeRelativeTimeModule, ImageCropModule } from '@sunbird-cb/utils'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDividerModule } from '@angular/material/divider'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import {
  MatIconModule,
  MatListModule,
  MatFormFieldModule,
  MatDialogModule,
  MatSelectModule,
  MatInputModule,
  MatButtonModule,
  MatSidenavModule,
  MatChipsModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatCheckboxModule,
  MatAutocompleteModule,
} from '@angular/material'
import { MatCardModule } from '@angular/material/card'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { InitResolver } from './resolvers/init-resolve.service'
import { RouterModule } from '@angular/router'
import { HomeRoutingModule } from './home.rounting.module'
import { HomeComponent } from './routes/home/home.component'
import { UsersViewComponent } from './routes/users-view/users-view.component'
import { AvatarPhotoModule, BtnPageBackModuleAdmin, UserAutocompleteModule, BreadcrumbsOrgModule, UIORGTableModule } from '@sunbird-cb/collection'
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
@NgModule({
  declarations: [
    HomeComponent,
    UsersViewComponent,
    AboutComponent,
    RolesAccessComponent,
    DirectoryViewComponent,
    OnboardingRequestsComponent,
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
    MatSidenavModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    PipeFilterModule,
    PipeHtmlTagRemovalModule,
    PipeRelativeTimeModule,
    AvatarPhotoModule,
    BreadcrumbsOrgModule,
    PipeOrderByModule,
    BtnPageBackModuleAdmin,
    WidgetResolverModule,
    UserAutocompleteModule,
    ImageCropModule,
    UIAdminTableModule,
    UIORGTableModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  entryComponents: [UserPopupComponent, OpenRolesDialogComponent, EditDepartmentDialogComponent],
  providers: [
    // CKEditorService,
    // LoaderService,
    InitResolver,
  ],
})
export class HomeModule {

}
