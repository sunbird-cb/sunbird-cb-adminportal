
import { Component, OnInit } from '@angular/core'
import { NSProfileDataV2 } from '../../models/profile-v2.model'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils'
/* tslint:disable */
import _ from 'lodash'
import { UsersService } from '../../services/users.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { environment } from 'src/environments/environment'
import { LoaderService } from '../../services/loader.service'
import { ProfileV2UtillService } from '../../services/home-utill.service'
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator'
@Component({
  selector: 'ws-app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.scss'],
  providers: [LoaderService],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})

export class UsersViewComponent implements OnInit {

  /* tslint:disable */
  Math: any
  /* tslint:enable */
  currentFilter = 'active'
  portalProfile!: NSProfileDataV2.IProfile
  tabs: any
  tabsData: NSProfileDataV2.IProfileTab[]
  currentUser!: string | null
  tabledata: any = []
  data: any = []
  usersData!: any

  activeUsersData!: any[]
  inactiveUsersData!: any[]
  currentOffset = 0
  userDataTotalCount?: number | 0
  limit = 20
  pageIndex = 0
  searchQuery = ''
  rootOrgId: any

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    // private discussService: DiscussService,
    private router: Router,
    private usersService: UsersService,
    private configSvc: ConfigurationsService,
    private snackBar: MatSnackBar,
    private events: EventService,
    private profileUtilSvc: ProfileV2UtillService,
  ) {
    this.Math = Math
    this.configSvc = this.route.parent && this.route.parent.snapshot.data.configService
    this.currentUser = this.configSvc?.userProfile?.userId || ''
    this.tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
    this.tabs = this.route.data.subscribe(data => {
      this.portalProfile = data.profile
        && data.profile.data
        && data.profile.data.length > 0
        && data.profile.data[0]
    })
  }
  ngOnInit() {
    this.rootOrgId = _.get(this.route.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    this.tabledata = {
      actions: [],
      columns: [
        { displayName: 'Full name', key: 'fullname' },
        { displayName: 'Email', key: 'email' },
        { displayName: 'Roles', key: 'roles' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      sortState: 'asc',
      needUserMenus: true,
    }
    // this.getAllUsers()
    this.filterData('')
  }

  filter(filter: string) {
    this.currentFilter = filter
    this.pageIndex = 0
    this.currentOffset = 0
    this.limit = 20
    this.searchQuery = ''
    this.filterData(this.searchQuery)
  }

  get dataForTable() {
    switch (this.currentFilter) {
      case 'active':
        return this.activeUsersData
      case 'inactive':
        return this.inactiveUsersData
      default:
        return []
    }
  }

  filterData(query: string) {
    let index = 0
    if (this.currentFilter === 'active') {
      index = 1
      const data = { index, label: this.currentFilter }

      this.raiseTabTelemetry(this.currentFilter, data)
      this.activeUsers(query)
    } else if (this.currentFilter === 'inactive') {
      index = 2
      const data = { index, label: this.currentFilter }

      this.raiseTabTelemetry(this.currentFilter, data)
      this.inActiveUsers(query)
    }
  }

  activeUsers(query: string) {
    this.loaderService.changeLoad.next(true)
    const activeUsersData: any[] = []
    const status = this.currentFilter === 'active' ? 1 : 0
    this.currentOffset = this.limit * ((this.pageIndex + 1) - 1)
    this.usersService.getAllKongUsersPaginated(this.rootOrgId, status, this.limit, this.currentOffset, query).subscribe((data: any) => {
      this.userDataTotalCount = data.result.response.count
      this.usersData = data.result.response
      if (this.usersData && this.usersData.content && this.usersData.content.length && this.usersData.content.length > 0) {
        _.filter(this.usersData.content, { isDeleted: false }).forEach((user: any) => {
          // tslint:disable-next-line
          const org = { roles: _.get(_.first(_.filter(user.organisations, { organisationId: _.get(this.configSvc, 'unMappedUser.rootOrg.id') })), 'roles') }
          activeUsersData.push({
            fullname: user ? `${user.firstName}` : null,
            active: !user.isDeleted,
            email: user.personalDetails && user.personalDetails.primaryEmail ?
              this.profileUtilSvc.emailTransform(user.personalDetails.primaryEmail) : this.profileUtilSvc.emailTransform(user.email),
            roles: org.roles.toString().replace(',', ', '),
            userId: user.userId,
            role: org.roles || [],
            blocked: user.blocked,
          })
        })
      }
      this.activeUsersData = activeUsersData
      return this.activeUsersData
    })
  }

  inActiveUsers(query: string) {
    this.loaderService.changeLoad.next(true)
    const inactiveUsersData: any[] = []
    const status = this.currentFilter === 'active' ? 1 : 0
    this.currentOffset = this.limit * ((this.pageIndex + 1) - 1)
    this.usersService.getAllKongUsersPaginated(this.rootOrgId, status, this.limit, this.currentOffset, query).subscribe(
      (data: any) => {
        this.userDataTotalCount = data.result.response.count
        this.usersData = data.result.response
        if (this.usersData && this.usersData.content && this.usersData.content.length && this.usersData.content.length > 0) {
          _.filter(this.usersData.content, { isDeleted: true }).forEach((user: any) => {
            // tslint:disable-next-line
            const org = { roles: _.get(_.first(_.filter(user.organisations, { organisationId: _.get(this.configSvc, 'unMappedUser.rootOrg.id') })), 'roles') }
            inactiveUsersData.push({
              fullname: user ? `${user.firstName}` : null,
              active: !user.isDeleted,
              email: user.personalDetails && user.personalDetails.primaryEmail ?
                this.profileUtilSvc.emailTransform(user.personalDetails.primaryEmail) : this.profileUtilSvc.emailTransform(user.email),
              roles: org.roles.toString().replace(',', ', '),
              userId: user.userId,
              role: org.roles || [],
              blocked: user.blocked,
            })
          })
        }
        this.inactiveUsersData = inactiveUsersData
        return this.inactiveUsersData
      })
  }

  onCreateClick() {
    this.router.navigate([`/app/home/create-user`])
  }

  menuActions($event: { action: string, row: any }) {
    this.loaderService.changeLoad.next(true)
    const loggedInUserId = _.get(this.route, 'snapshot.parent.data.configService.userProfile.userId')
    const user = {
      request: {
        userId: _.get($event.row, 'userId'),
        requestedBy: this.currentUser,
      },
    }
    switch ($event.action) {
      case 'showOnKarma':
        window.open(`${environment.karmYogiPath}/app/person-profile/${user.request.userId}`)
        break
      case 'block':
        _.set(user, 'isBlocked', true)
        _.set(user, 'isDeleted', false)
        _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i))
        this.usersService.blockUser(user).subscribe(response => {
          if (response) {
            // this.getAllKongUsers()
            this.filterData('')
            this.snackBar.open(response.result.response)
          }
        })
        break
      case 'unblock':
        _.set(user, 'isBlocked', false)
        _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i))
        this.usersService.blockUser(user).subscribe(response => {
          if (response) {
            // this.getAllKongUsers()
            this.filterData('')
            this.snackBar.open('Updated successfully !')
          }
        })
        break
      case 'deactive':
        this.usersService.newBlockUserKong(loggedInUserId, user.request.userId).subscribe(response => {
          if (_.toUpper(response.params.status) === 'SUCCESS') {
            setTimeout(() => {
              // this.getAllKongUsers()
              this.filterData('')
              this.snackBar.open('Deactivated successfully!')
            },
              // tslint:disable-next-line: align
              1500)
            // this.changeDetectorRefs.detectChanges()
          } else {
            this.loaderService.changeLoad.next(false)
            this.snackBar.open('Update unsuccess!')
          }
        },
          // tslint:disable-next-line:align
          () => {
            this.snackBar.open('Given User Data doesnt exist in our records. Please provide a valid one.')
          })
        break
      case 'active':
        const state = _.get(user, 'isBlocked')
        if (state === true) {
          _.set(user, 'isDeleted', false)
          _.set(user, 'isBlocked', false)
        } else {
          _.set(user, 'isDeleted', false)
        }
        _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i))
        this.usersService.newUnBlockUserKong(loggedInUserId, user.request.userId).subscribe((response: any) => {
          if (_.toUpper(response.params.status) === 'SUCCESS') {
            setTimeout(() => {
              // this.getAllKongUsers()
              this.filterData('')
              this.snackBar.open('Activated successfully!')
              // tslint:disable-next-line: align
            }, 1500)
          } else {
            this.loaderService.changeLoad.next(false)
            this.snackBar.open('Update unsuccess!')
          }
        })
        break
    }
  }

  // menuActions($event: { action: string, row: any }) {
  //   this.loaderService.changeLoad.next(true)
  //   const loggedInUserId = _.get(this.route, 'snapshot.parent.data.configService.userProfile.userId')
  //   const user = { userId: _.get($event.row, 'userId') }
  //   _.set(user, 'deptId', _.get(this.usersData, 'id'))
  //   _.set(user, 'isBlocked', _.get($event.row, 'blocked'))
  //   _.set(user, 'isActive', _.get($event.row, 'active'))

  //   switch ($event.action) {
  //     case 'showOnKarma':
  //       window.open(`${environment.karmYogiPath}/app/person-profile/${user.userId}`)
  //       break
  //     case 'block':
  //       _.set(user, 'isBlocked', true)
  //       _.set(user, 'isActive', false)
  //       _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i.roleName))
  //       this.usersService.newBlockUserKong(loggedInUserId, user.userId).subscribe(response => {
  //         if (_.toUpper(response.params.status) === 'SUCCESS') {
  //           setTimeout(() => {
  //             // this.getAllKongUsers()
  //             this.filterData('')
  //             this.snackBar.open('Deactivated successfully!')
  //           }, 1500)

  //         } else {
  //           this.loaderService.changeLoad.next(false)
  //           this.snackBar.open('Update unsuccess!')
  //         }
  //       }, _err => this.snackBar.open('Error in inactive'))
  //       break
  //     case 'unblock':
  //       _.set(user, 'isBlocked', false)
  //       _.set(user, 'isActive', true)
  //       _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i.roleName))
  //       this.usersService.newUnBlockUserKong(loggedInUserId, user.userId).subscribe(response => {
  //         if (_.toUpper(response.params.status) === 'SUCCESS') {
  //           setTimeout(() => {
  //             // this.getAllKongUsers()
  //             this.filterData('')
  //             this.snackBar.open('Activated successfully!')
  //           }, 1500)

  //           // this.getAllKongUsers()
  //           // // this.getAllUsers()
  //           // this.snackBar.open(response.params.errmsg)
  //         } else {
  //           this.loaderService.changeLoad.next(false)
  //           this.snackBar.open('Updat unsuccess!')
  //         }
  //       }, _err => this.snackBar.open('Error in active'))
  //       break
  //     case 'deactive':
  //       _.set(user, 'isActive', false)
  //       _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i.roleName))
  //       this.usersService.newUnBlockUserKong(loggedInUserId, user.userId).subscribe(response => {
  //         if (response) {
  //           // this.getAllUsers()
  //           this.snackBar.open(response.params.errmsg)
  //         }
  //       }, _err => this.snackBar.open('Error in Active'))
  //       break
  //     case 'active':
  //       _.set(user, 'isActive', true)
  //       _.set(user, 'isBlocked', false)
  //       _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i.roleName))
  //       this.usersService.deActiveUser(user).subscribe(response => {
  //         if (response) {
  //           // this.getAllUsers()
  //           this.snackBar.open('Updated successfully !')
  //         }
  //       })
  //       break
  //   }
  // }

  raiseTabTelemetry(sub: string, data: WsEvents.ITelemetryTabData) {
    this.events.handleTabTelemetry(sub, data)
  }

  getUserRole(user: any) {
    const userRole: any[] = []
    user.roleInfo.forEach((role: { roleName: any }) => {
      userRole.push(role.roleName)
    })
    return userRole
  }

  onEnterkySearch(enterValue: any) {
    this.searchQuery = enterValue
    this.currentOffset = 0
    this.pageIndex = 0
    this.filterData(this.searchQuery)
  }

  onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.limit = event.pageSize
    this.filterData(this.searchQuery)
  }
}
