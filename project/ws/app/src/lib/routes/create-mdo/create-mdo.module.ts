import { NgModule } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { CreateMDORoutingModule } from './create-mdo-routing.module'
import { HomeComponent } from './routes/home/home.component'
import { BtnPageBackModuleAdmin, LeftMenuModule, GroupCheckboxModule, ScrollspyLeftMenuModule } from '@sunbird-cb/collection'
import { HomeModule } from '../home/home.module'
import { RouterModule } from '@angular/router'
import { UsersComponent } from './routes/users/users.component'
import { UsersService } from './services/users.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatDialogModule } from '@angular/material/dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { RolesAccessComponent } from '../access/routes/roles-access/roles-access.component'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { UIAdminTableModule } from '../../head/ui-admin-table/ui-admin-table.module'
import { MentorManageComponent } from './mentor-manage/mentor-manage.component'
import { SearchComponent } from './search/search.component'
import { UserCardComponent } from './user-cards/user-card.component'
import { AvatarPhotoModule } from './avatar-photo/avatar-photo.module'
import { PipeOrderByModule } from '../home/pipes/pipe-order-by/pipe-order-by.module'
import { LoaderService } from '../home/services/loader.service'
import { GradeSettingComponent } from './routes/grade-setting/grade-setting.component'
import { DesignationModule } from './routes/designation/designation.module'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'

@NgModule({
  declarations: [HomeComponent, UsersComponent, RolesAccessComponent, MentorManageComponent, SearchComponent, UserCardComponent, GradeSettingComponent],
  imports: [CommonModule, CreateMDORoutingModule, BtnPageBackModuleAdmin, LeftMenuModule, WidgetResolverModule,
    MatSidenavModule, MatIconModule, MatProgressSpinnerModule, GroupCheckboxModule, HomeModule, RouterModule, UIAdminTableModule, MatCardModule,
    ScrollspyLeftMenuModule, FormsModule, MatSelectModule, MatChipsModule, MatDatepickerModule, MatAutocompleteModule,
    MatExpansionModule, MatSlideToggleModule, MatOptionModule, MatFormFieldModule, MatPaginatorModule, MatListModule, MatRadioModule, MatDialogModule,
    ReactiveFormsModule, PipeOrderByModule, AvatarPhotoModule, DesignationModule, MatSnackBarModule, MatCheckboxModule],
  exports: [UsersComponent, RolesAccessComponent, MentorManageComponent, SearchComponent, UserCardComponent, AvatarPhotoModule, DesignationModule],
  providers: [UsersService, LoaderService, DatePipe],
})
export class CreateMDOModule { }
