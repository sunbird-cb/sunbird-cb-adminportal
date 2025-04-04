import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FaqHomeComponent } from './components/faq-home.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterModule } from '@angular/router'
import { BtnPageBackModule } from '@sunbird-cb/collection'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils'

@NgModule({
  declarations: [FaqHomeComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatListModule,
    MatSidenavModule,
    MatCardModule,
    MatDividerModule,
    RouterModule,
    MatIconModule,
    BtnPageBackModule,
    MatButtonModule,
    PipeSafeSanitizerModule,
  ],
  exports: [FaqHomeComponent],
})
export class FaqModule { }
