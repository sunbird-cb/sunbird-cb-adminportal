import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule, MatCardModule, MatIconModule } from '@angular/material'
import { RouterModule } from '@angular/router'
import { HorizontalScrollerModule } from '@sunbird-cb/utils'
import { FracComponent } from './components/frac/frac.component'
import { FracRoutingModule } from './frac-routing.module'

@NgModule({
  declarations: [FracComponent],
  imports: [
    CommonModule,
    FracRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    HorizontalScrollerModule,
  ],
})
export class FracModule { }
