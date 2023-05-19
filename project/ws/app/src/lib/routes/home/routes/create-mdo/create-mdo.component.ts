import { DirectoryService } from '../../services/directory.services'
import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms'
import { MatDialog, MatSnackBar } from '@angular/material'
import { UserPopupComponent } from '../user-popup/user-popup'

import { LoaderService } from '../../services/loader.service'
import { AuthInitService } from '../../services/init.service'
import { ActivatedRoute, Router } from '@angular/router'
import { CreateMDOService } from '../../services/create-mdo.services'
import { EventService, ValueService } from '@sunbird-cb/utils'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ILeftMenu } from '@sunbird-cb/collection'
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators'
import * as _ from 'lodash'
import { Observable } from 'rxjs'
interface IUser { userId: string, fullName: string; email: string; role: string }

export function forbiddenNamesValidator(optionsArray: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!optionsArray) {
      return null
      // tslint:disable-next-line: no-else-after-return
    } else {
      if (control.value) {
        const index = optionsArray.findIndex((op: any) => {
          // tslint:disable-next-line: prefer-template
          // return new RegExp('^' + op.orgname + '$').test(control.orgname)
          return op.orgName === control.value.orgName
        })
        return index < 0 ? { forbiddenNames: { value: control.value.orgName } } : null
      }
      return null
    }
  }
}
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
  stateForm!: FormGroup
  departmentForm!: FormGroup
  formType: 'default' | 'state' | 'department' = 'default'
  states: any[] = []
  masterStates!: Observable<any> | undefined
  ministeries: any[] = []
  masterMinisteries!: Observable<any> | undefined
  departments: any[] = []
  masterDepartments!: Observable<any> | undefined
  orgs: any[] = []
  masterOrgs!: Observable<any> | undefined
  userRoles: string[] = []
  isStateAdmin = false

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
  departmentName!: string
  widgetData!: NsWidgetResolver.IWidgetData<ILeftMenu>
  sideNavBarOpened = true
  isFromDirectory = false
  private bannerSubscription: any
  public screenSizeIsLtMedium = false
  hideMDOField = false
  subTypeId!: any
  depts = ['Domain', 'Exact']

  disableCreateButton = false
  disableStateCreateButton = false
  displayLoader = false

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
  req: any
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private createMdoService: CreateMDOService,
    private router: Router,
    private directoryService: DirectoryService,
    private valueSvc: ValueService,
    private activatedRoute: ActivatedRoute,
    private events: EventService
  ) {
    {
      this.loggedInUserId = _.get(this.activatedRoute, 'snapshot.parent.data.configService.userProfile.userId')
      this.userRoles = _.get(this.activatedRoute, 'snapshot.parent.data.configService.unMappedUser.roles')
      if (this.userRoles.indexOf('STATE_ADMIN') >= 0) {
        this.isStateAdmin = true
      }

      this.contentForm = new FormGroup({
        name: new FormControl(),
        head: new FormControl(),
        deptSubTypeId: new FormControl(),
        deptMdoSubTypeId: new FormControl(),
      })
      this.stateForm = new FormGroup({
        state: new FormControl('', [Validators.required]),
      })
      this.departmentForm = new FormGroup({
        ministry: new FormControl('', [Validators.required]),
        department: new FormControl('', [forbiddenNamesValidator(this.masterDepartments)]),
        organisation: new FormControl('', [forbiddenNamesValidator(this.masterOrgs)]),
      })
      this.activatedRoute.params.subscribe(params => {
        let data = params['data']
        this.department = params['department']
        this.departmentName = params['department']
        if (this.department === 'CBP Providers' || this.department === 'cbp-providers') {
          this.department = 'CBP'
        }
        if (this.departmentName && this.departmentName.toLocaleLowerCase() === 'mdo') {
          this.formType = 'department'
        }
        if (this.departmentName && this.departmentName.toLocaleLowerCase() === 'state') {
          this.formType = 'state'
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
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe((isLtMedium: boolean) => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
    this.getSubDepartment()
    this.fetchDropDownValues()
    this.onStateChange()
    this.onMinisteriesChange()
    this.onDepartmentChange()
    this.onOrgsChange()
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
        this.createMdoService.assignAdminToDepartment(element.userId, this.departmentId, this.departmentRole).subscribe(
          res => {
            if (res) {
              this.snackBar.open('Admin assigned Successfully')
              this.router.navigate(['/app/home/directory', { department: this.department }])
            }
          },
          (err: { error: any }) => {
            this.openSnackbar(err.error.errors[0].message)
          }
        )
      })
    })
  }

  specialCharachters(event: any) {
    if (event.which === 32) {
      event.preventDefault()
      this.disableCreateButton = true
      this.disableStateCreateButton = true
      return false
    }

    if (event.target.value.length) {
      if (event.target.value.startsWith(' ') || event.target.value.endsWith(' ')) {
        this.openSnackbar(`Please check for leading or trailing whitespace`)
      } else {
        this.disableCreateButton = false
        this.disableStateCreateButton = false
      }
    } else {
      this.disableCreateButton = true
      this.disableStateCreateButton = true
    }

    const inp = String.fromCharCode(event.keyCode)
    if (/[a-zA-Z0-9()-/&.]/.test(inp)) {
      return true
    }
    event.preventDefault()
    return false

  }

  fetchDropDownValues() {
    if (this.formType === 'state') {
      this.createMdoService.getStatesOrMinisteries('state').subscribe(res => {
        if (res && res.result && res.result && res.result.response && res.result.response.content) {
          this.states = res.result.response.content
          this.onStateChange()
        }
      })
    }
    if (this.formType === 'department') {
      if (!this.isStateAdmin) {
        this.createMdoService.getStatesOrMinisteries('ministry').subscribe(res => {
          if (res && res.result && res.result && res.result.response && res.result.response.content) {
            this.ministeries = res.result.response.content
            this.onMinisteriesChange()
          }
        })
      } else {
        this.createMdoService.getStatesOrMinisteries('state').subscribe(res => {
          if (res && res.result && res.result && res.result.response && res.result.response.content) {
            this.ministeries = res.result.response.content
            const state = this.ministeries.find(x => x.sbOrgId === _.get(this.activatedRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrgId'))
            this.onMinisteriesChange()
            this.ministrySelected(state)
            if (this.departmentForm) {
              // tslint:disable-next-line: no-non-null-assertion
              this.departmentForm.get('ministry')!.disable()
              // tslint:disable-next-line: no-non-null-assertion
              // this.departmentForm.get('ministry')!.setValue(state)
              this.departmentForm.patchValue({
                ministry: state,
              })

              this.departmentForm.updateValueAndValidity()
            }
          }
        })
      }
    }
  }

  ministrySelected(value: any) {
    // tslint:disable-next-line: no-non-null-assertion
    this.departmentForm.get('department')!.setValue('')
    // tslint:disable-next-line: no-non-null-assertion
    this.departmentForm.get('organisation')!.setValue('')
    this.disableCreateButton = true
    if (value && value.mapId) {
      this.createMdoService.getDeparmentsOfState(value.mapId).subscribe(res => {
        if (res && res.result && res.result && res.result.response && res.result.response.content) {
          this.departments = res.result.response.content
          this.onDepartmentChange()
        }
      })
    }
  }

  departmentSelected(value: any) {
    // tslint:disable-next-line: no-non-null-assertion
    this.departmentForm.get('organisation')!.setValue('')
    this.disableCreateButton = true
    if (value && value.mapId) {
      this.createMdoService.getOrgsOfDepartment(value.mapId).subscribe(res => {
        if (res && res.result && res.result && res.result.response && res.result.response.content) {
          this.orgs = res.result.response.content
          this.onOrgsChange()
        }
      })
    }
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
    this.disableCreateButton = true
    this.displayLoader = true
    if (!this.isUpdate) {
      this.raiseTelemetry()
      if (this.contentForm.value.name !== null
        && this.contentForm.value.deptSubTypeId !== null) {
        this.createMdoService.createDepartment(
          this.contentForm.value,
          this.deptType,
          this.department,
          this.loggedInUserId
        ).subscribe(res => {
          this.displayLoader = false
          this.disableCreateButton = false
          if (res.result.response === 'SUCCESS') {
            this.submittedForm = false
            const obj = {
              id: res.result.organisationId,
              depName: this.contentForm.value.name,
              depType: this.department,
            }
            this.createdDepartment = obj
            this.router.navigate([`/app/roles/${res.result.organisationId}/users`], { queryParams: { currentDept: this.department, roleId: res.result.organisationId, depatName: this.contentForm.value.name } })
            this.openSnackbar(`Success`)

            // this.router.navigate([`/app/home/directory`])
          }
        })
      }
    } else {
      this.raiseTelemetry()
      if (this.contentForm.value.name !== null
        && this.contentForm.value.deptSubTypeId !== null) {
        if (this.deptType) {
          this.deptType = this.deptType.toLowerCase()
        }
        this.createMdoService.updateDepartment(
          this.updateId,
          this.deptType,
          this.department,
          this.loggedInUserId,
          this.contentForm.value
        ).subscribe(res => {
          this.displayLoader = false
          this.disableCreateButton = false
          if (res.result.response === 'SUCCESS') {
            this.openSnackbar(`Success`)
            this.disableCreateButton = false
            this.router.navigate([`/app/home/directory`])
          }
        }
        )
      }
    }

  }

  onStateChange() {
    // tslint:disable-next-line: no-non-null-assertion
    this.masterStates = this.stateForm.get('state')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map(value => typeof (value) === 'string' ? value : (value && value.orgName ? value.orgName : '')),
        map(orgName => orgName ? this.filterStates(orgName) : this.states.slice())
      )

    this.masterStates.subscribe(() => {
      // tslint:disable-next-line: no-non-null-assertion
      // this.stateForm.get('state')!.setValidators([Validators.required, forbiddenNamesValidator(event)])
      this.stateForm.updateValueAndValidity()
    })
  }

  onMinisteriesChange() {
    // tslint:disable-next-line: no-non-null-assertion
    this.masterMinisteries = this.departmentForm.get('ministry')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map(value => typeof (value) === 'string' ? value : (value && value.orgName ? value.orgName : '')),
        map(orgName => orgName ? this.filterMinisteries(orgName) : this.ministeries.slice())
      )

    this.masterMinisteries.subscribe(() => {
      // tslint:disable-next-line: no-non-null-assertion
      // this.departmentForm.get('ministry')!.setValidators([Validators.required, forbiddenNamesValidator(event)])
      this.departmentForm.updateValueAndValidity()
    })
  }
  onDepartmentChange() {
    // tslint:disable-next-line: no-non-null-assertion
    this.masterDepartments = this.departmentForm.get('department')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map(value => typeof (value) === 'string' ? value : (value && value.orgName ? value.orgName : '')),
        map(orgName => orgName ? this.filterDepartments(orgName) : this.departments.slice())
      )

    this.masterDepartments.subscribe((_event: any): void => {
      // tslint:disable-next-line: no-non-null-assertion
      // this.departmentForm.get('department')!.setValidators([forbiddenNamesValidator(event)])
      // tslint:disable-next-line: no-non-null-assertion
      // this.departmentForm.get('department')!.setValidators(null)
      this.departmentForm.updateValueAndValidity()
    })
  }
  onOrgsChange() {
    this.disableCreateButton = true
    // tslint:disable-next-line: no-non-null-assertion
    this.masterOrgs = this.departmentForm.get('organisation')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map(value => typeof (value) === 'string' ? value : (value && value.orgName ? value.orgName : '')),
        map(orgName => orgName ? this.filterOrgs(orgName) : this.orgs.slice())
      )

    this.masterOrgs.subscribe((_event: any) => {
      // tslint:disable-next-line: no-non-null-assertion
      // this.departmentForm.get('organisation')!.setValidators([forbiddenNamesValidator(event)])
      // tslint:disable-next-line: no-non-null-assertion
      // this.departmentForm.get('organisation')!.setValidators(null)
      this.departmentForm.updateValueAndValidity()
    })
  }

  private filterStates(orgname: string): any {
    if (orgname) {
      const filterValue = orgname.toLowerCase()
      return this.states.filter((option: any) => option.orgName.toLowerCase().includes(filterValue))
    }
    return this.states
  }

  filterMinisteries(orgname: string) {
    if (orgname) {
      const filterValue = orgname.toLowerCase()
      return this.ministeries.filter((option: any) => option.orgName.toLowerCase().includes(filterValue))
    }
    return this.ministeries
  }
  filterDepartments(orgname: string) {
    if (orgname) {
      const filterValue = orgname.toLowerCase()
      return this.departments.filter((option: any) => option.orgName.toLowerCase().includes(filterValue))
    }
    return this.departments
  }
  filterOrgs(orgname: string) {
    this.disableCreateButton = false
    if (orgname) {
      const filterValue = orgname.toLowerCase()
      return this.orgs.filter((option: any) => option.orgName.toLowerCase().includes(filterValue))
    }
    return this.orgs
  }

  onSubmitState() {
    this.disableStateCreateButton = true
    this.displayLoader = true
    if (!this.isUpdate) {
      this.raiseTelemetry()
      if (this.stateForm.value.state !== null) {
        const stateFromValue = this.stateForm.value.state
        if (stateFromValue.sbOrgId) {
          this.disableStateCreateButton = true
          this.displayLoader = false
          this.openSnackbar(`Selected State is already onboarded!`)
        } else {
          const req = {
            orgName: stateFromValue.orgName ? stateFromValue.orgName : stateFromValue,
            channel: stateFromValue.orgName ? stateFromValue.orgName : stateFromValue,
            // organisationType: (stateFromValue.sbOrgType || '').toLowerCase(),
            // organisationSubType: (stateFromValue.sbOrgType || '').toLowerCase(),
            organisationType: stateFromValue.sbOrgType ? (stateFromValue.sbOrgType || '').toLowerCase() : 'state',
            organisationSubType: stateFromValue.sbsuborgtype ? (stateFromValue.sbsuborgtype || '').toLowerCase() : 'mdo',
            // mapId: stateFromValue.mapid ? stateFromValue.mapid : "00",
            isTenant: true,
            requestedBy: this.loggedInUserId,
          }
          this.createMdoService.createStateOrMinistry(req).subscribe(
            res => {
              this.disableStateCreateButton = false
              this.displayLoader = false
              if (res.responseCode) {
                this.submittedForm = false
                this.openSnackbar(`State is successfully on-boarded. Check again after few minutes for newly on-boarded State details`)
                this.router.navigate([`/app/home/directory`])
              }
            },
            err => {
              this.disableStateCreateButton = false
              this.displayLoader = false
              this.openSnackbar(`Something went wrong, please try again later`)
              // tslint:disable-next-line: no-console
              console.log('Error :', err)
            }
          )
        }
      }
    } else {
      this.raiseTelemetry()
      if (this.stateForm.value.state !== null) {
        const stateFromValue = this.stateForm.value.state
        const req = {
          orgName: stateFromValue.orgName,
          channel: stateFromValue.orgName,
          organisationType: (stateFromValue.sbOrgType || '').toLowerCase(),
          organisationSubType: (stateFromValue.sbsuborgtype || '').toLowerCase(),
          // mapId: stateFromValue.mapid,
          isTenant: true,
          requestedBy: this.loggedInUserId,
        }
        this.createMdoService.updateStateOrMinistry(req).subscribe(
          res => {
            this.disableStateCreateButton = false
            this.displayLoader = false
            if (res.result.response === 'SUCCESS') {
              if (res.result.response === 'SUCCESS') {
                this.disableStateCreateButton = false
                this.displayLoader = false
                this.openSnackbar(`Success`)
                this.router.navigate([`/app/home/directory`])
              }
            }
          },
          err => {
            this.disableStateCreateButton = false
            this.displayLoader = false
            this.openSnackbar(`Something went wrong, please try again later`)
            // tslint:disable-next-line: no-console
            console.log('Error :', err)
          }
        )
      }
    }
  }
  onSubmitDepartment() {
    this.disableCreateButton = true
    this.displayLoader = true
    if (!this.isUpdate) {
      this.raiseTelemetry()
      let hierarchyObj
      // getRawValue() is used since the ministry field is disabled and form.value doesn't give the value
      // if (this.departmentForm.getRawValue().ministry) {
      //   console.log('this.departmentForm.getRawValue()', this.departmentForm.getRawValue())
      //   hierarchyObj = this.departmentForm.getRawValue().ministry
      //   if (this.departmentForm.value.department) {
      //     hierarchyObj = this.departmentForm.value.department
      //     if (this.departmentForm.value.organisation) {
      //       hierarchyObj = this.departmentForm.value.organisation
      //     }
      //   }
      // }
      hierarchyObj = this.departmentForm.getRawValue()
      if (hierarchyObj) {
        if (hierarchyObj.ministry && hierarchyObj.ministry.sbOrgId && hierarchyObj.department && hierarchyObj.department.sbOrgId
          && hierarchyObj.organisation && hierarchyObj.organisation.sbOrgId) {
          this.openSnackbar(`Selected Org is already onboarded!`)
          this.disableCreateButton = true
          this.displayLoader = false
        } else {
          if (this.departmentForm.getRawValue().ministry && !this.departmentForm.value.department && !this.departmentForm.value.organisation) {
            this.req = {
              orgName: hierarchyObj.ministry && hierarchyObj.ministry.orgName ? hierarchyObj.ministry.orgName : hierarchyObj.ministry,
              channel: hierarchyObj.ministry && hierarchyObj.ministry.orgName ? hierarchyObj.ministry.orgName : hierarchyObj.ministry,
              organisationType: hierarchyObj.ministry && hierarchyObj.ministry.sbOrgType ? (hierarchyObj.ministry.sbOrgType || '').toLowerCase() : 'ministry',
              organisationSubType: hierarchyObj.ministry && hierarchyObj.ministry.sbsuborgtype ? (hierarchyObj.ministry.sbsuborgtype || '').toLowerCase() : 'mdo',
              isTenant: true,
              ...(this.isStateAdmin && { sbRootOrgId: _.get(this.activatedRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrgId') }),
              requestedBy: this.loggedInUserId,
            }
          } else if (this.departmentForm.getRawValue().ministry && this.departmentForm.value.department && !this.departmentForm.value.organisation) {
            this.req = {
              orgName: hierarchyObj.department && hierarchyObj.department.orgName ? hierarchyObj.department.orgName : hierarchyObj.department,
              channel: hierarchyObj.department && hierarchyObj.department.orgName ? hierarchyObj.department.orgName : hierarchyObj.department,
              organisationType: hierarchyObj.ministry.sbsuborgtype ? (hierarchyObj.ministry.sbsuborgtype || '').toLowerCase() : 'mdo',
              organisationSubType: 'department',
              isTenant: true,
              ...(this.isStateAdmin && { sbRootOrgId: _.get(this.activatedRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrgId') }),
              requestedBy: this.loggedInUserId,
              parentMapId: hierarchyObj.ministry.mapId,
            }
          } else if (this.departmentForm.getRawValue().ministry && this.departmentForm.value.department && this.departmentForm.value.organisation) {
            this.req = {
              orgName: hierarchyObj.organisation && hierarchyObj.organisation.orgName ? hierarchyObj.organisation.orgName : hierarchyObj.organisation,
              channel: hierarchyObj.organisation && hierarchyObj.organisation.orgName ? hierarchyObj.organisation.orgName : hierarchyObj.organisation,
              organisationType: hierarchyObj.ministry.sbsuborgtype ? (hierarchyObj.ministry.sbsuborgtype || '').toLowerCase() : 'mdo',
              organisationSubType: 'board',
              isTenant: true,
              ...(this.isStateAdmin && { sbRootOrgId: _.get(this.activatedRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrgId') }),
              requestedBy: this.loggedInUserId,
              parentMapId: hierarchyObj.department.mapId,
            }
          }
          this.createMdoService.createStateOrMinistry(this.req).subscribe(
            res => {
              this.displayLoader = false
              this.disableCreateButton = false
              this.req = ''
              if (res.responseCode) {
                this.submittedForm = false
                this.openSnackbar(`MDO is successfully on-boarded. Check again after few minutes for newly on-boarded MDO details`)

                this.router.navigate([`/app/home/directory`])
              }
            },
            err => {
              this.displayLoader = false
              this.disableCreateButton = false
              this.openSnackbar(`Something went wrong, please try again later`)

              // tslint:disable-next-line: no-console
              console.log('Error :', err)
            }
          )
        }
      }
    } else {
      this.raiseTelemetry()
      let hierarchyObj
      // if (this.departmentForm.value.ministry) {
      //   hierarchyObj = this.departmentForm.value.ministry
      //   if (this.departmentForm.value.department) {
      //     hierarchyObj = this.departmentForm.value.department
      //     if (this.departmentForm.value.organisation) {
      //       hierarchyObj = this.departmentForm.value.organisation
      //     }
      //   }
      // }
      // if (hierarchyObj) {
      //   if (hierarchyObj.sborgid) {
      hierarchyObj = this.departmentForm.getRawValue()
      if (hierarchyObj) {
        if (hierarchyObj.ministry && hierarchyObj.ministry.sbOrgId && hierarchyObj.department && hierarchyObj.department.sbOrgId
          && hierarchyObj.organisation && hierarchyObj.organisation.sbOrgId) {
          this.displayLoader = false
          this.disableCreateButton = false
          this.openSnackbar(`Selected Org is already onboarded!`)
        } else {
          // this.req = {
          //   orgName: hierarchyObj.orgname,
          //   channel: hierarchyObj.orgname,
          //   // organisationType: hierarchyObj.sbOrgType.toLowerCase(),
          //   // organisationSubType: hierarchyObj.sbsuborgtype.toLowerCase(),
          //   organisationType: hierarchyObj.sbOrgType ? (hierarchyObj.sbOrgType || '').toLowerCase() : 'mdo',
          //   organisationSubType: hierarchyObj.sbsuborgtype ? (hierarchyObj.sbsuborgtype || '').toLowerCase() : 'dept',
          //   mapId: hierarchyObj.mapId,
          //   isTenant: true,
          //   requestedBy: this.loggedInUserId,
          // }

          this.req = {
            orgName: hierarchyObj.ministry && hierarchyObj.ministry.orgName ? hierarchyObj.ministry.orgName : hierarchyObj.ministry,
            channel: hierarchyObj.ministry && hierarchyObj.ministry.orgName ? hierarchyObj.ministry.orgName : hierarchyObj.ministry,
            organisationType: hierarchyObj.ministry && hierarchyObj.ministry.sbOrgType ? (hierarchyObj.ministry.sbOrgType || '').toLowerCase() : 'ministry',
            organisationSubType: hierarchyObj.ministry && hierarchyObj.ministry.sbsuborgtype ? (hierarchyObj.ministry.sbsuborgtype || '').toLowerCase() : 'mdo',
            isTenant: true,
            mapId: hierarchyObj.ministry.mapId,
            ...(this.isStateAdmin && { sbRootOrgId: _.get(this.activatedRoute, 'snapshot.parent.data.configService.unMappedUser.rootOrgId') }),
            requestedBy: this.loggedInUserId,
          }
          this.createMdoService.updateStateOrMinistry(this.req).subscribe(
            res => {
              this.displayLoader = false
              this.disableCreateButton = false
              this.req = ''
              if (res.responseCode) {
                this.openSnackbar(`Success`)

                this.router.navigate([`/app/home/directory`])
              }
            },
            err => {
              this.displayLoader = false
              this.openSnackbar(`Something went wrong, please try again later`)
              this.disableCreateButton = false
              // tslint:disable-next-line: no-console
              console.log('Error :', err)
            }
          )
        }
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
  onCancelState() {
    this.router.navigate(['/app/home/directory/state'])
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

  raiseTelemetry() {
    this.events.raiseInteractTelemetry(

      {
        type: 'click',
        subType: 'button',
      },
      {
      },
    )
  }

  displayFnState = (value: any) => {
    return value ? value.orgName : undefined
  }

}
