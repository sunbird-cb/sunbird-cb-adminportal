import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InfoModalComponent } from './info-modal.component'
import { MatDialogModule } from '@angular/material/dialog'

@NgModule({
  declarations: [InfoModalComponent],
  imports: [
    CommonModule, MatDialogModule
  ]
})
export class InfoModalModule { }
