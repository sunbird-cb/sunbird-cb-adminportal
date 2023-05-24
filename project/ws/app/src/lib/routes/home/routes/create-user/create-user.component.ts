import { CreateMDOService } from './../../services/create-mdo.services'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { UsersService } from '../../services/users.service'
import { MatSnackBar } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { DirectoryService } from '../../services/directory.services'
import * as _ from 'lodash'
import { environment } from '../../../../../../../../../src/environments/environment'
import { EventService } from '@sunbird-cb/utils'

@Component({
  selector: 'ws-app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  createUserForm: FormGroup
  namePatern = `^[a-zA-Z\\s\\']{1,32}$`
  rolesList: any = []
  departmentName = ''
  toastSuccess: any
  departmentoptions: any = []
  dropdownSettings = {}
  receivedDept: any
  selectedDept: any
  public userRoles: Set<string> = new Set()
  queryParam: any
  deptId: any
  redirectionPath!: string
  selectedMulti = -1
  currentDept: any
  createdDepartment!: any
  selected!: string
  roles = []
  selectedRoles: string[] = []
  exact!: string[]
  exactPath!: String
  isStateAdmin = false
  loggedInUserId!: string
  disableCreateButton = false
  displayLoader = false
  emailLengthVal = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private directoryService: DirectoryService,
    private createMDOService: CreateMDOService,
    private usersSvc: UsersService,
    private events: EventService) {
    this.route.queryParams.subscribe(params => {
      this.queryParam = params['id']
      this.deptId = params['id']
      this.currentDept = params['currentDept']
      this.redirectionPath = params['redirectionPath']
      if (this.currentDept === 'CBP Providers' || this.currentDept === 'cbp-providers') {
        this.currentDept = 'CBP'
      }
      const dept = params['createDept']
      if (dept) {
        this.createdDepartment = JSON.parse(dept)
      }
      // tslint:disable-next-line:radix
      this.queryParam = parseInt(this.queryParam)
    })
    if (!this.currentDept) {
      if (this.route.snapshot.queryParams.createDept) {
        const deptObj = JSON.parse(this.route.snapshot.queryParams.createDept)
        this.currentDept = deptObj.depType
        if (this.currentDept === 'CBP Providers') {
          this.currentDept = 'CBP'
        }
      } else {
        this.currentDept = 'SPV'
        // if state admin and not from MDO tab
        this.loggedInUserId = _.get(this.route, 'snapshot.parent.data.configService.userProfile.userId')
        const roles: any[] = _.get(this.route, 'snapshot.parent.data.configService.unMappedUser.roles')
        if (roles.indexOf('STATE_ADMIN') >= 0) {
          this.isStateAdmin = true
          // this is fix for the state admin, for roles in create user form
          this.currentDept = 'STATE'
        }
      }

    }

    if (this.createdDepartment) {
      this.createUserForm = new FormGroup({
        fname: new FormControl('', [Validators.required]),
        // lname: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        role: new FormControl('', [Validators.required, Validators.required]),
        dept: new FormControl(this.createdDepartment.depName, [Validators.required]),
      })
    } else {
      this.createUserForm = new FormGroup({
        fname: new FormControl('', [Validators.required]),
        // lname: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        role: new FormControl('', [Validators.required, Validators.required]),
        dept: new FormControl(_.get(this.route, 'snapshot.data.configService.userProfile.departmentName') || '', [Validators.required]),
      })
    }

  }

  ngOnInit() {
    // this.getAllDept()
    this.getAllDepartmentsHeaderAPI()

    // this.getAllDepartmentsKong()
    // this.getAllDepartmentSubType()

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'deptName',
      enableCheckAll: false,
      itemsShowLimit: 10000,
      allowSearchFilter: true,
    }
  }
  getAllDepartmentsHeaderAPI() {
    this.directoryService.getDepartmentTitles().subscribe(res => {
      const departmentHeaderArray = JSON.parse(res.result.response.value)
      departmentHeaderArray.orgTypeList.forEach((ele: { name: any, isHidden: any, roles: [] }) => {
        if (environment.cbpProviderRoles.includes(this.currentDept.toLowerCase())) {
          this.currentDept = 'CBP'
        }
        if (ele.name === this.currentDept.toUpperCase()) {
          this.roles = ele.roles
        }
      })

    })
  }
  // getAllDept() {
  //   this.usersSvc.getAllDepartments().subscribe(res => {
  //     this.departmentoptions = res

  //     if (this.queryParam) {
  //       this.departmentoptions.forEach((dept: any) => {
  //         if (dept.id === this.queryParam) {
  //           this.rolesList = dept.rolesInfo
  //           const item = {
  //             deptName: dept.deptName,
  //             id: dept.id,
  //           }
  //           this.receivedDept = item
  //           this.departmentName = this.receivedDept.deptName
  //         }
  //       })
  //     }
  //   })
  // }

  // getAllDepartmentsKong() {
  //   this.deptId = _.get(this.activatedRoute, 'snapshot.parent.data.configService.userProfile.userId')
  //   this.usersSvc.getAllDepartmentsKong(this.deptId).subscribe(res => {
  //     this.createUserForm.patchValue({
  //       deptType: res.result.response.channel,
  //       dept: this.currentDept,
  //     })
  //   })
  // }

  /** methods related to Dropdown */
  onItemSelect(item: any[]) {
    this.selectedDept = item
    this.departmentoptions.forEach((dept: any) => {
      if (dept.id === this.selectedDept.id) {
        this.rolesList = dept.rolesInfo
      }
    })
  }

  emailVerification(emailId: string) {
    this.emailLengthVal = false
    if (emailId && emailId.length > 0) {
      const email = emailId.split('@')
      if (email && email.length === 2) {
        if ((email[0] && email[0].length > 64) || (email[1] && email[1].length > 255)) {
          this.emailLengthVal = true
        }
      } else {
        this.emailLengthVal = false
      }
    }
  }

  /**On unselecting the option */
  onItemDeSelect() {
    this.selectedDept = ''
    this.createUserForm.value.department = ''
  }

  modifyUserRoles(role: string) {
    if (this.userRoles.has(role)) {
      this.userRoles.delete(role)
    } else {
      this.userRoles.add(role)
    }
  }
  // getAllDepartmentSubType() {
  //   this.directoryService.getDepartmentTitles().subscribe(res => {
  //     const departmentHeaderArray = JSON.parse(res.result.response.value)
  //     // console.log(departmentHeaderArray)
  //   })
  // }
  onSubmit(form: any) {
    // form.value.department = this.selectedDept ? this.selectedDept.deptName : this.receivedDept.deptName
    this.disableCreateButton = true
    this.displayLoader = true
    this.raiseTelemetry()
    const userreq = {
      personalDetails: {
        email: form.value.email,
        firstName: form.value.fname,
        // lastName: form.value.lname,
        channel: form.value.dept,
      },
    }
    this.usersSvc.createUser(userreq).subscribe(
      userdata => {

        this.displayLoader = false
        this.disableCreateButton = false
        if (userdata.userId) {
          if (this.createdDepartment && this.createdDepartment.id) {
            this.deptId = this.createdDepartment.id
          }
          if (!this.deptId) {
            this.deptId = this.route.snapshot.queryParams && this.route.snapshot.queryParams.id
          }
          if (!this.deptId) {
            this.deptId = _.get(this.route, 'snapshot.parent.data.configService.unMappedUser.rootOrg.rootOrgId')
          }
          this.createMDOService.assignAdminToDepartment(userdata.userId, this.deptId, this.createUserForm.value.role)
            .subscribe(
              data => {
                // this.displayLoader = false
                // this.disableCreateButton = false
                this.openSnackbar(`${data.result.response}`)
                if (this.redirectionPath.indexOf('/app/home/') < 0) {
                  // this.exact = this.redirectionPath.split("/app")
                  // this.exactPath = "/app" + this.exact[1]
                  // this.exactPath = this.exactPath.replace("%3B", ";")
                  // this.exactPath = this.exactPath.replace("%3D", "=")
                  location.replace(this.redirectionPath)
                } else {
                  this.router.navigate(['/app/home/directory'])
                }

              },
              (_err: any) => {
                // this.displayLoader = false
                // this.disableCreateButton = false
                this.router.navigate([`/app/home/users`])
                this.openSnackbar(`Error in assigning roles`)
              })
        }
      },
      err => {
        this.displayLoader = false
        this.disableCreateButton = false
        if (err.error.params.errmsg) {
          this.openSnackbar(`${err.error.params.errmsg}`)
        } else {
          this.openSnackbar(`User creation error`)
        }
      })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'button',
      },
      {},
    )
  }

  navigateTo() {
    if (this.createdDepartment) {
      this.router.navigate([`/app/roles/${this.deptId}/users`], { queryParams: { currentDept: this.currentDept, roleId: this.deptId, depatName: this.createdDepartment.depName } })

    } else {
      this.router.navigate([`/app/home/users`])
    }
  }
}
