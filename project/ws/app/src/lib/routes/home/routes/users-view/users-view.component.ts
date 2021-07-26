
import { Component, OnInit } from '@angular/core'
import { NSProfileDataV2 } from '../../models/profile-v2.model'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
/* tslint:disable */
import _ from 'lodash'
import { UsersService } from '../../services/users.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { environment } from 'src/environments/environment'
interface USER {
  profiledetails: any; isDeleted: boolean; userId: string | null; firstName: any; lastName: any; email: any; active: any; blocked: any; roles: any[]
}
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
    console.log(this.route)
    if (_.get(this.route, 'snapshot.data.configService.userRoles')) {
      console.log(_.get(this.route, 'snapshot.data.configService.userRoles'))
    }
  }
  ngOnInit() {
    this.tabledata = {
      actions: [],
      columns: [
        { displayName: 'Full name', key: 'fullname' },
        { displayName: 'Email', key: 'email' },
        { displayName: 'Roles', key: 'position' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      sortState: 'asc',
      needUserMenus: true,
    }
    this.getAllUsers()
    this.getAllKongUsers()
  }
  onCreateClick() {
    this.router.navigate([`/app/users/create-user`])
  }
  menuActions($event: { action: string, row: any }) {
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
        this.usersService.blockUser(user).subscribe(response => {
          if (response) {
            this.getAllUsers()
            this.snackBar.open('Updated successfully !')
          }
        })
        break
      case 'unblock':
        _.set(user, 'isBlocked', false)
        _.set(user, 'isActive', true)
        _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i.roleName))
        this.usersService.blockUser(user).subscribe(response => {
          if (response) {
            this.getAllUsers()
            this.snackBar.open('Updated successfully !')
          }
        })
        break
      case 'deactive':
        _.set(user, 'isActive', false)
        _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i.roleName))
        this.usersService.deActiveUser(user).subscribe(response => {
          if (response) {
            this.getAllUsers()
            this.snackBar.open('Updated successfully !')
          }
        })
        break
      case 'active':
        _.set(user, 'isActive', true)
        _.set(user, 'isBlocked', false)
        _.set(user, 'roles', _.map(_.get($event.row, 'role'), i => i.roleName))
        this.usersService.deActiveUser(user).subscribe(response => {
          if (response) {
            this.getAllUsers()
            this.snackBar.open('Updated successfully !')
          }
        })
        break
    }
  }
  getAllUsers() {
    this.usersService.getAllUsers().subscribe(data => {
      this.usersData = data
      this.filter(this.currentFilter)
    })
  }
  getAllKongUsers() {
    const deptId = "01325419073593344035"
    this.usersService.getAllKongUsers(deptId).subscribe(data => {
      if (data.result.response.content) {
        this.userWholeData = data.result.response.content || []
        console.log(this.configSvc.userProfileV2)
        console.log(data.result.response.content)
      }
    })
  }
  filter(key: string) {
    const usersData: any[] = []


    // if (this.usersData.active_users && this.usersData.active_users.length > 0) {
    //   this.usersData.active_users.forEach((user: any) => {
    //     if (this.currentUser !== user.userId) {
    //       activeUsersData.push({
    //         fullname: user ? `${user.firstName} ${user.lastName}` : null,
    //         email: user.emailId,
    //         position: this.getUserRole(user),
    //         userId: user.userId,
    //         active: user.active,
    //         blocked: user.blocked,
    //       })
    //     }
    //   })
    // }

    // if (this.usersData.blocked_users && this.usersData.blocked_users.length > 0) {
    //   this.usersData.blocked_users.forEach((user: any) => {
    //     if (this.currentUser !== user.userId) {
    //       blockedUsersData.push({
    //         fullname: user ? `${user.firstName} ${user.lastName}` : null,
    //         email: user.emailId,
    //         position: this.getUserRole(user),
    //         userId: user.userId,
    //         active: user.active,
    //         blocked: user.blocked,
    //       })
    //     }
    //   })
    // }
    // if (this.usersData.inActive_users && this.usersData.inActive_users.length > 0) {
    //   this.usersData.inActive_users.forEach((user: any) => {
    //     if (this.currentUser !== user.userId) {
    //       inactiveUsersData.push({
    //         fullname: user ? `${user.firstName} ${user.lastName}` : null,
    //         email: user.emailId,
    //         position: this.getUserRole(user),
    //         userId: user.userId,
    //         active: user.active,
    //         blocked: user.blocked,
    //       })
    //     }
    //   })
    // }
    if (key) {
      this.currentFilter = key
      switch (key) {
        case 'active':
          this.userWholeData.forEach((user: USER) => {
            if (!(user.isDeleted)) {
              usersData.push({
                fullname: user ? `${user.firstName} ${user.lastName}` : null,
                email: user.profiledetails && user.profiledetails.personalDetails.primaryEmail || '',
                position: user.roles,
                userId: user.userId,
              })
            }
          })
          this.data = usersData
          break
        case 'inactive':
          this.userWholeData.forEach((user: USER) => {
            if (user.isDeleted) {
              usersData.push({
                fullname: user ? `${user.firstName} ${user.lastName}` : null,
                email: user.profiledetails.personalDetails.primaryEmail,
                position: user.roles,
                userId: user.userId,
              })
            }
          })
          this.data = usersData
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
  getUserRole(user: any) {
    const userRole: any[] = []
    user.roleInfo.forEach((role: { roleName: any }) => {
      userRole.push(role.roleName)
    })
    return userRole
  }
}
