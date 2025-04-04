import { Component, OnInit } from '@angular/core'
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { RequestServiceService } from '../request-service.service'
import { ActivatedRoute, Router } from '@angular/router'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { CompetencyViewComponent } from '../competency-view/competency-view.component'
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component'
/* tslint:disable */
import _ from 'lodash'
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators'
import { preventHtmlAndJs } from '../../../validators/prevent-html-and-js.validator'
import { ICompentencyKeys } from '../interface/interface'
import { environment } from '../../../../../../../../../../src/environments/environment'
import { InitService } from '../../../../../../../../../../src/app/services/init.service'
/* tslint:enable */

@Component({
  selector: 'ws-app-request-copy-details',
  templateUrl: './request-copy-details.component.html',
  styleUrls: ['./request-copy-details.component.scss'],
})
export class RequestCopyDetailsComponent implements OnInit {

  requestForm!: UntypedFormGroup
  specialCharList = `( a-z/A-Z , 0-9 . _ - $ / \ : [ ]' ' !)`
  // tslint:disable-next-line:max-line-length
  noSpecialChar = new RegExp(/^[\u0900-\u097F\u0980-\u09FF\u0C00-\u0C7F\u0B80-\u0BFF\u0C80-\u0CFF\u0D00-\u0D7F\u0A80-\u0AFF\u0B00-\u0B7F\u0A00-\u0A7Fa-zA-Z0-9()$[\]\\.:,_/ -]*$/) // NOSONAR
  // learningList = ['Self-paced', 'Instructor-led']
  learningList = [
    {
      name: 'Self-paced',
      key: 'self-paced',
    },
    {
      name: 'Instructor-led',
      key: 'instructor-led',
    },
  ]
  requestTypeList = ['Single', 'Broadcast']
  competencyList: any[] = []
  allCompetencyTheme: any[] = []
  seletedCompetencyArea: any
  seletedCompetencyTheme: any = []
  allCompetencySubtheme: any[] = []
  seletedCompetencySubTheme: any
  requestTypeData: any[] = []
  isAssignee = false
  isBroadCast = false
  filterCompetencyThemes: any[] = []
  filteredSubTheme: any[] = []
  filteredRequestType: any[] = []
  subthemeCheckedList: any[] = []
  resData = ''
  fullProfile: any
  userId: any
  allCompetencies: any[] = []
  filteredallCompetencies: any[] = []
  statusValue: any
  enableCompetencyAdd = false
  filteredallCompetencyTheme: any = []
  filteredallCompetencySubtheme: any = []
  dialogRefs: any
  demandId: any
  actionBtnName: any
  requestObjData: any
  isHideData = false
  currentUser: any
  filteredAssigneeType: any[] = []
  isCompetencyHide = false

  competencyCtrl!: UntypedFormControl
  competencyArea!: UntypedFormControl
  competencyTheme!: UntypedFormControl
  competencySubtheme!: UntypedFormControl
  data: any
  compentencyKey!: ICompentencyKeys

  constructor(private formBuilder: UntypedFormBuilder,
    private requestService: RequestServiceService,
    private activatedRouter: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
    private initService: InitService,

  ) {

    this.currentUser = sessionStorage.getItem('idDetails') ? sessionStorage.getItem('idDetails') : ''
  }

  ngOnInit() {
    this.compentencyKey = this.initService.configSvc.competency[environment.compentencyVersionKey]

    this.getRequestTypeList()
    this.initFormFroup()
    // this.fullProfile = _.get(this.activatedRouter.snapshot, 'data.configSvc')
    // this.userId = this.fullProfile.userProfile.userId

    this.competencyArea = new UntypedFormControl('')
    this.competencyTheme = new UntypedFormControl('')
    this.competencySubtheme = new UntypedFormControl('')

    if (this.compentencyKey.vKey === 'competencies_v5') {
      this.getFilterEntity()
    } else {
      this.getFilterEntityV2()
    }

    this.activatedRouter.queryParams.subscribe((params: any) => {
      if (params['id']) {
        this.demandId = params.id
        this.actionBtnName = params.name
      }
    })
    this.valuechangeFuctions()
  }

  initFormFroup() {
    this.requestForm = this.formBuilder.group({
      titleName: new UntypedFormControl('', [Validators.required, preventHtmlAndJs(), Validators.pattern(this.noSpecialChar), Validators.minLength(10)]),
      Objective: new UntypedFormControl('', [Validators.required, preventHtmlAndJs(), Validators.pattern(this.noSpecialChar)]),
      userType: new UntypedFormControl('', [preventHtmlAndJs(), Validators.pattern(this.noSpecialChar)]),
      learningMode: new UntypedFormControl(''),
      compArea: new UntypedFormControl(''),
      referenceLink: new UntypedFormControl('', preventHtmlAndJs()),
      requestType: new UntypedFormControl('', Validators.required),
      assignee: new UntypedFormControl(''),
      providers: new UntypedFormControl([[]]),
      providerText: new UntypedFormControl(''),
      queryThemeControl: new UntypedFormControl(''),
      querySubThemeControl: new UntypedFormControl(''),
      [this.compentencyKey.vKey]: [],
      assigneeText: new UntypedFormControl(''),
    })
  }

  getRequestDataById() {
    this.requestService.getRequestDataById(this.demandId).subscribe((data: any) => {
      if (data) {
        this.requestObjData = data
        this.setRequestData()
      }
    }
    )
  }

  setRequestData() {
    this.requestForm.setValue({
      titleName: this.requestObjData.title,
      Objective: this.requestObjData.objective,
      userType: this.requestObjData.typeOfUser ? this.requestObjData.typeOfUser : '',
      learningMode: this.requestObjData.learningMode ? this.requestObjData.learningMode : '',
      [this.compentencyKey.vKey]: [],
      referenceLink: this.requestObjData.referenceLink ? this.requestObjData.referenceLink : '',
      providers: [],
      assignee: {},
      requestType: this.requestObjData.requestType,
      compArea: '',
      providerText: '',
      queryThemeControl: '',
      querySubThemeControl: '',
      assigneeText: '',
    })
    const value = this.requestForm.controls[this.compentencyKey.vKey].value || []
    this.requestObjData.competencies.map((comp: any) => {
      const obj = {
        competencyArea: comp.area || comp.select_area,
        competencyTheme: comp.theme || comp.select_theme,
        competencySubTheme: comp.sub_theme || comp.select_sub_theme,
      }
      value.push(obj)
    })

    this.requestForm.controls[this.compentencyKey.vKey].setValue(value)

    this.selectRequestType(this.requestObjData.requestType)
    if (this.filteredRequestType) {
      if (this.requestObjData.preferredProvider && this.requestObjData.preferredProvider.length) {
        const prefferedData = this.filteredRequestType.filter(option =>
          this.requestObjData.preferredProvider.some((res: any) =>
            res.providerId === option.id
          ))
        if (prefferedData && prefferedData.length) {
          this.requestForm.controls['providers'].setValue(prefferedData)
        }
      }
    }

    if (this.filteredAssigneeType) {
      if (this.requestObjData.assignedProvider) {
        const assignData = this.filteredAssigneeType.find(option =>
          this.requestObjData.assignedProvider.providerId === option.id
        )
        if (assignData) {
          this.requestForm.controls['assignee'].setValue(assignData)
        }
      }

    }
  }

  navigateBack() {
    this.router.navigateByUrl('/app/home/all-request')
  }

  valuechangeFuctions() {
    if (this.requestForm.controls['providerText']) {
      this.requestForm.controls['providerText'].valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        startWith(''),
      ).subscribe((newValue: any) => {
        this.filteredRequestType = this.getHiddenOptions(newValue, this.requestTypeData)
      })
    }

    if (this.requestForm.controls['assigneeText']) {
      this.requestForm.controls['assigneeText'].valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        startWith(''),
      ).subscribe((newValue: any) => {
        this.filteredAssigneeType = this.filterOrgValues(newValue, this.requestTypeData)
      })
    }

  }

  // searchValueData(searchValue: any) {
  //   if (searchValue === 'providerText') {
  //     this.requestForm.controls['providerText'].valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       startWith(''),
  //     ).subscribe((newValue: any) => {
  //       this.filteredRequestType = this.filterOrgValues(newValue, this.requestTypeData)
  //     })
  //   }
  //   if (searchValue === 'assigneeText') {
  //     this.requestForm.controls['assigneeText'].valueChanges.pipe(
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       startWith(''),
  //     ).subscribe((newValue: any) => {
  //       this.filteredAssigneeType = this.filterOrgValues(newValue, this.requestTypeData)
  //     })
  //   }

  // }

  filterValues(searchValue: string, array: any) {
    return array.filter((value: any) =>
      value.name.toLowerCase().includes(searchValue.toLowerCase()))
  }

  filterOrgValues(searchValue: string, array: any) {
    return array.filter((value: any) =>
      value.orgName.toLowerCase().includes(searchValue.toLowerCase()))
  }

  getHiddenOptions(searchValue: string, array: any) {
    const hiddenOptions: any = []
    array.forEach((element: any) => {
      if (element.orgName.toLowerCase().includes(searchValue.toLowerCase())) {
        element['hideOption'] = 'show'
      } else {
        element['hideOption'] = 'hide'
      }
      hiddenOptions.push(element)
    })
    return hiddenOptions
  }

  getFilterEntity() {
    const filterObj = {
      search: {
        type: 'Competency Area',
      },
      filter: {
        isDetail: true,
      },
    }
    this.requestService.getFilterEntity(filterObj).subscribe((res: any) => {
      if (res) {
        this.competencyList = res
        this.allCompetencies = res
        this.filteredallCompetencies = this.allCompetencies
      }

    })
  }

  getFilterEntityV2() {
    this.requestService.getFilterEntityV2().subscribe((res: any) => {
      if (res && res[0] && res[1]) {
        // this.competencyList = res
        const competencyArea = res[0]
        const competencyThemes = res[1].terms.filter((term: any) => term.hasOwnProperty('associations'))

        const structuredResult = competencyArea.terms.map((areaTerm: any) => {
          const areaAssociations = areaTerm.associations || []

          const themes = areaAssociations.map((association: any) => {
            const theme = competencyThemes.find((themeTerm: any) => themeTerm.identifier === association.identifier)

            return theme ? { ...theme } : null
          }).filter((theme: any) => theme)
          return {
            ...areaTerm,
            themes,
          }
        })

        // this.allCompetencies = res
        this.allCompetencies = structuredResult
        this.filteredallCompetencies = this.allCompetencies
      }

    })
  }

  getRequestTypeList() {
    const requestObj = {
      request: {
        filters: {
          isCbp: true,
        },
      },
    }
    this.requestService.getRequestTypeList(requestObj).subscribe((data: any) => {
      this.requestTypeData = data
      this.filteredRequestType = [...this.requestTypeData]
      this.filteredAssigneeType = [...this.requestTypeData]
      if (this.demandId) {
        this.getRequestDataById()
        if (this.actionBtnName === 'view') {
          this.requestForm.disable()
          this.isHideData = true
          this.isCompetencyHide = true
        } else if (this.actionBtnName === 'reassign') {
          this.requestForm.disable()
          // this.isHideData = true;
          this.isCompetencyHide = true
          this.requestForm.controls['assigneeText'].enable()
          this.requestForm.controls['assignee'].enable()
        }
      }

    })
  }

  selectRequestType(item: any) {
    if (item === 'Single') {
      this.isAssignee = true
      this.isBroadCast = false
      this.statusValue = 'Assigned'
      this.requestForm.controls['providers'].setValue('')
      this.requestForm.controls['providers'].clearValidators()
      this.requestForm.controls['providers'].updateValueAndValidity() //
      this.requestForm.controls['assignee'].setValidators([Validators.required])
      this.requestForm.controls['assignee'].updateValueAndValidity()
    } else if (item === 'Broadcast') {
      this.statusValue = 'Unassigned'
      this.isBroadCast = true
      this.isAssignee = false
      this.requestForm.controls['assignee'].setValue('')
      this.requestForm.controls['assignee'].clearValidators()
      this.requestForm.controls['assignee'].updateValueAndValidity()
      this.requestForm.controls['providers'].setValidators([Validators.required])
      this.requestForm.controls['providers'].updateValueAndValidity()
    }

  }

  openedChange(e: any, searchControl: any) {
    // Set search textbox value as empty while opening selectbox
    this.requestForm.controls[searchControl].patchValue('')
    // Focus to search textbox while clicking on selectbox
    if (e === true) {
      // this.contentForm.value.provider.focus()
    }
  }

  // Method to clear search values from textbox
  clearSearch(event: any, searchControl: any) {
    event.stopPropagation()
    this.requestForm.controls[searchControl].patchValue('')
  }

  updateQuery(field: any) {
    if (field === 'theme') {
      this.requestForm.controls['queryThemeControl'].valueChanges.subscribe((newValue: any) => {
        this.filteredallCompetencyTheme = this.filterValues(newValue, this.allCompetencyTheme)
      })
      // this.filteredallCompetencyTheme = this.filterValues(key, this.allCompetencyTheme)
    } else {
      this.requestForm.controls['querySubThemeControl'].valueChanges.subscribe((newValue: any) => {
        this.filteredallCompetencySubtheme = this.filterValues(newValue, this.allCompetencySubtheme)
      })
      // this.filteredallCompetencySubtheme = this.filterValues(newValue, this.allCompetencySubtheme)
    }
  }

  resetSearch(field: any) {
    if (field === 'theme') {
      this.requestForm.controls['queryThemeControl'].setValue('')
      this.filteredallCompetencyTheme = this.allCompetencyTheme
      if (!this.seletedCompetencySubTheme) {
        this.filteredallCompetencySubtheme = []
        this.requestForm.controls['querySubThemeControl'].setValue('')
      } else {
        this.requestForm.controls['querySubThemeControl'].setValue('')
      }
    } else {
      this.requestForm.controls['querySubThemeControl'].setValue('')
      this.filteredallCompetencySubtheme = this.allCompetencySubtheme
    }
  }

  resetCompSubfields() {
    this.enableCompetencyAdd = false
    this.allCompetencySubtheme = []
    this.filteredallCompetencyTheme = []
    this.filteredallCompetencySubtheme = []
    this.requestForm.controls['queryThemeControl'].setValue('')
    this.requestForm.controls['querySubThemeControl'].setValue('')
    this.seletedCompetencyTheme = ''
    this.seletedCompetencySubTheme = ''
  }

  // on selection change of competency area and assign value to allCompetencyTheme
  compAreaSelected(option: any) {
    this.resetCompSubfields()
    this.allCompetencies.forEach((val: any) => {
      if (option.name === val.name) {
        this.seletedCompetencyArea = val
        this.allCompetencyTheme = val.themes || val.children
        this.filteredallCompetencyTheme = this.allCompetencyTheme

      }
    })
  }

  compThemeSelected(option: any) {
    this.enableCompetencyAdd = false
    this.allCompetencyTheme.forEach((val: any) => {
      if ((option.identifier && option.identifier === val.identifier) || (option.name && option.name === val.name)) {
        this.seletedCompetencyTheme = val
        this.allCompetencySubtheme = val.associations || val.children
        this.filteredallCompetencySubtheme = this.allCompetencySubtheme
      }
    })
  }

  compSubThemeSelected(option: any) {
    this.enableCompetencyAdd = true
    this.allCompetencySubtheme.forEach((val: any) => {
      if ((option.identifier && option.identifier === val.identifier) || (option.name && option.name === val.name)) {
        this.seletedCompetencySubTheme = val
      }
    })
  }

  resetCompfields() {
    this.enableCompetencyAdd = false
    this.requestForm.controls['compArea'].setValue('')
    this.allCompetencyTheme = []
    this.allCompetencySubtheme = []
    this.filteredallCompetencyTheme = []
    this.filteredallCompetencySubtheme = []
    this.requestForm.controls['queryThemeControl'].setValue('')
    this.requestForm.controls['querySubThemeControl'].setValue('')
  }

  canPush(arr: any[], obj: any) {
    for (const item of arr) {
      // if (test.id === obj.id) {
      if (item.competencyAreaId === obj.competencyAreaId && item.competencyThemeId === obj.competencyThemeId
        && item.competencySubThemeId === obj.competencySubThemeId) {
        return false
      }
    }
    return true

  }

  refreshData() {

    this.getFilterEntityV2()
  }

  addCompetency() {
    if (this.seletedCompetencyArea && this.seletedCompetencyTheme && this.seletedCompetencySubTheme) {
      let obj: any
      if (this.compentencyKey.vKey === 'competencies_v5') {
        obj = {
          competencyArea: this.seletedCompetencyArea.name,
          competencyAreaId: this.seletedCompetencyArea.id,
          competencyAreaDescription: this.seletedCompetencyArea.description,
          competencyTheme: this.seletedCompetencyTheme.name,
          competencyThemeId: this.seletedCompetencyTheme.id,
          competecnyThemeDescription: this.seletedCompetencyTheme.description,
          competencyThemeType: this.seletedCompetencyTheme.additionalProperties.themeType,
          competencySubTheme: this.seletedCompetencySubTheme.name,
          competencySubThemeId: this.seletedCompetencySubTheme.id,
          competecnySubThemeDescription: this.seletedCompetencySubTheme.description,
        }

      } else {

        obj = {
          competencyArea: this.seletedCompetencyArea.name,
          competencyAreaId: this.seletedCompetencyArea.identifier,
          competencyAreaDescription: this.seletedCompetencyArea.description,
          competencyTheme: this.seletedCompetencyTheme.additionalProperties.displayName,
          competencyThemeId: this.seletedCompetencyTheme.identifier,
          competecnyThemeDescription: this.seletedCompetencyTheme.description,
          competencyThemeType: this.seletedCompetencyTheme.refType,
          competencySubTheme: this.seletedCompetencySubTheme.additionalProperties.displayName,
          competencySubThemeId: this.seletedCompetencySubTheme.identifier,
          competecnySubThemeDescription: this.seletedCompetencySubTheme.description,
        }
      }

      const value = this.requestForm.controls[this.compentencyKey.vKey].value || []
      if (this.canPush(value, obj)) {
        value.push(obj)
        this.requestForm.controls[this.compentencyKey.vKey].setValue(value)
        this.resetCompfields()
        this.refreshData()
      } else {
        this.snackBar.open('This competency is already added')
        this.resetCompfields()
      }
    }

  }

  removeCompetency(id: any): void {
    if (id && !id.competencyArea) {
      const index = _.findIndex(this.requestForm.controls[this.compentencyKey.vKey].value, { id })
      this.requestForm.controls[this.compentencyKey.vKey].value.splice(index, 1)
      this.requestForm.controls[this.compentencyKey.vKey].setValue(this.requestForm.controls[this.compentencyKey.vKey].value)
      this.refreshData()
    } else {
      this.requestForm.controls[this.compentencyKey.vKey].value.forEach((item: any, index: any) => {
        if (item.competencyAreaId === id.competencyAreaId && item.competencyThemeId === id.competencyThemeId
          && item.competencySubThemeId === id.competencySubThemeId) {
          this.requestForm.controls[this.compentencyKey.vKey].value.splice(index, 1)
          this.requestForm.controls[this.compentencyKey.vKey].setValue(this.requestForm.controls[this.compentencyKey.vKey].value)
          this.refreshData()
        }
      })
    }

  }

  view(item?: any) {
    // const seletedItem = this.allCompetencies.filter((v: any) => v.id === (item && item.id))[0]
    // item['children'] = (seletedItem && seletedItem.children) ? seletedItem.children : []
    const dialogRef = this.dialog.open(CompetencyViewComponent, {
      // minHeight: 'auto',
      width: '30%',
      panelClass: 'remove-pad',
      data: item,
      autoFocus: false,
    })
    dialogRef.afterClosed().subscribe((response: any) => {

      if (response && response.action === 'ADD') {
        // this.addCompetency(response)
        // this.refreshData(this.currentActivePage)
      } else if (response && response.action === 'DELETE') {
        this.removeCompetency(response.id)
      }
    })
  }

  onProviderRemoved(provider: any) {
    const compThemeControl = this.requestForm.get('providers') as UntypedFormControl | null
    if (compThemeControl) {
      const themes = compThemeControl.value
      if (themes) {
        const index = themes.indexOf(provider)
        if (index >= 0) {
          themes.splice(index, 1)
          compThemeControl.setValue(themes)
        }
      }
    }
  }

  isOptionDisabled(option: any): boolean {
    const control = this.requestForm.get('providers')
    if (control) {
      const selectedProviders = control.value
      return selectedProviders.length >= 5 && !selectedProviders.includes(option)
    }
    return false
  }

  showSaveButton() {

  }

  showConformationPopUp() {
    this.dialogRefs = this.dialog.open(ConfirmationPopupComponent, {
      disableClose: true,
      data: {
        type: 'conformation',
        icon: 'radio_on',
        title: this.actionBtnName === 'reassign' ? 'Are you sure you want to Re-assign?' : 'Are you sure you want to Create a demand?',
        // subTitle: 'You wont be able to revert this',
        primaryAction: 'Confirm',
        secondaryAction: 'Cancel',
      },
      autoFocus: false,
    })

    this.dialogRefs.afterClosed().subscribe((_res: any) => {
      if (_res === 'confirmed') {
        this.submit()
      }
    })
  }

  submit() {
    if (this.demandId && this.actionBtnName === 'reassign') {
      this.requestForm.enable()
    }
    let competencyDataList: any[] = []
    if (this.requestForm.value[this.compentencyKey.vKey]) {
      competencyDataList = this.requestForm.value[this.compentencyKey.vKey].map((item: any) => ({
        area: item.competencyArea,
        theme: item.competencyTheme,
        sub_theme: item.competencySubTheme,
      }))
    }

    const request: any = {
      title: this.requestForm.value.titleName,
      objective: this.requestForm.value.Objective,
      typeOfUser: this.requestForm.value.userType,
      competencies: competencyDataList,
      referenceLink: this.requestForm.value.referenceLink,
      requestType: this.requestForm.value.requestType,
      // preferredProvider: providerList,
      // assignedProvider: assigneeProvider,
      // status: this.statusValue,
      // source: this.currentUser,

    }

    let providerList: any[] = []
    if (this.requestForm.value.providers && this.isBroadCast) {
      providerList = this.requestForm.value.providers.map((item: any) => ({
        providerName: item.orgName,
        providerId: item.id,
      }))
      request.preferredProvider = providerList
    }
    let assigneeProvider: any
    if (this.requestForm.value.assignee && this.isAssignee) {
      assigneeProvider = {
        providerName: this.requestForm.value.assignee.orgName,
        providerId: this.requestForm.value.assignee.id,
      }
      request.assignedProvider = assigneeProvider
    }

    if (this.requestForm.value.learningMode) {
      request.learningMode = this.requestForm.value.learningMode.toLowerCase()
    }
    if (this.demandId && this.actionBtnName === 'reassign') {
      request.demand_id = this.demandId

    }
    this.showDialogBox('progress')
    this.requestService.createDemand(request).subscribe(res => {
      this.resData = res
      this.dialogRefs.close()
      this.showDialogBox('progress-completed')

      setTimeout(() => {
        this.dialogRefs.close()
        if (this.resData) {
          this.router.navigateByUrl('/app/home/all-request')
          this.snackBar.open('Request submitted successfully ')
        }
      }, 1000)
    },
      (error: any) => {
        this.dialogRefs.close({ error })
        this.snackBar.open('Request Failed')

      }
    )
  }

  showDialogBox(event: any) {
    const dialogData: any = {}
    switch (event) {
      case 'progress':
        dialogData['type'] = 'progress'
        dialogData['icon'] = 'vega'
        dialogData['title'] = 'Processing your request'
        dialogData['subTitle'] = `Wait a second , your request is processing………`
        break
      case 'progress-completed':
        dialogData['type'] = 'progress-completed'
        dialogData['icon'] = 'accept_icon'
        dialogData['title'] = 'Processing your request'
        dialogData['subTitle'] = `Wait a second , your request is processing………`
        dialogData['primaryAction'] = 'Successfully created....'
        break
    }

    this.openDialoagBox(dialogData)
  }

  openDialoagBox(dialogData: any) {
    this.dialogRefs = this.dialog.open(ConfirmationPopupComponent, {
      disableClose: true,
      data: {
        type: dialogData.type,
        icon: dialogData.icon,
        title: dialogData.title,
        subTitle: dialogData.subTitle,
        primaryAction: dialogData.primaryAction,
        secondaryAction: dialogData.secondaryAction,
      },
      autoFocus: false,
    })

    this.dialogRefs.afterClosed().subscribe(() => {
    })
  }

}
