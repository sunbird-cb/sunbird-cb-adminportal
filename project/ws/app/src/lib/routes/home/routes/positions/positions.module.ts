import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule, MatTooltipModule } from '@angular/material'
import { RouterModule } from '@angular/router'
import { UIAdminTableModule, UIORGTableModule } from '@sunbird-cb/collection'
import { PositionsApprovalListComponent } from './components/positions-approval-list/positions-approval-list.component'
import { PositionsHomeComponent } from './components/positions-home/positions-home.component'
import { PositionsListComponent } from './components/positions-list/positions-list.component'
import { PositionsNewComponent } from './components/positions-new/positions-new.component'
import { PositionsRoutingModule } from './positions-routing.module'
import { PositionsService } from './services/position.service'

@NgModule({
  declarations: [
    PositionsHomeComponent,
    PositionsListComponent,
    PositionsApprovalListComponent,
    PositionsNewComponent,
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PositionsRoutingModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    RouterModule,
    MatCardModule,
    UIORGTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    UIAdminTableModule,
  ],
  providers: [
    PositionsService,
    // CKEditorService,
    // LoaderService,
    // InitResolver,
  ],
})
export class PositionsModule {

}
