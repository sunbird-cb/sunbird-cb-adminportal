import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PublicFaqComponent } from './public-faq.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterModule } from '@angular/router'
import { BtnPageBackModule } from '@sunbird-cb/collection'

@NgModule({
  declarations: [PublicFaqComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    RouterModule,
    BtnPageBackModule,
    MatButtonModule,
  ],
  exports: [PublicFaqComponent],
})
export class PublicFaqModule { }
