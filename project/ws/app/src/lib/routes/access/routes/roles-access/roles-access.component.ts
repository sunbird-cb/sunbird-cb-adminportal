import { AfterViewInit, Component, OnInit, Output, EventEmitter } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { UsersService } from '../../../home/services/users.service'
import * as _ from 'lodash'
import { RolesService } from '../../../home/services/roles.service'
import { environment } from '../../../../../../../../../src/environments/environment'
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
  parseRoledata: any = []
  rolesObject: any = []
  currentDept: any = ''
  rolesContentObject: any = []
  individualRoleCount = true
  @Output() clickedDepartment = new EventEmitter<string>()
  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService, private roleservice: RolesService,
  ) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.deparmentId = params['roleId']
      this.deparmentName = params['depatName']
      // this.currentDept = params['currentDept']
      this.currentDept = params['subOrgType']
    })
    if (this.currentDept === 'CBP Providers' || this.currentDept === 'cbp-providers') {
      this.currentDept = 'CBP'
    }
    else if (this.currentDept && this.currentDept.toLowerCase() === 'ministry') this.currentDept = 'mdo'
    else if (this.currentDept && this.currentDept.toLowerCase() === 'state') this.currentDept = 'state'

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
    this.roleservice.getAllRoles().subscribe(data => {
      this.parseRoledata = JSON.parse(data.result.response.value)
      for (let i = 0; i < this.parseRoledata.orgTypeList.length; i += 1) {
        if (this.currentDept) {
          if (environment.cbpProviderRoles && environment.cbpProviderRoles.includes(this.currentDept.toLowerCase())) {
            this.currentDept = 'CBP'
          }
          if (this.parseRoledata && this.parseRoledata.orgTypeList &&
            this.parseRoledata.orgTypeList[i] && this.parseRoledata.orgTypeList[i].name === this.currentDept.toUpperCase()) {
            if (this.rolesObject && this.rolesObject.length && this.rolesObject.length > 0) {
              const temp = this.rolesObject.filter((v: any) => v.name === this.parseRoledata.orgTypeList[i].name).length
              if (temp === 0) {
                this.rolesObject.push({
                  name: this.parseRoledata.orgTypeList[i].name,
                  roles: this.parseRoledata.orgTypeList[i].roles,
                })
                this.rolesContentObject.push(
                  this.parseRoledata.orgTypeList[i].roles
                )
              }
            } else {
              this.rolesObject.push({
                name: this.parseRoledata.orgTypeList[i].name,
                roles: this.parseRoledata.orgTypeList[i].roles,
              })
              this.rolesContentObject.push(
                this.parseRoledata.orgTypeList[i].roles
              )
            }
          }
        }
      }
      const arrayConcat = [].concat(...this.rolesContentObject)
      const allRoles = [...new Set(arrayConcat)]
      const uniqueRoles = []
      for (let i = 0; i < allRoles.length; i += 1) {
        uniqueRoles.push({ role: allRoles[i], count: '0' })
      }
      this.data = uniqueRoles
    })
    // ol code
    // const usersData: any[] = []
    // this.userWholeData.forEach((user: any) => {
    //   user.organisations.forEach((org: { organisationId: string, roles: any }) => {
    //     if (org.organisationId === this.deparmentId) {
    //       org.roles.forEach((r: any) => {
    //         usersData.push(r)
    //       })
    //     }
    //   })
    // })
    // usersData.forEach((x: any) => {
    //   this.counts[x] = (this.counts[x] || 0) + 1
    // })
    // const role = Object.keys(this.counts)
    // const count = Object.values(this.counts)
    // const roleAndAccess: any[] = []
    // for (let i = 0; i <= role.length; i = i + 1) {
    //   if (role[i]) {
    //     const roleAndCount = {
    //       role: role[i],
    //       count: count[i],
    //     }
    //     roleAndAccess.push(roleAndCount)
    //   }

    // }
    // this.data = roleAndAccess
  }
  fetchIndidualRoleData(rootOrgId: string, rolename: string) {
    this.usersService.getAllRoleUsers(rootOrgId, rolename).subscribe(data => {
      this.individualRoleCount = true
      const individualCount = data.count.count
      for (let i = 0; i < this.data.length; i += 1) {
        if (this.data[i].role === rolename) {
          this.data[i].count = individualCount
        }
      }
    })
  }
  actionsClick($event: any) {
    if ($event.action === 'ViewCount') {
      this.individualRoleCount = false
      const individualRole = $event.row.role
      const rootOrgId = this.deparmentId
      this.fetchIndidualRoleData(rootOrgId, individualRole)
    }
  }
  getAllKongUsers() {
    this.usersService.getAllKongUsers(this.deparmentId).subscribe(data => {
      if (data.result.response.content.length > 0) {
        this.userWholeData = data.result.response.content || []
      }
      this.fetchRoles()
    })
  }

  ngOnInit() {
    this.tabledata = {
      columns: [
        { displayName: 'Role', key: 'role' },
        { displayName: 'Count', key: 'count' },
      ],
      actions: [{ icon: 'refresh', label: 'Refresh', name: 'ViewCount', type: 'link' }],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      sortState: 'asc',
      actionColumnName: 'Refresh',
    }
    this.getAllKongUsers()
  }
}
