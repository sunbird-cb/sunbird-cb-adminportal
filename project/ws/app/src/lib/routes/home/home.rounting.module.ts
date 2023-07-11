import { ConfigResolveService } from './resolvers/config-resolver.service'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// import { InitResolver } from './resol./routes/profile-v2/discuss-all.component'
import { HomeResolve } from './resolvers/home-resolve'
import { HomeComponent } from './routes/home/home.component'
import { UsersViewComponent } from './routes/users-view/users-view.component'
import { RolesAccessComponent } from './routes/roles-access/roles-access.component'
import { DirectoryViewComponent } from './routes/directory/directroy.component'
import { CreateMdoComponent } from './routes/create-mdo/create-mdo.component'
import { CreateUserComponent } from './routes/create-user/create-user.component'
import { DepartmentResolve } from './resolvers/department-resolve'
import { RolesResolver } from './resolvers/roles-resolver.service'
// import { PageResolve } from '@sunbird-cb/utils'
import { ModerationViewComponent } from './routes/moderation/moderation.component'
import { RolesUsersComponent } from './routes/roles-users/roles-users.component'
import { ReportsComponent } from './routes/reports/reports.component'
import { OnboardingRequestsComponent } from './routes/onboarding-requests/onboarding-requests.component'
import { RequestsApprovalComponent } from './routes/requests-approval/requests-approval.component'
import { RequestsResolve } from './resolvers/requests-resolver.service'
import { ApprovedRequestsResolve } from './resolvers/approvedrequests-resolver.service'
import { RejectedRequestsResolve } from './resolvers/rejectedrequests-reoslver.service'
import { ApprovedlistResolve } from './resolvers/positionlist-resolver.service'

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'app/home/directory/mdo',
    // pathMatch: 'full',
    component: HomeComponent,
    resolve: {
      department: DepartmentResolve,
      configService: ConfigResolveService,
    },
    data: {
      pageId: '',
      module: '',
      pageType: 'feature',
      pageKey: 'directory',
    },
    children: [
      {
        path: 'users',
        component: UsersViewComponent,
        children: [],
        data: {
          pageId: 'home/users',
          module: 'user',
          pageType: 'feature',
          pageKey: 'Users',
        },
      },
      {
        path: '',
        redirectTo: 'directory/mdo',
        // redirectTo: 'users/active',
        component: DirectoryViewComponent,
        // component: UsersViewComponent,
        children: [],
        data: {
          pageId: '',
          module: '',
          pageType: 'feature',
          pageKey: 'Directory',
        },
      },
      {
        path: 'roles-access',
        component: RolesAccessComponent,
        resolve: {
          rolesList: RolesResolver,
        },
        data: {
          pageId: 'home/roles-access',
          module: 'roles-access',
          pageType: 'feature',
          pageKey: 'RolesAndAccess',
        },
      },
      {
        path: 'roles-users',
        component: RolesUsersComponent,
        resolve: {
          rolesList: RolesResolver,
        },
        data: {
          pageId: 'home/roles-users',
          module: 'roles-users',
          pageType: 'feature',
          pageKey: 'RolesAndAccess',
        },
      },
      {
        path: 'directory/:tab',
        data: {
          pageId: 'home/directory',
          module: 'Home',
          pageType: 'feature',
          pageKey: 'Directory',
        },
        component: DirectoryViewComponent,
      },
      {
        path: 'directory',
        // pathMatch: 'full',
        redirectTo: 'directory/mdo',
        component: DirectoryViewComponent,
        data: {
          // pageId: 'app/directory',
          module: 'directory',
          pageType: 'feature',
          pageKey: 'Directory',
        },
      },
      {
        path: 'moderation',
        component: ModerationViewComponent,
        // data: {
        //   pageId: 'app/moderation',
        //   module: 'diremoderationctory',
        //   pageType: 'feature',
        //   pageKey: 'Moderation',
        // },
        // resolve: {
        //   rolesList: RolesResolver,
        // },
      },
      {
        path: ':department/create-department',
        component: CreateMdoComponent,
        data: {
          pageId: 'app/create-department',
          module: 'create-department',
          pageType: 'feature',
          pageKey: 'createDepartment',
        },
      },
      {
        path: 'create-user',
        component: CreateUserComponent,
        children: [],
        data: {
          pageId: 'app/create-user',
          module: 'create-user',
          pageType: 'feature',
          pageKey: 'createUser',
        },
        resolve: {
          configService: ConfigResolveService,
        },
      },
      {
        path: 'requests/:type/new',
        component: RequestsApprovalComponent,
        data: {
          pageId: 'app/requests-new',
          module: 'requests',
          pageType: 'feature',
          pageKey: 'Requests',
        },
      },
      {
        path: 'requests/:type',
        data: {
          pageId: 'app/requests',
          module: 'home',
          pageType: 'feature',
          pageKey: 'Requests',
        },
        resolve: {
          requestsList: RequestsResolve,
          aprovedrequestsList: ApprovedRequestsResolve,
          rejectedList: RejectedRequestsResolve,
          positionsList: ApprovedlistResolve
        },
        runGuardsAndResolvers: 'always',
        component: OnboardingRequestsComponent,
      },
      {
        path: 'requests',
        redirectTo: 'requests/:type',
        component: OnboardingRequestsComponent,
        data: {
          pageId: 'app/requests',
          module: 'requests',
          pageType: 'feature',
          pageKey: 'Requests',
        },
      },
      {
        path: 'requests-approval',
        component: RequestsApprovalComponent,
        data: {
          pageId: 'app/requests',
          module: 'requests',
          pageType: 'feature',
          pageKey: 'Requests',
        },
      },
      // {
      //   path: 'positions',
      //   loadChildren: () => import('./routes/positions/positions.module').then(u => u.PositionsModule),
      //   data: {
      //     pageId: 'app/positions',
      //     module: 'positions',
      //     pageType: 'feature',
      //     pageKey: 'positions',
      //   },
      // },
      {
        path: 'reports',
        component: ReportsComponent,
        data: {
          pageId: 'app/reports',
          module: 'reports',
          pageType: 'feature',
          pageKey: 'Reports',
        },
      },
      {
        path: 'reports/:tab',
        data: {
          pageId: 'app/reports',
          module: 'reports',
          pageType: 'feature',
          pageKey: 'Reports',
        },
        component: ReportsComponent,
      },
      {
        path: '',
        redirectTo: 'directory',
        pathMatch: 'full',
      },
    ],
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    HomeResolve,
    DepartmentResolve,
    ConfigResolveService,
    RolesResolver,
    RequestsResolve,
    ApprovedRequestsResolve,
    RejectedRequestsResolve,
    ApprovedlistResolve
  ],
})
export class HomeRoutingModule { }
