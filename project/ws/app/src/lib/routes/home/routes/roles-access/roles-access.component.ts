import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core'
import {
  ActivatedRoute,
  Router,
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
  userWholeData!: any
  counts: any = []

  constructor(private router: Router,
    private activeRoute: ActivatedRoute,
    private usersService: UsersService,
  ) {
    this.getAllKongUsers()

  }
  fetchRoles() {
    const usersData: any[] = []
    if (this.userWholeData) {
      this.userWholeData.forEach((user: any) => {
        user.organisations.forEach((org: { organisationId: string, roles: any }) => {
          org.roles.forEach((r: any) => {
            usersData.push(r)
          })

        })
      })
      usersData.forEach((x: any) => {
        this.counts[x] = (this.counts[x] || 0) + 1
      })
      const role = Object.keys(this.counts)
      const count = Object.values(this.counts)
      const roleAndAccess: any[] = []
      for (let i = 0; i <= role.length; i = i + 1) {
        if (role[i]) {
          if (role[i] === 'SPV_ADMIN') {
            const roleAndCount = {
              role: role[i],
              count: count[i],
            }
            roleAndAccess.push(roleAndCount)
          }

        }

      }

      this.data = roleAndAccess
    }
  }

  getAllKongUsers() {
    const rootOrgId = _.get(this.activeRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrg.rootOrgId')
    this.usersService.getAllKongUsers(rootOrgId).subscribe(data => {
      if (data.result.response.content) {
        this.userWholeData = data.result.response.content || []
        this.fetchRoles()
      }
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

  }

  ngAfterViewInit() {
    // this.elementPosition = this.menuElement.nativeElement.parentElement.offsetTop
  }

  /* Click event to navigate to a particular role */
  onRoleClick() {
    this.router.navigate([`/app/home/users`])
  }

  ngOnDestroy() { }
}
