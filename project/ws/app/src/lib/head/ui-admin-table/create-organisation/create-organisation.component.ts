import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import * as _ from 'lodash'
import { CreateMDOService } from '../../../routes/home/services/create-mdo.services'
import { ActivatedRoute } from '@angular/router'
import { LoaderService } from '../../../routes/home/services/loader.service'
import { IUploadedLogoresponse } from '../interface/interfaces'
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
@Component({
  selector: 'ws-app-create-organisation',
  templateUrl: './create-organisation.component.html',
  styleUrls: ['./create-organisation.component.scss']
})
export class CreateOrganisationComponent implements OnInit, OnDestroy {

  @Input() rowData: any
  @Input() orgList: any[] = []
  @Input() dropdownList: {
    statesList: any[],
    ministriesList: any[]
  } = {
      statesList: [],
      ministriesList: [],
    }
  @Input() openMode: string = ''
  @Output() buttonClick = new EventEmitter()
  @Output() organizationCreated = new EventEmitter<any>()

  organisationForm!: FormGroup
  statesList: any = []
  ministriesList: any = []
  selectedLogo: any
  selectedLogoName = ''
  validFileTypes = ['image/png', 'image/jpeg', 'image/jpg']
  maxFileSize = 5  // In MB
  loggedInUserId = ""
  isLoading = false
  filteredStates: any[] = []
  filteredMinistry: any[] = []
  heirarchyObject: any
  selectedLogoFile: any
  uploadedLogoResponse!: IUploadedLogoresponse
  organizationNameList: string[] = []
  ORG_NAME_PATTERN = /^[a-zA-Z0-9 ().,@\-\$\/\\:\[\]!\s]*$/

  untilDestroyed$ = new Subject<void>();
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private createMDOService: CreateMDOService,
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService
  ) {

    this.addOverflowHidden()
  }

  ngOnInit(): void {
    this.loggedInUserId = _.get(this.activatedRoute, 'snapshot.parent.data.configService.userProfile.userId')
    this.initialization()
    if (this.openMode === 'editMode') {
      this.getOrganization(this.rowData.organisation, this.rowData.type.toLowerCase())
    }

    this.organizationNameList = this.orgList.map(org => org.organisation.trim().toLowerCase())
  }

  ngOnDestroy(): void {
    this.removeOverflowHidden()

    this.untilDestroyed$.next()
    this.untilDestroyed$.complete()
  }

  initialization() {

    if (this.dropdownList) {
      this.statesList = _.get(this.dropdownList, 'statesList', [])
      this.filteredStates = [...this.statesList]

      this.ministriesList = _.get(this.dropdownList, 'ministriesList', [])
      this.filteredMinistry = [...this.ministriesList]
    }

    this.organisationForm = this.formBuilder.group({
      organisationName: new FormControl(_.get(this.rowData, 'organisation', ''),
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(this.ORG_NAME_PATTERN)
        ]),
      category: new FormControl(_.get(this.rowData, 'type', ''), [Validators.required]),
      state: new FormControl(_.get(this.rowData, 'state', '')),
      ministry: new FormControl(_.get(this.rowData, 'ministry', '')),
      description: new FormControl(_.get(this.rowData, 'description', ''), [Validators.required, Validators.maxLength(1000)])
    })

    this.selectedLogo = this.rowData?.logo
    this.valueChangeEvents()
  }

  createDuplicateOrgNameValidator(organizationNameList: string[]) {
    return (control: AbstractControl) => {
      if (!organizationNameList || !control.value) {
        return null
      }
      const isDuplicate = organizationNameList.includes(control.value.trim().toLowerCase())
      return isDuplicate ? { duplicateOrgName: true } : null
    }
  }

  get controls() {
    return this.organisationForm.controls
  }

  displayFn(option: any): string {
    return option ? option.orgName : ''
  }

  filterStates(value: string): void {
    const filterValue = value.toLowerCase()
    this.filteredStates = this.statesList.filter((option: any) =>
      option.orgName.toLowerCase().includes(filterValue)
    )
  }

  filterMinistry(value: string): void {
    const filterValue = value.toLowerCase()
    this.filteredMinistry = this.ministriesList.filter((option: any) =>
      option.orgName.toLowerCase().includes(filterValue)
    )
  }

  valueChangeEvents() {
    if (this.organisationForm && this.organisationForm.controls.category) {
      this.organisationForm.controls.category.valueChanges
        .pipe(takeUntil(this.untilDestroyed$)).subscribe(val => {
          if (val === 'state') {
            this.organisationForm.controls.state.setValidators([Validators.required])
            this.organisationForm.controls.state.updateValueAndValidity()
            this.organisationForm.controls.ministry.setValue('')
            this.organisationForm.controls.ministry.clearValidators()
            this.organisationForm.controls.ministry.updateValueAndValidity()
          } else if (val === 'ministry') {
            this.organisationForm.controls.ministry.setValidators([Validators.required])
            this.organisationForm.controls.ministry.updateValueAndValidity()
            this.organisationForm.controls.state.setValue('')
            this.organisationForm.controls.state.clearValidators()
            this.organisationForm.controls.state.updateValueAndValidity()
          }
        })
    }


    this.organisationForm.controls.organisationName.valueChanges
      .pipe(takeUntil(this.untilDestroyed$), debounceTime(500), distinctUntilChanged())
      .subscribe((_value) => {
        const control = this.organisationForm.controls.organisationName
        const existingErrors = control.errors || {}
        const duplicateError = this.createDuplicateOrgNameValidator(this.organizationNameList)(control)

        if (duplicateError) {
          control.setErrors({ ...existingErrors, ...duplicateError })
        } else {
          delete existingErrors.duplicateOrgName
          control.setErrors(Object.keys(existingErrors).length ? existingErrors : null)
        }
      })
  }

  get getCategory() {
    return this.organisationForm.controls.category.value
  }

  closeNaveBar() {
    const event = {
      action: 'close'
    }
    this.buttonClick?.emit(event)
  }

  onSubmitCreateOrganization() {
    const payload = {
      orgName: this.controls['organisationName'].value,
      channel: this.controls['organisationName'].value,
      organisationType: "mdo",
      organisationSubType: "board",
      isTenant: true,
      requestedBy: this.loggedInUserId,

      logo: this.uploadedLogoResponse?.qrcodepath || "",
      description: this.controls['description'].value,
      parentMapId: "",
      sbRootOrgId: this.heirarchyObject?.sbRootOrgId || "",
    }
    if (this.controls['category'].value === 'state') {
      payload.parentMapId = this.controls['state'].value.mapId
    } else {
      payload.parentMapId = this.controls['ministry'].value.mapId

    }

    if (this.openMode === 'editMode') {
      this.updateOrganization(payload)
    } else {
      this.createOrganization(payload)
    }
  }

  private createOrganization(payload: any): void {
    this.loaderService.changeLoad.next(true)
    this.isLoading = true
    this.createMDOService.createOrganization(payload).subscribe({
      next: (response: any) => {
        if (response.result) {
          this.organizationCreated.emit(payload)
          this.snackBar.open('Organization successfully created.', 'X', { panelClass: ['success'] })
          this.closeNaveBar()
          this.loaderService.changeLoad.next(false)
          this.isLoading = false
        }
      },
      error: () => {
        this.loaderService.changeLoad.next(false)
        this.isLoading = false
      }
    })
  }
  private updateOrganization(request: any): void {
    this.loaderService.changeLoad.next(true)
    this.isLoading = true
    const payload = {
      orgName: request.orgName,
      channel: request.channel,
      // organisationSubType: this.heirarchyObject.sbOrgSubType,
      organisationSubType: "board",
      orgId: this.rowData.id,
      logo: this.uploadedLogoResponse?.qrcodepath || this.rowData.logo,
      description: request.description
    }

    this.createMDOService.updateOrganization(payload).subscribe({
      next: (response: any) => {
        if (response.result) {
          this.organizationCreated.emit(payload)
          this.snackBar.open('Organization successfully updated.', 'X', { panelClass: ['success'] })
          this.closeNaveBar()
          this.loaderService.changeLoad.next(false)
          this.isLoading = false
        }
      },
      error: (error: any) => {
        console.error(error)
        this.loaderService.changeLoad.next(false)
        this.isLoading = false
      }
    })
  }

  uploadLogo(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files?.length) {
      this.selectedLogoFile = input.files[0]
      this.selectedLogoName = this.selectedLogoFile.name
      const maxFileSize = this.maxFileSize * 1024 * 1024

      if (!this.validFileTypes.includes(this.selectedLogoFile.type)) {
        this.snackBar.open('Invalid file type', 'X', { panelClass: ['error'] })
        return
      }

      if (this.selectedLogoFile.size > maxFileSize) {
        this.snackBar.open(`File size exceeds ${this.maxFileSize} MB. Please select a smaller file.`, 'X', { panelClass: ['error'] })
        return
      }
      this.uploadOrganizationLogo()
    }
  }

  addOverflowHidden() {
    document.body.classList.add('overflow-hidden')
  }

  removeOverflowHidden() {
    document.body.classList.remove('overflow-hidden')
  }

  getOrganization(orgName: string, type: string) {
    this.createMDOService.searchOrgs(orgName, type).subscribe({
      next: (response: any) => {
        const organization = response.result.response.find(
          (org: any) => org.orgName === orgName
        )
        if (organization) {
          this.heirarchyObject = organization
        }
      },
    })
  }

  onSelectStateMinistry(org: any) {
    this.getOrganization(org.orgName, this.controls['category'].value)

  }

  uploadOrganizationLogo() {
    const formData = new FormData()
    formData.append('file', this.selectedLogoFile)
    this.createMDOService.uploadOrganizationLogo(formData).subscribe({
      next: (response: any) => {
        if (response.result && Object.keys(response.result).length > 0 && response.result.qrcodepath) {
          this.uploadedLogoResponse = response.result
          this.selectedLogo = this.uploadedLogoResponse.qrcodepath
        } else {
          this.snackBar.open(`Couldn't upload the logo, Please try again`, 'X', { panelClass: ['error'] })
          this.selectedLogoFile = null
          this.selectedLogoName = ''
        }
      },
      error: () => {
        this.snackBar.open(`Couldn't upload the logo, Please try again`, 'X', { panelClass: ['error'] })
        this.selectedLogoFile = null
        this.selectedLogoName = ''
      }
    })
  }
}
