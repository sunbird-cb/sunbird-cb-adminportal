import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core'
import {
  ActivatedRoute,
  Router,

  // , ActivatedRoute
} from '@angular/router'
import * as _ from 'lodash'
import { UsersService } from '../../services/users.service'
// import { RolesAccessService } from '../../services/roles-access.service'
@Component({
  selector: 'ws-app-roles-access',
  templateUrl: './roles-access.component.html',
  styleUrls: ['./roles-access.component.scss'],
})
export class RolesAccessComponent implements OnInit, AfterViewInit, OnDestroy {
  tabledata: any = []
  data: any = []
  count!: number

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private usersService: UsersService,
  ) {
    this.getAllKongUsers()

  }
  getAllKongUsers() {
    const rootOrgId = _.get(this.activeRoute.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    this.count = 0
    this.usersService.getAllKongUsers(rootOrgId).subscribe(data => {

      data.result.response.content.forEach((element: { roles: any }) => {
        if (element.roles.includes('SPV_ADMIN')) {
          this.count = this.count + 1
        }
      })

    })
  }
  ngOnInit() {
    this.tabledata = {
      columns: [
        { displayName: 'Role', key: 'role' },
        { displayName: 'Number of users', key: 'count' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      sortState: 'asc',
    }
    this.fetchRoles()

    const data = []
    data.push({
      role: 'SPV_ADMIN',
      count: this.count,
    })
    this.data = data
  }

  ngAfterViewInit() {
    // this.elementPosition = this.menuElement.nativeElement.parentElement.offsetTop
  }

  /* Click event to navigate to a particular role */
  onRoleClick() {
    this.router.navigate([`/app/home/users`])
  }

  /* API call to get all roles*/
  fetchRoles() {
    // const test = _.sortBy(_.uniq(_.flatten(_.map(_.get(this.activeRoute.snapshot, 'data.rolesList.data.orgTypeList'), 'roles')))) || []

  }

  ngOnDestroy() { }
}
