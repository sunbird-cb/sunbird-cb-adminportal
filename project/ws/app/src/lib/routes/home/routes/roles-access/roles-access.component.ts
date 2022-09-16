import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core'
import {
  ActivatedRoute,
  Router,
} from '@angular/router'
import * as _ from 'lodash'
import { ITableData } from '../../../../head/ui-admin-table/interface/interfaces'
// project / ws / app / src / lib / head / ui - admin - table / interface / interfaces.ts'
import { RolesService } from '../../services/roles.service'
import { UsersService } from '../../services/users.service'
// import { RolesAccessService } from '../../services/roles-access.service'
@Component({
  selector: 'ws-app-roles-access',
  templateUrl: './roles-access.component.html',
  styleUrls: ['./roles-access.component.scss'],
})
export class RolesAccessComponent implements OnInit, AfterViewInit, OnDestroy {
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

  constructor(private router: Router, private activeRoute: ActivatedRoute, private usersService: UsersService, private roleservice: RolesService) {
    this.getAllKongUsers()
    // this.getAllRoleUsers()
    // this.fetchRoles()

  }
  fetchRoles() {
    this.roleservice.getAllRoles().subscribe(data => {
      this.parseRoledata = JSON.parse(data.result.response.value)
      for (let i = 0; i < this.parseRoledata.orgTypeList.length; i++) {
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
      var uniqueRoles = []
      for (let i = 0; i < allRoles.length; i++) {
        // uniqueRoles.push({ role: allRoles[i], count: 0 })
        uniqueRoles.push({ role: allRoles[i] })
      }
      this.data = uniqueRoles
    })

    // old code

    // const rootOrgId = _.get(this.activeRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrg.rootOrgId')
    // Promise.all([_.first(_.map(uniqueRoles, r => this.fetchIndidualRoleData(rootOrgId, r)))]).then(r => {
    // Promise.all(_.map(uniqueRoles, r => this.fetchIndidualRoleData(rootOrgId, r))).then(r => {
    //   this.data = _.compact(_.map(_.flatten(r), o => {
    //     console.log("this.data", this.data)
    //     debugger
    //     // if need to remove zero count
    //     if (o.count > 0) {
    //       return o
    //     } return undefined
    //   }))
    // })

    // const usersData: any[] = []
    // if (this.wholeData) {
    //   this.wholeData.forEach((user: any) => {
    //     if (!user.isDeleted && user.organisations && user.organisations.length > 0) {
    //       user.organisations.forEach((org: { organisationId: string, roles: any }) => {
    //         org.roles.forEach((r: any) => {
    //           usersData.push(r)
    //         })

    //       })
    //     }
    //   })
    //   usersData.forEach((x: any) => {
    //     this.counts[x] = (this.counts[x] || 0) + 1
    //   })
    //   const role = Object.keys(this.counts)
    //   const count = Object.values(this.counts)
    //   const roleAndAccess: any[] = []
    //   for (let i = 0; i <= role.length; i = i + 1) {
    //     if (role[i]) {
    //       // if (role[i] === 'SPV_ADMIN') {
    //       const roleAndCount = {
    //         role: role[i],
    //         count: count[i],
    //       }
    //       debugger
    //       roleAndAccess.push(roleAndCount)
    //       // }

    //     }

    //   }

    //   this.data = roleAndAccess
    // }

    // old code
  }

  // fetchIndidualRoleData(rootOrgId: string, rolename: string) {
  //   return this.usersService.getAllRoleUsers(rootOrgId, rolename).toPromise()
  // }

  getAllKongUsers() {
    const rootOrgId = _.get(this.activeRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrg.rootOrgId')
    this.usersService.getAllKongUsers(rootOrgId).subscribe(data => {
      if (data.result.response.content) {
        this.userWholeData = data.result.response.content || []
        // this.fetchRoles()
      }
    })
  }
  ngOnInit() {
    this.tabledata = {
      columns: [
        { displayName: 'Role', key: 'role' },
        { displayName: 'Number of users', key: 'count' }
      ],
      actions: [{ icon: 'remove_red_eye', label: 'View user count', name: 'View user count', type: 'link' }],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      needUserMenus: false,
      sortState: 'asc',
    }
    this.fetchRoles()

  }
  actionsClick($event: any) {
    this.individualRoleCount = false
    const individualRole = $event.row.role
    const rootOrgId = _.get(this.activeRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrg.rootOrgId')
    this.usersService.getAllRoleUsers(rootOrgId, individualRole).subscribe(data => {
      this.individualRoleCount = true
      const individualCount = data.count
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].role === individualRole)
          this.data[i].count = individualCount
      }
    })

  }
  ngAfterViewInit() {
    // this.elementPosition = this.menuElement.nativeElement.parentElement.offsetTop
  }

  /* Click event to navigate to a particular role */
  onRoleClick(event: any) {
    const rootOrgId = _.get(this.activeRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrg.rootOrgId')
    this.router.navigate([`/app/home/roles-users`], { queryParams: { role: event.role, orgID: rootOrgId } })
  }

  ngOnDestroy() { }
}
