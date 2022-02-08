
import { Component, OnInit } from '@angular/core'
import { NSProfileDataV2 } from '../../models/profile-v2.model'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils'
/* tslint:disable */
import _ from 'lodash'
import { UsersService } from '../../services/users.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { environment } from 'src/environments/environment'
@Component({
  selector: 'ws-app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})

export class UsersViewComponent implements OnInit {

  /* tslint:disable */
  Math: any
  /* tslint:enable */
  currentFilter = 'active'
  discussionList!: any
  discussProfileData!: any
  portalProfile!: NSProfileDataV2.IProfile
  // userDetails: any
  // location!: string | null
  tabs: any
  tabsData: NSProfileDataV2.IProfileTab[]
  currentUser!: string | null
  // connectionRequests!: any[]
  tabledata: any = []
  data: any = []
  userWholeData: any = []
  usersData!: any

  // fullUserData: any = []

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    // private discussService: DiscussService,
    private router: Router,
    private usersService: UsersService,
    private configSvc: ConfigurationsService,
    private snackBar: MatSnackBar,
    private events: EventService,
  ) {
    this.Math = Math
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
    this.tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
    this.tabs = this.route.data.subscribe(data => {
      this.portalProfile = data.profile
        && data.profile.data
        && data.profile.data.length > 0
        && data.profile.data[0]
    })
  }
  ngOnInit() {
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
    this.getAllKongUsers()

  }
  onCreateClick() {
    this.router.navigate([`/app/users/create-user`])
  }
  menuActions($event: { action: string, row: any }) {
    const loggedInUserId = _.get(this.route, 'snapshot.parent.data.configService.userProfile.userId')
    const user = { userId: _.get($event.row, 'userId') }
    _.set(user, 'deptId', _.get(this.usersData, 'id'))
    _.set(user, 'isBlocked', _.get($event.row, 'blocked'))
    _.set(user, 'isActive', _.get($event.row, 'active'))

    switch ($event.action) {
      case 'showOnKarma':
        window.open(`${environment.karmYogiPath}/app/person-profile/${user.userId}`)
        break
      case 'block':
        _.set(user, 'isBlocked', true)
        _.set(user, 'isActive', false)
        _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i.roleName))
        this.usersService.newBlockUserKong(loggedInUserId, user.userId).subscribe(response => {
          if (response) {
            // this.getAllUsers()
            // this.snackBar.open(response.params.errmsg)
            this.snackBar.open(response.result.response)
          }
        }, _err => this.snackBar.open('Error in inactive'))
        break
      case 'unblock':
        _.set(user, 'isBlocked', false)
        _.set(user, 'isActive', true)
        _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i.roleName))
        this.usersService.newUnBlockUserKong(loggedInUserId, user.userId).subscribe(response => {
          if (response) {
            // this.getAllUsers()
            this.snackBar.open(response.params.errmsg)
          }
        }, _err => this.snackBar.open('Error in active'))
        break
      case 'deactive':
        _.set(user, 'isActive', false)
        _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i.roleName))
        this.usersService.newUnBlockUserKong(loggedInUserId, user.userId).subscribe(response => {
          if (response) {
            // this.getAllUsers()
            this.snackBar.open(response.params.errmsg)
          }
        }, _err => this.snackBar.open('Error in Active'))
        break
      case 'active':
        _.set(user, 'isActive', true)
        _.set(user, 'isBlocked', false)
        _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i.roleName))
        this.usersService.deActiveUser(user).subscribe(response => {
          if (response) {
            // this.getAllUsers()
            this.snackBar.open('Updated successfully !')
          }
        })
        break
    }
  }
  // getAllUsers() {
  //   this.usersService.getAllUsers().subscribe(data => {
  //     this.usersData = data
  //     this.filter(this.currentFilter)
  //   })
  // }
  getAllKongUsers() {
    const rootOrgId = _.get(this.route.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    this.usersService.getAllKongUsers(rootOrgId).subscribe(data => {
      if (data.result.response.content) {
        this.userWholeData = data.result.response.content || []
        this.filter('active')
      }
    })
  }
  raiseTabTelemetry(sub: string, data: WsEvents.ITelemetryTabData) {
    this.events.handleTabTelemetry(sub, data)
  }
  filter(key: string) {
    const usersData: any[] = []
    let index = 0
    let data: any
    if (key) {
      this.currentFilter = key
      this.data = []
      switch (key) {
        case 'active':
          index = 1
          data = {
            index,
            label: key,
          }
          this.raiseTabTelemetry(key, data)
          this.newKongUser(false)
          break
        case 'inactive':
          index = 2
          data = {
            index,
            label: key,
          }
          this.raiseTabTelemetry(key, data)
          this.newKongUser(true)
          break
        case 'blocked':
          this.data = usersData
          break
        default:
          this.data = usersData
          break
      }
    }
  }
  newKongUser(active: boolean) {
    // const rootOrgId = _.get(this.route.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    const usersData: any[] = []
    let roles: any[] = []
    this.userWholeData.forEach((user: any) => {
      user.organisations.forEach((org: { organisationId: string, roles: any }) => {
        roles = org.roles
      })
      const email = _.get(user, 'profileDetails.personalDetails.primaryEmail')
      if (active === user.isDeleted) {
        usersData.push({
          fullname: user ? `${user.firstName} ${user.lastName}` : null,
          email: email || 'NA',
          roles: roles.toString().replace(',', ', '),
          userId: user.userId,
        })
      }
    })
    this.data = usersData
  }
  getUserRole(user: any) {
    const userRole: any[] = []
    user.roleInfo.forEach((role: { roleName: any }) => {
      userRole.push(role.roleName)
    })
    return userRole
  }
}
