
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BtnPageBackModule, GroupCheckboxModule, UIAdminTableModule } from '@sunbird-cb/collection'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { HomeModule } from '../home/home.module'
import { RouterModule } from '@angular/router'
import { UsersService } from './services/users.service'
import {
  MatSidenavModule,
  MatIconModule,
  MatProgressBarModule,
} from '@angular/material'
import { MatCardModule } from '@angular/material/card'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@NgModule({
  imports: [CommonModule, BtnPageBackModule, WidgetResolverModule, MatProgressSpinnerModule, MatProgressBarModule,
    MatSidenavModule, MatIconModule, GroupCheckboxModule, HomeModule, RouterModule, UIAdminTableModule, MatCardModule],
  providers: [UsersService],
})
export class AccessModule { }
