import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PublicLogoutComponent } from './public-logout.component'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { BtnPageBackModule } from '@sunbird-cb/collection'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils'

@NgModule({
  declarations: [PublicLogoutComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    BtnPageBackModule,
    MatDividerModule,
    MatIconModule,
    MatExpansionModule,
    PipeSafeSanitizerModule,
  ],
  exports: [PublicLogoutComponent],
})
export class PublicLogoutModule { }
