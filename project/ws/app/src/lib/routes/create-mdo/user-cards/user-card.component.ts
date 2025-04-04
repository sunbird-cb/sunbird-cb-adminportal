import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output,
  QueryList, TemplateRef, ViewChild, ViewChildren,
} from '@angular/core'
import { UntypedFormGroup, UntypedFormControl, Validators, FormControl, FormGroup } from '@angular/forms'
import { UsersService } from '../../../routes/home/services/users.service'
// import { MatLegacyChipInputEvent as MatChipInputEvent } from '@angular/material/legacy-chips'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { MatExpansionPanel } from '@angular/material/expansion'
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
// tslint:disable-next-line
import * as _ from 'lodash'
import { RolesService } from '../../../routes/home/services/roles.service'
import { ActivatedRoute } from '@angular/router'
import { Observable, Subscription } from 'rxjs'
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators'
// import { OtpService } from '../../../users/services/otp.service'
// import { ConfigurationsService } from '@sunbird-cb/utils'
// import { RejectionPopupComponent } from '../rejection-popup/rejection-popup.component'
import { EventService } from '@sunbird-cb/utils'
import { TelemetryEvents } from '../../../routes/home/routes/events/model/telemetry.event.model'
// import { DatePipe } from '@angular/common'

// const EMAIL_PATTERN = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_]+)*@[a-zA-Z0-9]*.[a-zA-Z]{2,}$/
const EMAIL_PATTERN = /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*[a-zA-Z0-9]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,4}$/

@Component({
  selector: 'ws-widget-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  providers: [

  ],
})
export class UserCardComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() userId: any
  @Input() tableData: any
  @Input() usersData: any
  @Input() totalRecords: any
  @Input() tabChangeIndex: any
  @Input() currentFilter: any
  @Input() isApprovals: any
  @Input() handleApiData: any
  @Input() activeTab: any
  @Input() forMentor = false
  @Output() paginationData = new EventEmitter()
  @Output() searchByEnterKey = new EventEmitter()
  @Output() disableButton = new EventEmitter()
  @Output() updateList = new EventEmitter()
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>

  @ViewChild('rejectDialog')
  rejectDialog!: TemplateRef<any>
  @ViewChild('updaterejectDialog')
  updaterejectDialog!: TemplateRef<any>

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any

  @ViewChild('toggleElement', { static: true }) ref!: ElementRef

  startIndex = 0
  lastIndex = 20
  pageSize = 20

  // userStatus: any
  rolesList: any = []
  rolesObject: any = []
  uniqueRoles: any = []
  public userRoles: Set<string> = new Set()
  orguserRoles: any = []
  isMdoAdmin = false
  isMdoLeader = false
  isBoth = false
  updateUserDataForm: UntypedFormGroup
  approveUserDataForm: UntypedFormGroup
  designationsMeta: any = []
  groupsList: any = []
  selectedtags: any[] = []
  reqbody: any
  isTagsEdited = false
  separatorKeysCodes: number[] = [ENTER, COMMA]
  namePatern = '^[a-zA-Z ]*$'
  orgTypeList: any = []
  // public countryCodes: string[] = []
  masterLanguages: Observable<any[]> | undefined
  masterLanguagesEntries: any
  genderList = ['Male', 'Female', 'Others']
  categoryList = ['General', 'OBC', 'SC', 'ST']
  // needApprovalList: any[] = []
  profileData: any[] = []
  userwfData!: any
  comment = ''
  listupdateFieldValues: any[] = []
  actionList: any = []

  phoneNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$'
  emailRegix = `^[\\w\-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`
  pincodePattern = '(^[0-9]{6}$)'
  yearPattern = '(^[0-9]{4}$)'
  empIDPattern = `^[A-Za-z0-9]+$`

  userGroup: any

  otpSend = false
  otpVerified = false
  timerSubscription: Subscription | null = null
  timeLeftforOTP = 0
  isMobileVerified = false
  disableVerifyBtn = false
  qpParam: any
  department: any
  approvalData: any
  showeditText = false
  today = new Date()
  memberAlertMessage = ''
  currentUserRole = ''
  checked = false
  isSPVAdmin = false
  constructor(private usersSvc: UsersService, private roleservice: RolesService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private events: EventService,
    // private datePipe: DatePipe,
    private cdr: ChangeDetectorRef) {
    this.updateUserDataForm = new FormGroup({
      designation: new FormControl('', []),
      group: new FormControl('', [Validators.required]),
      employeeID: new FormControl('', [Validators.pattern(this.empIDPattern)]),
      ehrmsID: new FormControl({ value: '', disabled: true }, []),
      dob: new FormControl('', []),
      primaryEmail: new FormControl('', [Validators.required, Validators.email, Validators.pattern(EMAIL_PATTERN)]),
      // countryCode: new FormControl('+91', []),
      mobile: new UntypedFormControl('', [Validators.required, Validators.pattern(this.phoneNumberPattern)]),
      tags: new UntypedFormControl('', [Validators.pattern(this.namePatern)]),
      roles: new UntypedFormControl('', [Validators.required]),
      domicileMedium: new UntypedFormControl('', []),
      gender: new UntypedFormControl('', []),
      category: new UntypedFormControl('', []),
      pincode: new UntypedFormControl('', []),
    })

    this.approveUserDataForm = new UntypedFormGroup({
      approveDesignation: new UntypedFormControl('', []),
      approveGroup: new UntypedFormControl('', []),
    })

    const fullProfile = _.get(this.route, 'snapshot.parent.data.configService.userRoles')
    // this.department = fullProfile.unMappedUser.rootOrgId
    if (fullProfile) {
      this.isSPVAdmin = fullProfile.has('spv_admin')
    }

    if (this.usersData && this.usersData.length > 0) {
      this.usersData = _.orderBy(this.usersData, item => item.firstName.toUpperCase(), ['asc'])

      // formatting profileStatusUpdatedOn value
      this.usersData.forEach((u: any) => {
        if (u.profileDetails.profileStatusUpdatedOn) {
          const val = u.profileDetails.profileStatusUpdatedOn.split(' ')
          u.profileDetails.profileStatusUpdatedOn = val[0]
        }
      })
    }
  }

  enableUpdateButton(appData: any): boolean {
    let enableBtn = true
    if (appData.needApprovalList) {
      appData.needApprovalList.forEach((field: any) => {
        if (field.label === 'Group' && this.approveUserDataForm.controls.approveGroup.invalid) {
          enableBtn = false
        }
        if (field.label === 'Designation' && this.approveUserDataForm.controls.approveDesignation.invalid) {
          enableBtn = false
        }
      })
    }
    return enableBtn
  }

  ngOnInit() {
    this.init()
  }

  ngOnChanges() {
    if (this.usersData) {
      this.usersData = _.orderBy(this.usersData, item => {
        if (item.profileDetails && item.profileDetails.personalDetails) {
          return item.profileDetails.personalDetails.firstname ?
            item.profileDetails.personalDetails.firstname.toUpperCase() : item.firstName.toUpperCase()
        }
        // tslint:disable-next-line
      }, ['asc'])
    }
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges()
  }

  // for approvals
  async getUserMappedData(approvalData: any) {
    approvalData.forEach((data: any) => {
      if (data.userWorkflow && data.userWorkflow.userInfo) {
        const id = data.userWorkflow.userInfo.wid
        this.usersSvc.getUserById(id).subscribe((res: any) => {
          if (res) {
            data.user = res
            if (this.currentFilter === 'transfers') {
              data.enableToggle = res.profileDetails.profileStatus !== 'NOT-MY-USER' ? true : false
            }

            if (data.user) {
              if (data.needApprovalList && data.needApprovalList.length === 1) {
                data.noneedApprovalList = []
                if (data.needApprovalList[0].feildName === 'group') {
                  const obj = {
                    label: 'Designation',
                    feildName: 'designation',
                    value: data.user.profileDetails.professionalDetails[0].designation || '',
                  }
                  data.noneedApprovalList.push(obj)
                }
                if (data.needApprovalList[0].feildName === 'designation') {
                  const obj = {
                    label: 'Group',
                    feildName: 'group',
                    value: data.user.profileDetails.professionalDetails[0].group || '',
                  }
                  data.noneedApprovalList.push(obj)
                }
              }
            }
          }
        })
      }
    })
  }

  async getFieldsMappedData(approvalData: any) {
    approvalData.forEach((appdata: any) => {
      if (appdata.userWorkflow.wfInfo && appdata.userWorkflow.wfInfo.length > 0) {
        appdata.needApprovalList = []
        appdata.userWorkflow.wfInfo.forEach((wf: any) => {
          if (typeof wf.updateFieldValues === 'string') {
            const fields = JSON.parse(wf.updateFieldValues)
            if (fields.length > 0) {
              fields.forEach((field: any) => {
                const labelKey = Object.keys(field.toValue)[0]
                const feildNameObj = labelKey === 'designation' ? 'Designation' : 'Group'
                if (labelKey === 'designation' || labelKey === 'group') {
                  appdata.needApprovalList.push(
                    Object.assign({
                      wf,
                      feildName: labelKey,
                      label: feildNameObj,
                      value: field.toValue[labelKey],
                      fieldKey: field.fieldKey,
                      wfId: wf.wfId,
                    })
                  )
                }
              })
            }
          }
        })
      }
    })
  }

  async init() {
    // await this.loadCountryCodes()
    await this.loadRoles()
  }

  // async loadCountryCodes() {
  //   this.usersSvc.getMasterNationlity().subscribe((data: any) => {
  //     data.nationality.map((item: any) => {
  //       this.countryCodes.push(item.countryCode)
  //     })

  //     this.updateUserDataForm.patchValue({
  //       countryCode: '+91',
  //     })
  //   },
  //     // tslint:disable-next-line
  //     (_err: any) => {
  //     })
  // }

  async loadRoles() {
    this.roleservice.getAllRoles().subscribe((_data: any) => {
      const parseRoledata = JSON.parse(_data.result.response.value)
      this.orgTypeList = parseRoledata.orgTypeList
    })
  }

  closeOtherPanels(openPanel: MatExpansionPanel) {
    this.panels.forEach(panel => {
      if (panel !== openPanel) {
        panel.close()
      }
    })
  }

  otherDropDownChange(value: any, field: string) {
    if (field === 'designation' && value !== 'Other') {
      this.updateUserDataForm.controls['designation'].setValue(value)
    }
  }

  onChangesLanuage(): void {
    // tslint:disable-next-line: no-non-null-assertion
    this.masterLanguages = this.updateUserDataForm.get('domicileMedium')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map((value: any) => typeof (value) === 'string' ? value : (value && value.name ? value.name : '')),
        map((name: any) => name ? this.filterLanguage(name) : this.masterLanguagesEntries.slice()),
      )
  }

  private filterLanguage(name: string) {
    if (name) {
      const filterValue = name.toLowerCase()
      return this.masterLanguagesEntries.filter((option: any) => option.name.toLowerCase().includes(filterValue))
    }
    return this.masterLanguagesEntries
  }

  numericOnly(event: any): boolean {
    const pattren = /^([0-9])$/
    const result = pattren.test(event.key)
    return result
  }

  onEditUser(user: any, pnael: any) {
    let userval = user
    this.usersSvc.getUserById(user.userId).subscribe((res: any) => {
      if (res) {
        userval = res
        this.usersData.forEach((u: any) => {
          if (u.userId === user.userId) {
            u.enableEdit = true
            userval.enableEdit = true
          } else {
            u.enableEdit = false
          }
        })

        pnael.open()
        this.setUserDetails(userval)
      }
    })
  }

  getApprovalUserData(user: any, data: any, openPanel: MatExpansionPanel) {
    if (openPanel.expanded) {
      user.enableEdit = false
      this.approveUserDataForm.reset()
      user.needApprovalList = []
      this.actionList = []
      this.comment = ''
      this.getApprovalList(data)
    }
  }

  getUerData(user: any, openPanel: MatExpansionPanel, index: any) {
    if (openPanel.expanded) {
      user.enableEdit = false
      const profileDataAll = user

      const profileData = profileDataAll.profileDetails
      this.updateTags(profileData)

      this.usersSvc.getUserById(user.userId).subscribe((res: any) => {
        if (res) {
          // tslint:disable-next-line
          user = res
          // user.enableEdit = false
          this.userRoles.clear()
          this.mapRoles(user)
          this.usersData[index] = user
        }
      })
    }
  }

  mapRoles(user: any) {
    if (this.orgTypeList && this.orgTypeList.length > 0) {
      // New code for roles
      for (let i = 0; i < this.orgTypeList.length; i += 1) {
        if (this.orgTypeList[i].name === 'MDO') {
          _.each(this.orgTypeList[i].roles, rolesObject => {
            if (rolesObject !== 'MDO_LEADER') {
              this.uniqueRoles.push({
                roleName: rolesObject, description: rolesObject,
              })
            }
          })
        }
      }
      this.uniqueRoles.forEach((role: any) => {
        if (!this.rolesList.some((item: any) => item.roleName === role.roleName)) {
          this.rolesList.push(role)
        }
      })
      const usrRoles = user.organisations[0] && user.organisations[0].roles
        ? user.organisations[0].roles : []
      if (usrRoles.length > 0) {
        this.updateUserDataForm.controls['roles'].setValue(usrRoles)
        usrRoles.forEach((role: any) => {
          this.orguserRoles.push(role)
          this.userRoles.add(role)
          // this.modifyUserRoles(role)
        })
      }
    } else {
      this.loadRoles()
      this.mapRoles(user)
    }
  }

  setUserDetails(user: any) {
    if (user && user.profileDetails) {
      this.updateUserDataForm.reset()
      if (user.profileDetails.additionalProperties) {
        if (user.profileDetails.additionalProperties.externalSystemId) {
          this.updateUserDataForm.controls['ehrmsID'].setValue(user.profileDetails.additionalProperties.externalSystemId)
        }
      }
      if (user.profileDetails.professionalDetails) {
        if (user.profileDetails.professionalDetails[0].designation) {
          this.updateUserDataForm.controls['designation'].setValue(user.profileDetails.professionalDetails[0].designation)
        }
        if (user.profileDetails.professionalDetails[0].group) {
          this.updateUserDataForm.controls['group'].setValue(user.profileDetails.professionalDetails[0].group)
        }
      }
      if (user.profileDetails.personalDetails) {
        if (user.profileDetails.personalDetails.primaryEmail) {
          this.updateUserDataForm.controls['primaryEmail'].setValue(user.profileDetails.personalDetails.primaryEmail)
        }
        if (user.profileDetails.personalDetails.mobile) {
          this.updateUserDataForm.controls['mobile'].setValue(user.profileDetails.personalDetails.mobile)
        }
        if (user.profileDetails.personalDetails.gender) {
          if (user.profileDetails.personalDetails.gender === 'FEMALE') {
            this.updateUserDataForm.controls['gender'].setValue('Female')
          } else if (user.profileDetails.personalDetails.gender === 'MALE') {
            this.updateUserDataForm.controls['gender'].setValue('Male')
          } else if (user.profileDetails.personalDetails.gender === 'OTHERS') {
            this.updateUserDataForm.controls['gender'].setValue('Others')
          } else {
            this.updateUserDataForm.controls['gender'].setValue(user.profileDetails.personalDetails.gender)
          }
        }
        if (user.profileDetails.personalDetails.dob) {
          // this.updateUserDataForm.controls['dob'].setValue(user.profileDetails.personalDetails.dob)
          this.updateUserDataForm.patchValue({
            dob: this.getDateFromText(user.profileDetails.personalDetails.dob),
          })
        }
        if (user.profileDetails.personalDetails.domicileMedium) {
          this.updateUserDataForm.controls['domicileMedium'].setValue(user.profileDetails.personalDetails.domicileMedium)
        }
        if (user.profileDetails.personalDetails.category) {
          this.updateUserDataForm.controls['category'].setValue(user.profileDetails.personalDetails.category)
        }
        // if (user.profileDetails.personalDetails.pinCode) {
        //   this.updateUserDataForm.controls['pincode'].setValue(user.profileDetails.personalDetails.pinCode)
        // }
      }

      if (user.profileDetails.employmentDetails) {
        if (user.profileDetails.employmentDetails.pinCode) {
          this.updateUserDataForm.controls['pincode'].setValue(user.profileDetails.employmentDetails.pinCode)
        }
        if (user.profileDetails.employmentDetails.employeeCode) {
          this.updateUserDataForm.controls['employeeID'].setValue(user.profileDetails.employmentDetails.employeeCode)
        }
      }
      this.mapRoles(user)
    }
  }

  private getDateFromText(dateString: string): any {
    if (dateString) {
      const sv: string[] = dateString.split('T')
      if (sv && sv.length > 1) {
        return sv[0]
      }
      const splitValues: string[] = dateString.split('-')
      const [dd, mm, yyyy] = splitValues
      const dateToBeConverted = dd.length !== 4 ? `${yyyy}-${mm}-${dd}` : `${dd}-${mm}-${yyyy}`
      return new Date(dateToBeConverted)
    }
    return ''
  }

  getUseravatarName(user: any) {
    let name = ''
    if (user && user.profileDetails && user.profileDetails.personalDetails) {
      if (user.profileDetails.personalDetails.firstname) {
        name = `${user.profileDetails.personalDetails.firstname}`
      }
    } else {
      name = `${user.firstName}`
    }
    return name
  }

  getApprovalList(approvalData: any) {
    this.userwfData = approvalData
  }

  cancelSubmit(user: any) {
    this.updateUserDataForm.reset()
    user.enableEdit = !user.enableEdit
  }

  modifyUserRoles(role: string) {
    if (this.userRoles.has(role)) {
      this.userRoles.delete(role)
    } else {
      this.userRoles.add(role)
    }
  }

  updateTags(profileData: any) {
    this.selectedtags = _.get(profileData, 'additionalProperties.tag') || []
  }

  addActivity(event: any) {
    const input = event.input
    const value = event.value as string
    // if ((value && value.trim()) && this.updateUserDataForm.valid) {
    if ((value && value.trim())) {
      this.isTagsEdited = true
      this.selectedtags.push(value)
    }
    if (input) {
      input.value = ''
    }
    if (this.updateUserDataForm.get('tags')) {
      // tslint:disable-next-line: no-non-null-assertion
      this.updateUserDataForm.get('tags')!.setValue(null)
    }
    this.updateUserDataForm.controls['tags'].reset()
  }

  removeActivity(interest: any) {
    const index = this.selectedtags.indexOf(interest)
    if (index >= 0) {
      this.selectedtags.splice(index, 1)
      this.isTagsEdited = true
    }
  }

  checkForChange(activityList: any) {
    const newobj: any = []
    activityList.forEach((val: any) => {
      const reqObj = {
        name: val,
      }
      newobj.push(reqObj)
    })
  }

  onChangePage(pe: PageEvent) {
    this.startIndex = (pe.pageIndex) * pe.pageSize
    this.lastIndex = pe.pageSize
    this.paginationData.emit({ pageIndex: this.startIndex, pageSize: pe.pageSize })
  }

  onSearch(event: any) {
    this.searchByEnterKey.emit(event)
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
  /* tslint:disable */
  // for approval & rejection
  onClickHandleWorkflow(field: any, action: string) {
    field.action = action
    const req = {
      action,
      comment: '',
      state: 'SEND_FOR_APPROVAL',
      userId: field.wf.userId,
      applicationId: field.wf.applicationId,
      actorUserId: this.userwfData.userInfo.wid,
      wfId: field.wf.wfId,
      serviceName: 'profile',
      updateFieldValues: JSON.parse(field.wf.updateFieldValues),
    }
    if (action === 'APPROVE') {
      // const index = this.actionList.indexOf(req.wfId)
      const index = this.actionList.findIndex((x: any) => x.wfId === req.wfId)
      if (index > -1) {
        this.actionList[index] = req
      } else {
        this.actionList.push(req)
      }
      // this.onApproveOrRejectClick(req)
    } else {
      this.comment = ''
      const dialogRef = this.dialog.open(this.rejectDialog, {
        width: '770px',
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // this.onApproveOrRejectClick(req)
          req.comment = this.comment
          field.comment = this.comment
          // const index = this.actionList.indexOf(req.wfId)
          const index = this.actionList.findIndex((x: any) => x.wfId === req.wfId)
          if (index > -1) {
            this.actionList[index] = req
          } else {
            this.actionList.push(req)
          }
        } else {
          dialogRef.close()
        }
      })
    }

    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.BTN_CONTENT,
      },
      {
        id: field.wf.applicationId,
        type: TelemetryEvents.EnumIdtype.APPLICATION,
      }
    )

    // if (this.currentFilter === 'transfers' && appData !== undefined) {
    //   appData.needApprovalList.forEach((otherField: any) => {
    //     if (otherField.label !== field.label) {
    //       console.log('field', field)
    //       this.onClickHandleWorkflow(field, action)
    //     }
    //   })
    //   if (field.label === 'Group') {
    //     const designationValue = action === 'APPROVE' ? 'approvedesg' : 'rejectdesg'
    //     this.approveUserDataForm.controls.approveDesignation.setValue(designationValue)
    //   } else {
    //     const groupValue = action === 'APPROVE' ? 'approvegroup' : 'rejectgroup'
    //     this.approveUserDataForm.controls.approveGroup.setValue(groupValue)
    //   }
    // }
  }

  onTransferSubmit(panel: any, appData: any) {
    let orgReq = {}
    appData.userWorkflow.wfInfo.forEach((wf: any) => {
      const fields = JSON.parse(wf.updateFieldValues)
      if (fields.length > 0) {
        fields.forEach((field: any) => {
          const labelKey = Object.keys(field.toValue)[0]
          if (labelKey === 'name') {
            orgReq = {
              action: 'APPROVE',
              actorUserId: wf.actorUUID,
              applicationId: wf.applicationId,
              serviceName: wf.serviceName,
              state: 'SEND_FOR_APPROVAL',
              updateFieldValues: fields,
              userId: wf.userId,
              wfId: wf.wfId,
            }
          }
        })
      }
    })

    this.actionList.push(orgReq)
    const datalength = this.actionList.length
    this.actionList.forEach((req: any, index: any) => {
      if (req.action === 'APPROVE') {
        req.comment = ''
      }
      if (index === datalength - 1) {
        panel.close()
        this.comment = ''
        setTimeout(() => {
          this.openSnackbar('Request approved successfully')
          this.updateList.emit()
          // tslint:disable-next-line
        }, 100)
      }
      if (this.approvalData.length === 0) {
        this.disableButton.emit()
      }
    })

  }

  updateRejection(field: any) {
    this.comment = field.comment
    const dialogRef = this.dialog.open(this.updaterejectDialog, {
      width: '770px',
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actionList.forEach((req: any) => {
          if (req.wfId === field.wfId) {
            req.comment = this.comment
            field.comment = this.comment
            this.showeditText = false
          }
        })
      } else {
        dialogRef.close()
      }
    })
  }

  showedit() {
    this.showeditText = true
  }

  toggleMentor(template: any, event: any, user: any) {
    if (event.checked) {
      if (this.activeTab === 'mentor') {
        this.memberAlertMessage = 'Assign this user as a mentor?'
      } else {
        this.memberAlertMessage = 'Assign this user as a mentor? The user will be moved to the Assigned Mentors Tab'
      }

    } else {
      if (this.activeTab === 'verified') {
        this.memberAlertMessage = 'Remove this user from mentor role?'
      } else {
        this.memberAlertMessage = 'Remove this user from the mentor role? You can reverse this in the All Verified Users tab.'
      }

    }
    const dialog = this.dialog.open(template, {
      width: '600px',
    })
    dialog.afterClosed().subscribe((v: any) => {
      if (v) {
        this.saveMentorProfile(user, event)
      } else {
        if (this.activeTab === 'verified') {
          if (event.checked) {
            event.source.checked = false
          } else {
            event.source.checked = true
          }
        }
        if (this.activeTab === 'mentor') {
          if (event.checked) {
            event.source.checked = false
          } else {
            event.source.checked = true
          }
        }
      }
    })
  }

  saveMentorProfile(user: any, event: any) {
    const usrRoles = user.roles ? user.roles : []
    if (usrRoles.length > 0) {
      user.roles.map((role: any) => {
        if (role.role) {
          this.userRoles.add(role.role)
        }
      })
    }
    if (event.checked) {
      this.userRoles.add('MENTOR')
    } else {
      this.userRoles.delete('MENTOR')
    }
    const dreq = {
      request: {
        organisationId: user.rootOrgId,
        userId: user.userId,
        roles: Array.from(this.userRoles),
      },
    }
    this.usersSvc.addUserToDepartmentMentor(dreq).subscribe(res => {
      if (res) {
        if (this.activeTab === 'mentor') {
          this.usersSvc.mentorList$.next('mentor')
        } else {
          this.usersSvc.mentorList$.next('verified')
        }
        if (event.checked) {
          this.snackBar.open('User Assigned as Mentor Successfully')
        } else {
          this.snackBar.open('User Removed from Mentor Role Successfully')
        }

      } else {
        if (event.checked) {
          this.snackBar.open('Error While Assign User as a Mentor')
        } else {
          this.snackBar.open('Error While Removing User as a Mentor')
        }
      }
    })
  }

  getUserRoles(user: any) {
    let userRoles: any = []

    user.roles.map((role: any) => {
      userRoles.push(role.role)
    })

    if (userRoles.indexOf('MENTOR') > -1) {
      return true
    }
    return false
  }
}
