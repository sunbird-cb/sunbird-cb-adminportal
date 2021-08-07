import { DirectoryService } from '../../services/directory.services'
import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { MatDialog, MatSnackBar } from '@angular/material'
import { UserPopupComponent } from '../user-popup/user-popup'

import { LoaderService } from '../../services/loader.service'
import { AuthInitService } from '../../services/init.service'
import { ActivatedRoute, Router } from '@angular/router'
import { CreateMDOService } from '../../services/create-mdo.services'
import { ValueService } from '@sunbird-cb/utils'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ILeftMenu } from '@sunbird-cb/collection'
import { map } from 'rxjs/operators'
import * as _ from 'lodash'
interface IUser { userId: string, fullName: string; email: string; role: string }
@Component({
  selector: 'ws-app-create-mdo',
  providers: [AuthInitService, LoaderService],
  templateUrl: './create-mdo.component.html',
  styleUrls: ['./create-mdo.component.scss'],
})
export class CreateMdoComponent implements OnInit {
  @Input() isSubmitPressed = false
  @Input() nextAction = 'done'
  @Input() stage = 1
  @Input() type = ''
  createdDepartment: any
  fracData: any = []
  contentForm!: FormGroup

  tabledata: any = []
  data: any = []
  canUpdate = true
  isEditEnabled = false
  canExpiry = true
  mdoId: number | undefined

  fetchTagsStatus: 'done' | 'fetching' | null = null
  complexityLevelList: any
  editorService: any
  submittedForm = true
  departmentId!: string
  departmentRole!: string
  data1: any
  updateId !: number
  selected = ''
  department!: string
  widgetData!: NsWidgetResolver.IWidgetData<ILeftMenu>
  sideNavBarOpened = true
  isFromDirectory = false
  private bannerSubscription: any
  public screenSizeIsLtMedium = false
  hideMDOField = false
  subTypeId!: any
  depts = ['Domain', 'Exact']

  isLtMedium$ = this.valueSvc.isLtMedium$
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  subDepartments!: any
  subMDODepartments!: any
  private defaultSideNavBarOpenedSubscription: any

  isUpdate = false
  isAddAdmin = false
  deptType!: string
  deptSubType!: string
  mdoDepartmentID!: number
  loggedInUserId!: string
  workFlow = [{ isActive: true, isCompleted: false, name: 'Basic Details', step: 0 },
  { isActive: false, isCompleted: false, name: 'Classification', step: 1 },
  { isActive: false, isCompleded: false, name: 'Intended for', step: 2 }]
  constructor(public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private createMdoService: CreateMDOService,
              private router: Router,
              private directoryService: DirectoryService,
              private valueSvc: ValueService,
              private activatedRoute: ActivatedRoute) {
    {

      this.loggedInUserId = _.get(this.activatedRoute, 'snapshot.parent.data.configService.userProfile.userId')
      // console.log(this.loggedInUserId)
      this.contentForm = new FormGroup({
        name: new FormControl(),
        head: new FormControl(),
        deptSubTypeId: new FormControl(),
        deptMdoSubTypeId: new FormControl(),
      })
      this.activatedRoute.params.subscribe(params => {
        let data = params['data']
        this.department = params['department']
        if (this.department === 'CBP Providers') {
          this.department = 'CBP'
        }
        this.isFromDirectory = params['isFromDirectory']
        this.isAddAdmin = params['addAdmin']
        if (this.isAddAdmin) {
          this.submittedForm = false
          // this.isUpdate = true
          this.department = params['currentDept']
          this.departmentId = params['department']
          // this.departmentRole = `${params['currentDept']} ADMIN`
          this.departmentRole = `MDO ADMIN`
        }
        if (data) {
          data = JSON.parse(data)
        }

        if (this.data !== undefined || this.data !== null) {
          // this.isUpdate = true
          if (data) {
            this.updateId = data.row.id
            this.subTypeId = data.row.typeid
            this.isUpdate = true

          }

        }
        if (data) {
          this.contentForm = new FormGroup({
            name: new FormControl(data.row.mdo),
            head: new FormControl(data.row.head),
            deptSubTypeId: new FormControl(),
            deptMdoSubTypeId: new FormControl(),
          })
        }

        // if (this.isUpdate && this.department === 'CBP') {

        //   this.contentForm.controls['deptMdoSubTypeId'].disable()
        // }
      })
      // if (this.isUpdate) {
      //   this.hideMDOField = true
      //   this.contentForm.controls.deptMdoSubTypeId.patchValue(1)
      // } else if (this.department === 'MDO') {
      //   this.contentForm.controls.deptMdoSubTypeId.patchValue(1)
      //   this.hideMDOField = true
      // }
    }
  }
  ngOnInit() {
    this.getAllDepartmentsHeaderAPI()
    this.tabledata = {
      columns: [
        { displayName: 'Full name', key: 'fullName' },
        { displayName: 'Email', key: 'email' },
        { displayName: 'Role', key: 'role' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      sortState: 'asc',
    }
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
    this.getSubDepartment()

  }
  checkCondition(first: string, seconnd: string) {
    if (first && seconnd) {

    }
    return true
  }
  showError(error: string) {
    if (error) {

    }
    return true
  }
  openPopup() {
    const dialogRef = this.dialog.open(UserPopupComponent, {
      maxHeight: 'auto',
      height: '65%',
      width: '80%',
      panelClass: 'remove-pad',
    })
    dialogRef.afterClosed().subscribe((response: any) => {
      this.data = this.getAllResponse(response)
      this.data.forEach((element: { userId: string }) => {
        this.createMdoService.assignAdminToDepartment(element.userId, this.departmentId, this.departmentRole).subscribe(res => {
          if (res) {
            this.snackBar.open('Admin assigned Successfully')
            this.router.navigate(['/app/home/directory', { department: this.department }])
          }
        },                                                                                                              (err: { error: any }) => {
          this.openSnackbar(err.error.errors[0].message)
        })
      })
    })

  }
  getAllResponse(response: any) {
    const tempArray: IUser[] = []
    if (response && response !== null && response !== undefined) {
      this.data = response.data.forEach((users: any) => {
        const obj: IUser = {
          userId: users.userId,
          fullName: `${users.fullname}`,
          email: users.email,
          role: 'ADMIN',
        }
        tempArray.push(obj)
      })
      return tempArray
    }
    return []
  }
  getAllDepartmentsHeaderAPI() {
    this.directoryService.getDepartmentTitles().subscribe(res => {
      const department = JSON.parse(res.result.response.value)
      department.orgTypeList.forEach((types: any) => {
        if (types.name === this.department) {
          this.subDepartments = types.subTypeList
        }
      })
    })
  }
  getSubDepartment() {
    this.directoryService.getDepartmentSubTitles().subscribe(res => {
      const department = JSON.parse(res.result.response.value)
      department.fields.forEach((e: { value: any; name: any }) => {
        if (e.value === this.subTypeId) {
          this.contentForm.controls.deptSubTypeId.patchValue(e.name)
        }
      })
    })
  }
  selectedType(val: string) {
    this.deptType = val
  }
  selectedSubType(val: string) {
    this.deptSubType = val
  }
  onSubmit() {
    if (!this.isUpdate) {
      if (this.contentForm.value.name !== null
        && this.contentForm.value.deptSubTypeId !== null) {
        this.createMdoService.createDepartment(this.contentForm.value, this.deptType,
                                               this.department, this.loggedInUserId).subscribe(res => {
            if (res.result.response === 'SUCCESS') {
              this.submittedForm = false
              const obj = {
                id: res.result.organisationId,
                depName: this.contentForm.value.name,
                depType: this.department,
              }
              this.createdDepartment = obj
              this.openSnackbar(`Success`)
            }
          })
      }
    } else {
      if (this.contentForm.value.name !== null
        && this.contentForm.value.deptSubTypeId !== null) {
        this.createMdoService.updateDepartment(this.updateId, this.deptType,
                                               this.department, this.loggedInUserId).subscribe(res => {
            if (res.result.response === 'SUCCESS') {
              this.openSnackbar(`Success`)
              this.router.navigate([`/app/home/directory`])
            }
          }
          )
      }
    }

  }
  getMdoSubDepartmennt(id: number) {
    let obj
    this.subMDODepartments.forEach((element: any) => {
      if (element.id === id) {
        if (this.isUpdate) {
          obj = element.id
        } else {
          obj = element
        }
      }
    })
    return obj
  }
  onCancel() {
    this.router.navigate(['/app/home/directory', { department: this.department }])
  }
  getRole() {
    return 'MDO ADMIN'
  }
  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  capitalizeFirstLetter(uppercaseString: string) {
    return uppercaseString
  }
  onDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe()
    }
  }

}
