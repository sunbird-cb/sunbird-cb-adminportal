import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core'
import { zip } from 'rxjs'
import {
  ActivatedRoute,
  Router,
} from '@angular/router'
import * as _ from 'lodash'
import { RolesService } from '../../services/roles.service'
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
  wholeData!: any
  roledata: any
  parseRoledata: any
  alluserroles: any
  counts: any = []
  rolesObject: any = []
  rolesContentObject: any = []

  constructor(private router: Router, private activeRoute: ActivatedRoute, private usersService: UsersService, private roleservice: RolesService) {
    this.getAllKongUsers()
    // this.getAllRoleUsers()
    // this.fetchRoles()

  }
  fetchRoles() {
    this.roleservice.getAllRoles().subscribe(data => {
      this.parseRoledata = JSON.parse(data.result.response.value)
      // console.log('All role data', this.parseRoledata)
      for (var i = 0; i < this.parseRoledata.orgTypeList.length; i++) {
        // if (this.parseRoledata.orgTypeList[i].name === "SPV" || this.parseRoledata.orgTypeList[i].name === "STATE") {
        if (true) {
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
      }
      const arrayConcat = [].concat(...this.rolesContentObject)
      var uniqueRoles = [...new Set(arrayConcat)]
      // console.log('uniqueRoles', uniqueRoles)
      const rolesArray: any = []
      const rootOrgId = _.get(this.activeRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrg.rootOrgId')
      console.log("dummy ", _.map(uniqueRoles, r => this.fetchIndidualRoleData(rootOrgId, r)))
      zip(_.map(uniqueRoles, r => this.fetchIndidualRoleData(rootOrgId, r)))
        .subscribe(t => {
          console.log("t is ", t)
        })
      // for (var i = 0; i < uniqueRoles.length; i++) {

      //   // debugger
      //   this.usersService.getAllRoleUsers(rootOrgId, uniqueRoles[i]).subscribe((roleData: any) => {
      //     // debugger
      //     console.log('roleData and length', 'PUBLIC', roleData.length)
      //     this.counts = roleData.result.response.count
      //     const roleAndCount = {
      //       role: uniqueRoles[i],
      //       count: this.counts
      //     }
      //     rolesArray.push(roleAndCount)


      //   })
      // }
      // console.log('rolesArray', rolesArray)
      this.data = rolesArray


    })

    //old code
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

    //old code
  }

  fetchIndidualRoleData(rootOrgId: string, rolename: string) {

    return this.usersService.getAllRoleUsers(rootOrgId, rolename)
  }

  getAllKongUsers() {

    const rootOrgId = _.get(this.activeRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrg.rootOrgId')
    this.usersService.getAllKongUsers(rootOrgId).subscribe(data => {
      if (data.result.response.content) {
        this.userWholeData = data.result.response.content || []
        // this.fetchRoles()
      }
    })
  }
  // getAllRoleUsers() {
  //   const rootOrgId = _.get(this.activeRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrg.rootOrgId')
  //   this.usersService.getAllRoleUsers(rootOrgId).subscribe(data => {
  //     if (data.result.response.content) {
  //       this.userWholeData = data.result.response || []
  //       // this.getMyDepartment()
  //       // this.fetchRoles()
  //     }
  //   })
  // }
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
  onRoleClick(event: any) {
    const rootOrgId = _.get(this.activeRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrg.rootOrgId')
    this.router.navigate([`/app/home/roles-users`], { queryParams: { role: event.role, orgID: rootOrgId } })
  }

  ngOnDestroy() { }
}
