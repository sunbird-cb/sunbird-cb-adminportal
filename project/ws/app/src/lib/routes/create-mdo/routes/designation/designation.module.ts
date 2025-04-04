import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { DesignationsComponent } from './components/designations/designations.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyCheckboxModule as MatCheckboxModul } from '@angular/material/legacy-checkbox'
import { MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatTableModule } from '@angular/material/table'
import { UIORGTableModule } from '@sunbird-cb/collection'
import { PageResolve, PipeOrderByModule } from '@sunbird-cb/utils'
import { BulkUploadComponent } from './components/bulk-upload/bulk-upload.component'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { ConfigResolveService } from '../../../home/resolvers/config-resolver.service'
import { ImportDesignationComponent } from './components/import-designation/import-designation.component'
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DesignationsComponent,
    data: {
      pageId: '',
      module: '',
      pageType: 'feature',
      pageKey: 'my_designations',
    },
    resolve: {
      configService: ConfigResolveService,
      pageData: PageResolve,
    },
  },
  {
    path: 'import-designation',
    pathMatch: 'full',
    data: {
      pageId: '',
      module: '',
      pageType: 'feature',
      pageKey: 'my_designations',
    },
    component: ImportDesignationComponent,
    resolve: {
      configService: ConfigResolveService,
      pageData: PageResolve,
    },
  },
  // {
  //   path: 'bulk-upload',
  //   pathMatch: 'full',
  //   data: {
  //     pageId: 'home/odcs-mapping',
  //     module: 'odcs-mapping',
  //     pageType: 'feature',
  //     pageKey: 'my_designations',
  //   },
  //   component: BulkUploadComponent,
  //   resolve: {
  //     configService: ConfigResolveService,
  //     pageData: PageResolve,
  //   },
  // },
]

@NgModule({
  declarations: [
    DesignationsComponent,
    ImportDesignationComponent,
    BulkUploadComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModul,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    UIORGTableModule,
    MatPaginatorModule,
    MatDialogModule,
    PipeOrderByModule,
    MatTooltipModule,
  ],

  exports: [
    RouterModule,
    DesignationsComponent,
    ImportDesignationComponent,
    BulkUploadComponent,
  ],
})
export class DesignationModule { }
