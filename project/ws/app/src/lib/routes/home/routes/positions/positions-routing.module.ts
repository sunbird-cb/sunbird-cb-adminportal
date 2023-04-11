import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { ConfigResolveService } from "../../resolvers/config-resolver.service"
import { PositionsApprovalListComponent } from "./components/positions-approval-list/positions-approval-list.component"
import { PositionsHomeComponent } from "./components/positions-home/positions-home.component"
import { PositionsListComponent } from "./components/positions-list/positions-list.component"
import { PositionsNewComponent } from "./components/positions-new/positions-new.component"
import { PositionsResolve } from "./resolvers/positions-resolver.service"

const routes: Routes = [
  {
    path: '',
    component: PositionsHomeComponent,
    resolve: {
      configService: ConfigResolveService,
    },
    data: {
      pageId: 'app/home/positions',
      module: 'Positions',
      pageType: 'feature',
      pageKey: 'positions',
    },
    children: [{
      path: 'active-positions',
      component: PositionsListComponent,
      resolve: {
        positions: PositionsResolve
      }
    },
    {
      path: 'positions-for-approval',
      component: PositionsApprovalListComponent,
    },
    {
      path: 'new-position',
      component: PositionsNewComponent,
    },
    {
      path: '',
      redirectTo: 'positions-for-approval',
      pathMatch: 'full',

    },
    ],
  },


]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [PositionsResolve],
})

export class PositionsRoutingModule { }
