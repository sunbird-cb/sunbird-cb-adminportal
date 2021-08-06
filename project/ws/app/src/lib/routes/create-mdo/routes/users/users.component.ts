import { AfterViewInit, Component, OnInit, OnDestroy, ElementRef, HostListener, ViewChild } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import * as _ from 'lodash'
import { ProfileV2Service } from '../../../home/services/home.servive'
import { UsersService } from '../../services/users.service'
// interface IUSER {
//   profileDetails: any; isDeleted: boolean; userId: string | null; firstName: any
//   lastName: any; email: any; active: any; blocked: any; roles: any[]
// }
@Component({
  selector: 'ws-app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})

export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  tabledata: any = []
  currentTab = 'users'
  data: any = []
  role: any
  tabsData!: any[]
  elementPosition: any
  sticky = false
  basicInfo: any
  id!: string
  currentDept!: string
  deptName!: string
  userWholeData!: any
  createdDepartment!: any
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
              private route: ActivatedRoute,
              private profile: ProfileV2Service,
              private usersService: UsersService) {
  }
  ngOnInit() {
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
    this.route.params.subscribe(params => {
      this.id = params['id']
      this.id = params['roleId']
      this.currentDept = params['currentDept']
      this.deptName = params['depatName']
      if (this.currentDept && this.deptName) {
        const obj = {
          depName: this.deptName,
          depType: this.currentDept,
        }
        this.createdDepartment = obj
      }

      if (this.id === 'SPV ADMIN') {
        this.getAllActiveUsers()
      } else {
        // this.getAllActiveUsersByDepartmentId(this.id)
        this.getAllKongUsers()
      }

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
      this.getAllActiveUsersByDepartmentId(this.id)
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
  gotoAddAdmin() {
    this.router.navigate([`/app/roles/${this.id}/basicinfo`, { addAdmin: true, currentDept: this.currentDept }])
  }
  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }
  fClickedDepartment(data: any) {
    const usersData: any[] = []
    let roles: any[] = []
    this.userWholeData.forEach((user: any) => {
      user.organisations.forEach((org: { organisationId: string, roles: any }) => {
        // if (org.organisationId === rootOrgId) {
        roles = org.roles
        // }

      })
      const email = _.get(user, 'profileDetails.personalDetails.primaryEmail')
      if (!user.isDeleted && roles.includes(data)) {
        usersData.push({
          fullName: user ? `${user.firstName} ${user.lastName}` : null,
          email: email || 'NA',
          position: roles,
          userId: user.userId,
        })
      }
    })
    this.data = usersData
    this.currentTab = 'users'
  }
  getAllKongUsers() {
    this.usersService.getAllKongUsers(this.id).subscribe(data => {
      if (data.result.response.content) {
        this.userWholeData = data.result.response.content || []
        this.newKongUser()
      }
    })
  }
  newKongUser() {
    // const rootOrgId = _.get(this.route.snapshot.parent, 'data.configService.unMappedUser.rootOrg.rootOrgId')
    const usersData: any[] = []
    let roles: any[] = []
    this.userWholeData.forEach((user: any) => {
      user.organisations.forEach((org: { organisationId: string, roles: any }) => {
        // if (org.organisationId === rootOrgId) {
        roles = org.roles
        // }

      })
      const email = _.get(user, 'profileDetails.personalDetails.primaryEmail')
      if (!(user.isDeleted)) {
        usersData.push({
          fullName: user ? `${user.firstName} ${user.lastName}` : null,
          email: email || user.email,
          position: roles,
          userId: user.userId,
        })
      }
    })
    this.data = usersData
  }
}
