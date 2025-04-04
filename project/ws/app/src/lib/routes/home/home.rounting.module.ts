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
import { PageResolve } from '@sunbird-cb/utils'
import { ModerationViewComponent } from './routes/moderation/moderation.component'
import { RolesUsersComponent } from './routes/roles-users/roles-users.component'
import { ReportsComponent } from './routes/reports/reports.component'
import { OnboardingRequestsComponent } from './routes/onboarding-requests/onboarding-requests.component'
import { RequestsApprovalComponent } from './routes/requests-approval/requests-approval.component'
import { RequestsResolve } from './resolvers/requests-resolver.service'
import { ApprovedRequestsResolve } from './resolvers/approvedrequests-resolver.service'
import { RejectedRequestsResolve } from './resolvers/rejectedrequests-reoslver.service'
import { ApprovedlistResolve } from './resolvers/positionlist-resolver.service'
import { EmailDomainsComponent } from './routes/email-domains/email-domains.component'
import { EventsListComponent } from './routes/events/events-list/events-list.component'
import { CreateEventComponent } from './routes/events/create-event/create-event.component'
import { EditEventComponent } from './routes/events/edit-event/edit-event.component'
import { CommsComponent } from './routes/comms/comms.component'
import { AcbpReportsComponent } from './routes/acbp-reports/acbp-reports.component'
import { SectorsComponent } from './routes/sectors/sectors.component'
import { AddSectorComponent } from './routes/sectors/add-sector/add-sector.component'
import { EditSectorComponent } from './routes/sectors/edit-sector/edit-sector.component'
import { AllRequestComponent } from './routes/request/all-request/all-request.component'
import { RequestCopyDetailsComponent } from './routes/request/request-copy-details/request-copy-details.component'
import { KCMMappingComponent } from './routes/kcm-mapping/kcm-mapping.component'
import { SurveyComponent } from './routes/survey/survey.component'

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
          module: 'Users',
          pageType: 'feature',
          pageKey: 'Users',
        },
      },
      {
        path: '',
        // redirectTo: 'directory/mdo',
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
        path: 'capacity-building-reports',
        component: AcbpReportsComponent,
        data: {
          pageId: 'home/capacity-building-reports',
          module: 'Acbpreports',
          pageType: 'feature',
          pageKey: 'CapacityBuildingReports',
        },
      },
      {
        path: 'comms-buckets',
        component: CommsComponent,
        data: {
          pageId: 'home/comms-buckets',
          module: 'Comms',
          pageType: 'feature',
          pageKey: 'CommsBuckets',
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
          module: 'Roles',
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
          module: 'Roles',
          pageType: 'feature',
          pageKey: 'RolesAndAccess',
        },
      },
      {
        path: 'directory/:tab',
        data: {
          pageId: 'home/directory',
          module: 'Directory',
          pageType: 'feature',
          pageKey: 'Directory',
        },
        component: DirectoryViewComponent,
      },
      {
        path: 'directory',
        // pathMatch: 'full',
        // redirectTo: 'directory/mdo',
        component: DirectoryViewComponent,
        data: {
          // pageId: 'app/directory',
          module: 'Directory',
          pageType: 'feature',
          pageKey: 'Directory',
        },
      },
      {
        path: 'organisation',
        // redirectTo: 'directory/organisation',
        component: DirectoryViewComponent,
        data: {
          module: 'Onboarding',
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
          module: 'Directory',
          pageType: 'feature',
          pageKey: 'createDepartment',
        },
      },
      {
        path: 'create-user',
        component: CreateUserComponent,
        children: [],
        data: {
          pageId: 'home/create-user',
          module: 'Users',
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
        path: 'requests/domain',
        data: {
          pageId: 'home/requests',
          module: 'Requests',
          pageType: 'feature',
          pageKey: 'Requests',
        },
        resolve: {
          requestsList: RequestsResolve,
        },
        runGuardsAndResolvers: 'always',
        component: EmailDomainsComponent,
      },
      {
        path: 'requests/:type',
        data: {
          pageId: 'home/requests',
          module: 'Requests',
          pageType: 'feature',
          pageKey: 'Requests',
        },
        resolve: {
          positionsList: ApprovedlistResolve,
          requestsList: RequestsResolve,
          aprovedrequestsList: ApprovedRequestsResolve,
          rejectedList: RejectedRequestsResolve,

        },
        runGuardsAndResolvers: 'always',
        component: OnboardingRequestsComponent,
      },
      {
        path: 'requests',
        // redirectTo: 'requests/:type',
        component: OnboardingRequestsComponent,
        data: {
          pageId: 'home/requests',
          module: 'Requests',
          pageType: 'feature',
          pageKey: 'Requests',
        },
      },
      {
        path: 'requests-approval',
        component: RequestsApprovalComponent,
        data: {
          pageId: 'home/requests',
          module: 'Requests',
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
        path: 'events/:id/edit',
        component: EditEventComponent,
        data: {
          pageId: 'home/events/edit-event',
          module: 'Events',
          pageType: 'feature',
          pageKey: 'Events',
        },
        resolve: {
          configService: ConfigResolveService,
        },
      },
      {
        path: 'events/create-event',
        component: CreateEventComponent,
        data: {
          pageId: 'home/events/create-event',
          module: 'Events',
          pageType: 'feature',
          pageKey: 'Events',
        },
        resolve: {
          configService: ConfigResolveService,
        },
      },
      {
        path: 'events',
        component: EventsListComponent,
        data: {
          pageId: 'home/events',
          module: 'Events',
          pageType: 'feature',
          pageKey: 'Events',
        },
        resolve: {
          configService: ConfigResolveService,
        },
      },
      {
        path: 'sectors',
        component: SectorsComponent,
        data: {
          pageId: 'home/sectors',
          module: 'Sectors',
          pageType: 'feature',
          pageKey: 'Sectors',
        },
        resolve: {
          configService: ConfigResolveService,
        },
      },
      {
        path: 'sectors/new',
        component: AddSectorComponent,
        data: {
          pageId: 'home/sectors/new',
          module: 'Sectors',
          pageType: 'feature',
          pageKey: 'Sectors',
        },
        resolve: {
          configService: ConfigResolveService,
        },
      },
      {
        path: 'sectors/:id/sub-sectors',
        component: EditSectorComponent,
        data: {
          pageId: 'home/sectors/edit',
          module: 'Sectors',
          pageType: 'feature',
          pageKey: 'Sectors',
        },
        resolve: {
          configService: ConfigResolveService,
        },
      },
      {
        path: 'reports',
        component: ReportsComponent,
        data: {
          pageId: 'home/reports',
          module: 'Reports',
          pageType: 'feature',
          pageKey: 'Reports',
        },
      },
      {
        path: 'reports/:tab',
        data: {
          pageId: 'home/reports',
          module: 'Reports',
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
      {
        path: 'all-request',
        component: AllRequestComponent,
        data: {
          pageId: 'home/all-request',
          module: 'Request',
          pageType: 'feature',
          pageKey: 'Request',
        },
        resolve: {
          configService: ConfigResolveService,
        },
      },
      {
        path: 'request-details',
        component: RequestCopyDetailsComponent,
        data: {
          pageId: 'home/request-details',
          module: 'Request-Details',
          pageType: 'feature',
          pageKey: 'Request-Details',
        },
        resolve: {
          configService: ConfigResolveService,
        },
      },
      {
        path: 'kcm-mapping',
        component: KCMMappingComponent,
        data: {
          pageId: 'home/KCM-mapping',
          module: 'KCM-mapping',
          pageType: 'feature',
          pageKey: 'kcm',
        },
        resolve: {
          configService: ConfigResolveService,
          pageData: PageResolve,
        },
      },
      {
        path: 'survey',
        component: SurveyComponent,
        data: {
          pageId: 'home/survey',
          module: 'Survey',
          pageType: 'feature',
          pageKey: 'survey',
        },
        resolve: {
          configService: ConfigResolveService,
          pageData: PageResolve,
        },
      },
      {
        path: 'marketplace-providers',
        loadChildren: () => import('./routes/marketplace-provider/marketplace-provider.module').then(u => u.MarketplaceProviderModule),
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
    ApprovedlistResolve,
  ],
})
export class HomeRoutingModule { }
