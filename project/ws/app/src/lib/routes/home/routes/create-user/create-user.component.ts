import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { UsersService } from '../../services/users.service'
import { MatSnackBar } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'

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
  currentDept: any

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private usersSvc: UsersService) {
    this.route.queryParams.subscribe(params => {
      this.queryParam = params['id']
      this.deptId = params['id']
      this.currentDept = params['currentDept']
      // tslint:disable-next-line:radix
      this.queryParam = parseInt(this.queryParam)
    })
    this.createUserForm = new FormGroup({
      fname: new FormControl('', [Validators.required]),
      lname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      deptType: new FormControl('', [Validators.required]),
      dept: new FormControl('', [Validators.required]),
    })

  }

  ngOnInit() {
    // this.getAllDept()
    this.getAllDepartmentsKong()

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'deptName',
      enableCheckAll: false,
      itemsShowLimit: 10000,
      allowSearchFilter: true,
    }
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

  getAllDepartmentsKong() {
    this.usersSvc.getAllDepartmentsKong(this.deptId).subscribe(res => {
      this.createUserForm.patchValue({
        deptType: res.result.response.channel,
        dept: this.currentDept,
      })
    })
  }

  /** methods related to Dropdown */
  onItemSelect(item: any[]) {
    this.selectedDept = item
    this.departmentoptions.forEach((dept: any) => {
      if (dept.id === this.selectedDept.id) {
        this.rolesList = dept.rolesInfo
      }
    })
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
  onSubmit(form: any) {
    // form.value.department = this.selectedDept ? this.selectedDept.deptName : this.receivedDept.deptName
    const userreq = {
      personalDetails: {
        email: form.value.email,
        firstName: form.value.fname,
        lastName: form.value.lname,
        channel: form.value.deptType,
      },
    }
    this.usersSvc.createUser(userreq).subscribe(userdata => {
      if (userdata) {
        this.router.navigate(['/app/home/users'])
      }
    },                                          err => {
      this.openSnackbar(err)
    })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
}
