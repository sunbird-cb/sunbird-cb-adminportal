import { Component, OnInit } from '@angular/core'
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
import * as _ from 'lodash'
import { SectorsService } from '../sectors.service'
import { DomSanitizer } from '@angular/platform-browser'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { sectorConstants } from '../sectors-constats.model'

@Component({
  selector: 'ws-app-edit-sector',
  templateUrl: './edit-sector.component.html',
  styleUrls: ['./edit-sector.component.scss'],
})
export class EditSectorComponent implements OnInit {

  currentUser!: string | null
  addSectorForm: UntypedFormGroup
  disableCreateButton = false
  myreg = sectorConstants.nameRegex
  isDisabled = true
  myForm: UntypedFormGroup
  subSectors: any = []
  sectorDetails: any
  id: any
  loading = false

  noHtmlCharacter = new RegExp(/<[^>]*>|(function[^\s]+)|(javascript:[^\s]+)/i)

  constructor(
    public dialog: MatDialog,
    private configSvc: ConfigurationsService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private sectorsService: SectorsService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
    this.addSectorForm = new UntypedFormGroup({
      sectorTitle: new UntypedFormControl({ value: '', disabled: this.isDisabled }, [Validators.required, Validators.pattern(this.myreg)]),
      imgUrl: new UntypedFormControl('', [Validators.required]),
    })

    this.myForm = this.formBuilder.group({
      textboxes: this.formBuilder.array([], Validators.required),
    })
  }
  // Initialize the textbox
  get textboxes() {
    return this.myForm.get('textboxes') as UntypedFormArray
  }
  // Dynamically add textbox for sub sectors
  addTextbox(value: string = '') {
    this.textboxes.push(
      this.formBuilder.control({ value, disabled: value.length }, [Validators.required])
    )
  }

  // Remove sub sectors textbox
  removeTextbox(index: number) {
    this.textboxes.removeAt(index)
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id']
      if (this.id) {
        this.sectorsService.readSector(this.id).subscribe((resp: any) => {
          if (resp && resp.responseCode === 'OK' && resp.result) {
            this.sectorDetails = resp.result.sector
            this.addSectorForm.controls['sectorTitle'].setValue(this.sectorDetails.name)
            this.addSectorForm.controls['imgUrl'].setValue(this.sectorDetails.imgUrl)
            if (this.sectorDetails.children.length) {
              this.sectorDetails.children.map((child: any) => {
                this.addTextbox(child.name)
              })
            }
          }
        },                                                error => {
          this.snackBar.open(error, 'X', { duration: sectorConstants.duration })
        })
      }
    })
  }
  // Navigate to sectors page
  goToList() {
    this.router.navigateByUrl('/app/home/sectors')
  }

  // Add sub sectors
  onSubSectorSubmit() {
    const children: any = [...this.sectorDetails.children]
    const requestBody = {
      request: {
        identifier: this.sectorDetails.identifier,
        subsectors: children,
      },
    }
    this.loading = true
    this.myForm.controls['textboxes'].value.map((el: any) => {
      requestBody.request.subsectors.push({ name: el })
    })
    this.sectorsService.createSubSectors(requestBody).subscribe((resp: any) => {
      if (resp.responseCode === 'OK') {
        this.snackBar.open('Sub-sectors are successfuly created.')
        this.router.navigate([`/app/home/sectors`])
      }
      this.loading = false
    },                                                          eResp => {
      if (eResp && eResp.error && eResp.error.responseCode === 'BAD_REQUEST') {
        this.snackBar.open(eResp.error.params.errmsg)
      }
      if (eResp && eResp.error && eResp.error.responseCode !== 'BAD_REQUEST') {
        this.snackBar.open(
          (eResp && eResp.statusText) ? eResp.statusText : 'Something went wrong.', 'X',
          { duration: sectorConstants.duration }
        )
      }
      this.loading = false
    })

  }

  // format the URL to dispaly sector image
  getUrl(url: string) {
    if (this.sectorsService.getChangedArtifactUrl(url)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.sectorsService.getChangedArtifactUrl(url))
    }
    return '/assets/instances/eagle/app_logos/default.png'
  }

  validateInput(event: string) {
    const regexMatch = event.match(this.noHtmlCharacter)
    if (regexMatch) {
      this.myForm.controls['textboxes'].setErrors({ required: true })
      this.snackBar.open('HTML or Js is not allowed')
    }

  }
}
