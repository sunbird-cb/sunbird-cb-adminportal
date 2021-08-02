import { AfterViewInit, Component, OnInit, Output, EventEmitter } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { UsersService } from '../../../home/services/users.service'
import * as _ from 'lodash'
// import { RolesAccessService } from '../../services/roles-access.service'
@Component({
  selector: 'ws-app-roles-access',
  templateUrl: './roles-access.component.html',
  styleUrls: ['./roles-access.component.scss'],
})
export class RolesAccessComponent implements OnInit, AfterViewInit {
  tabledata: any = []
  data: any = []
  deparmentId!: string
  deparmentName!: string
  userWholeData!: any
  counts: any = []
  @Output() clickedDepartment = new EventEmitter<string>()
  constructor(private activatedRoute: ActivatedRoute,
              private usersService: UsersService
  ) {

    this.activatedRoute.params.subscribe(params => {
      this.deparmentId = params['roleId']
      this.deparmentName = params['depatName']
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
    this.getAllKongUsers()
  }

  ngAfterViewInit() {
    // this.elementPosition = this.menuElement.nativeElement.parentElement.offsetTop
  }

  /* Click event to navigate to a particular role */
  onRoleClick(clickedData: any) {
    this.clickedDepartment.emit(clickedData.role)
  }

  /* API call to get all roles*/
  fetchRoles() {
    const usersData: any[] = []
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
        const roleAndCount = {
          role: role[i],
          count: count[i],
        }
        roleAndAccess.push(roleAndCount)
      }

    }
    this.data = roleAndAccess
  }

  getAllKongUsers() {
    // const rootOrgId = _.get(this.activatedRoute.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    this.usersService.getAllKongUsers(this.deparmentId).subscribe(data => {
      if (data.result.response.content) {
        this.userWholeData = data.result.response.content || []
        this.fetchRoles()
      }
    })
  }
}
