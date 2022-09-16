import { Component, OnInit } from '@angular/core'
import {
  ActivatedRoute,
  Router,
} from '@angular/router'
import * as _ from 'lodash'
import { ITableData } from '../../../../head/ui-admin-table/interface/interfaces'
import { RolesService } from '../../services/roles.service'
import { UsersService } from '../../services/users.service'
@Component({
  selector: 'ws-app-roles-access',
  templateUrl: './roles-access.component.html',
  styleUrls: ['./roles-access.component.scss'],
})
export class RolesAccessComponent implements OnInit {
  tabledata!: ITableData
  data: any = []
  count!: number
  userWholeData!: any
  wholeData!: any
  roledata: any
  parseRoledata: any
  alluserroles: any
  counts: any = []
  rolesObject: any = []
  rolesContentObject: any = []
  individualRoleCount: boolean = true

  constructor(private router: Router,
    private activeRoute: ActivatedRoute,
    private usersService: UsersService,
    private roleservice: RolesService
  ) {
    this.getAllKongUsers()
  }
  fetchRoles() {
    this.roleservice.getAllRoles().subscribe(data => {
      this.parseRoledata = JSON.parse(data.result.response.value)
      for (let i = 0; i < this.parseRoledata.orgTypeList.length; i += 1) {
        // if (this.parseRoledata.orgTypeList[i].name === "SPV" || this.parseRoledata.orgTypeList[i].name === "STATE") {
        if (this.rolesObject.length > 0) {
          const temp = this.rolesObject.filter((v: any) => v.name === this.parseRoledata.orgTypeList[i].name).length
          if (temp === 0) {
            this.rolesObject.push({
              name: this.parseRoledata.orgTypeList[i].name,
              roles: this.parseRoledata.orgTypeList[i].roles
            })
            this.rolesContentObject.push(
              this.parseRoledata.orgTypeList[i].roles
            )
          }
        }
        else {
          this.rolesObject.push({
            name: this.parseRoledata.orgTypeList[i].name,
            roles: this.parseRoledata.orgTypeList[i].roles
          })
          this.rolesContentObject.push(
            this.parseRoledata.orgTypeList[i].roles
          )
        }
      }
      const arrayConcat = [].concat(...this.rolesContentObject)
      const allRoles = [...new Set(arrayConcat)]
      const uniqueRoles = []
      for (let i = 0; i < allRoles.length; i += 1) {
        uniqueRoles.push({ role: allRoles[i], count: 'N/A' })
      }
      this.data = uniqueRoles
    })
  }

  fetchIndidualRoleData(rootOrgId: string, rolename: string) {
    this.usersService.getAllRoleUsers(rootOrgId, rolename).subscribe(data => {
      this.individualRoleCount = true
      const individualCount = data.count
      for (let i = 0; i < this.data.length; i += 1) {
        if (this.data[i].role === rolename)
          this.data[i].count = individualCount
      }
    })
  }

  getAllKongUsers() {
    const rootOrgId = _.get(this.activeRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrg.rootOrgId')
    this.usersService.getAllKongUsers(rootOrgId).subscribe(data => {
      if (data.result.response.content) {
        this.userWholeData = data.result.response.content || []
      }
    })
  }
  ngOnInit() {
    this.tabledata = {
      columns: [
        { displayName: 'Role', key: 'role' },
        { displayName: 'Number of users', key: 'count' }
      ],
      actions: [{ icon: 'remove_red_eye', label: 'View user count', name: 'ViewCount', type: 'link' }],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      needUserMenus: false,
      sortState: 'asc',
    }
    this.fetchRoles()

  }
  actionsClick($event: any) {
    if ($event.action === 'ViewCount') {
      this.individualRoleCount = false
      const individualRole = $event.row.role
      const rootOrgId = _.get(this.activeRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrg.rootOrgId')
      this.fetchIndidualRoleData(rootOrgId, individualRole)
    }
  }


  /* Click event to navigate to a particular role */
  onRoleClick(event: any) {
    const rootOrgId = _.get(this.activeRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrg.rootOrgId')
    this.router.navigate([`/app/home/roles-users`], { queryParams: { role: event.role, orgID: rootOrgId } })
  }

  // ngOnDestroy() { }
}
