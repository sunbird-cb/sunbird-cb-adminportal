import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FeaturesComponent } from './features.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { BtnFeatureModule, BtnPageBackModule } from '@sunbird-cb/collection'
import { LogoutModule } from '@sunbird-cb/utils'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
// import { AccessControlService } from '../../../../project/ws/author/src/public-api'

@NgModule({
  declarations: [FeaturesComponent],
  imports: [
    CommonModule,
    FormsModule,
    BtnFeatureModule,
    BtnPageBackModule,
    LogoutModule,
    WidgetResolverModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCardModule,
  ],
  exports: [FeaturesComponent],
  providers: [
    // AccessControlService
  ],
})
export class FeaturesModule { }
