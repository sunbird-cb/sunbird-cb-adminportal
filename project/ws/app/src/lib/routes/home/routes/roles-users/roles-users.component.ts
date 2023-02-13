import { Component, OnInit, ElementRef, HostListener, ViewChild, AfterViewInit, OnDestroy } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import * as _ from 'lodash'
import { ProfileV2Service } from '../../../home/services/home.servive'
import { UsersService } from '../../services/users.service'

@Component({
  selector: 'ws-app-roles-users',
  templateUrl: './roles-users.component.html',
  styleUrls: ['./roles-users.component.scss'],
})
export class RolesUsersComponent implements OnInit, AfterViewInit, OnDestroy {
  tabledata: any = []
  currentTab = 'users'
  data: any = []
  role: any
  tabsData!: any[]
  elementPosition: any
  sticky = false
  basicInfo: any
  id!: string
  rolename!: string
  orgiId: any
  currentDept!: string
  deptName!: string
  userWholeData!: any
  createdDepartment!: any
  configSvc: any
  breadcrumbs: any
  private defaultSideNavBarOpenedSubscription: any
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset
    if (windowScroll >= this.elementPosition) {
      this.sticky = true
    } else {
      this.sticky = false
    }
  }

  constructor(private usersSvc: UsersService, private router: Router,
    // tslint:disable-next-line:align
    private route: ActivatedRoute, private profile: ProfileV2Service, private usersService: UsersService) {
  }
  ngOnInit() {
    this.configSvc = _.get(this.route, 'snapshot.parent.data.configService') || {}
    this.tabsData = [
      {
        name: 'Users',
        key: 'users',
        render: true,
        enabled: true,
      },
      {
        name: 'Roles and access',
        key: 'rolesandaccess',
        render: true,
        enabled: true,
      }]

    const url = this.router.url.split('/')
    this.role = url[url.length - 2]
    this.route.queryParams.subscribe(params => {
      this.rolename = params['role']
      this.orgiId = params['orgID']
      this.currentDept = params['currentDept']
      this.deptName = params['depatName']
      this.breadcrumbs = { titles: [{ title: 'Roles and access', url: '/app/home/roles-access' }, { title: this.rolename, url: 'none' }] }
      if (this.currentDept && this.deptName) {
        const obj = {
          depName: this.deptName,
          depType: this.currentDept,
        }
        this.createdDepartment = obj
      }

      this.getAllKongUsers()
    })
    // int left blank
    this.tabledata = {
      columns: [
        { displayName: 'Full name', key: 'fullName' },
        { displayName: 'Email', key: 'email' },
        { displayName: 'Roles', key: 'position' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      sortState: 'asc',
    }

  }
  ngAfterViewInit() {
    // this.elementPosition = this.menuElement.nativeElement.parentElement.offsetTop
    this.elementPosition = 127
  }
  onSideNavTabClick(id: string) {
    this.currentTab = id
    if (this.currentTab === 'users') {
      this.getAllActiveUsersByDepartmentId(this.orgiId)
    }
    const el = document.getElementById(id)
    if (el != null) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
    }
  }

  /* API call to get all roles*/
  getAllActiveUsersByDepartmentId(id: string) {
    this.usersSvc.getUsersByDepartment(id).subscribe(res => {
      this.data = res.active_users.map((user: any) => {
        const userRole: any[] = []
        user.roleInfo.forEach((role: { roleName: any }) => {
          userRole.push(role.roleName)
        })
        return {
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.emailId,
          position: userRole,
          role: user.roleInfo.roleName,
        }
      })
    })

  }
  /* API call to get all roles*/
  getAllActiveUsers() {
    this.profile.getMyDepartment().subscribe(res => {
      this.data = res.active_users.map((user: any) => {
        const userRole: any[] = []
        user.roleInfo.forEach((role: { roleName: any }) => {
          userRole.push(role.roleName)
        })
        return {
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.emailId,
          position: userRole,
          role: user.roleInfo.roleName,
        }
      })
    })
  }
  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }
  getAllKongUsers() {
    this.usersService.getAllRoleUsers(this.orgiId, this.rolename).subscribe(resdata => {
      if (resdata.count) {
        this.userWholeData = resdata.count || []
        this.getMyDepartment()
      }
    })
    //old code
    // this.usersService.getAllKongUsers(this.orgiId).subscribe(data => {
    //   if (data.result.response.content) {
    //     this.userWholeData = data.result.response || []
    //     this.getMyDepartment()
    //   }
    // })
  }
  newKongUser() {
    const usersData: any[] = []
    this.userWholeData.forEach((user: any) => {
      const email = _.get(user, 'profileDetails.personalDetails.primaryEmail')
      if (!(user.isDeleted)) {
        usersData.push({
          fullName: user ? `${user.firstName} ${user.lastName}` : null,
          email: email || user.email,
          position: this.getRoleList(user).toString().replace(',', ', '),
          userId: user.userId,
        })
      }
    })
    this.data = usersData
  }

  onEnterkySearch(enterValue: any) {
    const rootOrgId = this.orgiId
    this.usersSvc.searchUserByenter(enterValue, rootOrgId).subscribe(data => {
      this.userWholeData = data.result.response || []
      this.getMyDepartment()
    })
  }
  getRoleList(user: any) {
    if (user.organisations && user.organisations.length > 0) {
      // tslint:disable-next-line
      return _.map(_.get(_.first(_.filter(user.organisations, { organisationId: _.get(this.configSvc, 'unMappedUser.rootOrg.id') })), 'roles'), role => `${role}`)
    }
    return []
  }
  getMyDepartment() {
    let users: any[] = []
    if (this.userWholeData && this.userWholeData.content && this.userWholeData.content.length > 0) {
      users = _.map(_.compact(_.map(this.userWholeData.content, i => {
        let consider = false
        if (!i.isDeleted && i.organisations && i.organisations.length > 0) {
          _.each(i.organisations, o => {
            if (!o.isDeleted && (o.roles || []).indexOf(this.rolename) >= 0) {
              consider = true
            }
          })
        }
        return consider ? i : null
      })),
        // tslint:disable-next-line
        user => {
          return {
            fullName: `${user.firstName} ${user.lastName}`,
            email: _.get(user, 'profileDetails.personalDetails.primaryEmail') || user.email,
            position: this.getRoleList(user).toString().replace(',', ', '),
            userId: user.userId,
          }
        })
    }
    this.data = users
  }

}
