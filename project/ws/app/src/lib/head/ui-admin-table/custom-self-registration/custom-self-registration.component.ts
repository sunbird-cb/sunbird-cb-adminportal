import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CreateMDOService } from '../create-mdo.services'
import { ICustomRegistrationQRCodeResponse, IRegisteredLinksList } from '../interface/interfaces'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Clipboard } from '@angular/cdk/clipboard'
import { MatDialog } from '@angular/material/dialog'
import { InfoModalComponent } from '../../info-modal/info-modal.component'
import * as fileSaver from 'file-saver'
import { EventService } from '@sunbird-cb/utils'

@Component({
  selector: 'ws-app-custom-self-registration',
  templateUrl: './custom-self-registration.component.html',
  styleUrls: ['./custom-self-registration.component.scss']
})
export class CustomSelfRegistrationComponent implements OnInit, OnDestroy {

  @Output() buttonClick = new EventEmitter()
  @Output() linkGenerated = new EventEmitter()
  @Input() initialData: any = null

  selfRegistrationForm!: FormGroup
  customRegistrationLinks!: ICustomRegistrationQRCodeResponse | any
  isLoading = false
  todayDate = new Date()
  registeredLinksList: IRegisteredLinksList[] = []
  numberOfUsersOnboarded = 0
  latestRegisteredData: IRegisteredLinksList | any = {}
  constructor(
    private formBuilder: FormBuilder,
    private createMdoService: CreateMDOService,
    private snackbar: MatSnackBar,
    private clipboard: Clipboard,
    private dialog: MatDialog,
    private eventsService: EventService,
  ) {

    this.addOverflowHidden()
  }

  ngOnInit(): void {
    this.initializeForm()
  }

  ngOnDestroy(): void {
    this.removeOverflowHidden()
  }

  initializeForm(): void {
    this.selfRegistrationForm = this.formBuilder.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    })
    this.getlistOfRegisterationLinks()

  }

  checkRegistrationStatus(endDateRegistration: any): boolean {
    if (!endDateRegistration) return true

    const endDate = new Date(endDateRegistration)
    const today = new Date()
    return today <= endDate
  }

  closeNaveBar() {
    const event = {
      action: 'close'
    }
    this.buttonClick?.emit(event)
  }

  getlistOfRegisterationLinks() {
    this.createMdoService.getListOfRegisteedLinks({ orgId: this.initialData.orgId }).subscribe({
      next: (response: any) => {
        if (response.result && response.result.qrCodeDataForOrg && response.result.qrCodeDataForOrg.length) {
          this.registeredLinksList = response.result.qrCodeDataForOrg
          this.latestRegisteredData = this.registeredLinksList[this.registeredLinksList.length - 1]
          this.selfRegistrationForm.get('startDate')?.setValue(new Date(this.latestRegisteredData.startDate))
          this.selfRegistrationForm.get('endDate')?.setValue(new Date(this.latestRegisteredData.endDate))
          this.customRegistrationLinks = {
            registrationLink: this.latestRegisteredData.url,
            qrRegistrationLink: this.getQRCodePath(this.latestRegisteredData),

          }
          this.numberOfUsersOnboarded = this.latestRegisteredData.numberOfUsersOnboarded
          this.initialData.QRGenerated = true
        } else {
          this.customRegistrationLinks = undefined
          this.initialData.QRGenerated = false
        }
      },
      error: () => {

      },
    })
  }

  generateQRCodeLink() {
    const dialogRef = this.dialog.open(InfoModalComponent, {
      data: { type: 'generate-link-loader' },
      width: "",
      disableClose: true,
      panelClass: 'info-dialog'

    })

    this.isLoading = true
    const payload = {
      registrationStartDate: (Math.floor(this.selfRegistrationForm.controls['startDate'].value.getTime())),
      registrationEndDate: (Math.floor(this.selfRegistrationForm.controls['endDate'].value.getTime())),
      orgId: this.initialData.orgId
    }

    this.createMdoService.generateSelfRegistrationQRCode(payload).subscribe({
      next: (response: any) => {
        if (response.result && Object.keys(response.result).length > 0 && response.responseCode === 'OK') {

          this.customRegistrationLinks = {
            registrationLink: response.result.registrationLink,
            qrRegistrationLink: this.getQRCodePath(response.result),
          }
          this.latestRegisteredData.status = 'active'

          this.initialData.QRGenerated = true
          this.isLoading = false
          this.linkGenerated.emit(true)
          dialogRef.close()
        } else if (response?.params?.errmsg) {
          this.snackbar.open(response?.params?.errmsg, '', { duration: 3000 })
          this.isLoading = false
          dialogRef.close()

        } else {
          this.snackbar.open("Oops! We couldn't generate the link or QR code.Please try again", '', { duration: 3000 })
          this.isLoading = false
          dialogRef.close()

        }
      },
      error: () => {
        this.isLoading = false
        dialogRef.close()
      }
    })

  }

  getQRCodePath(response: any) {
    if (response && response.qrLogoPath) {
      return response.qrLogoPath.replace('portal', 'spv')
    }
    else if (response && response.qrRegistrationLink) {
      return response.qrRegistrationLink.replace('portal', 'spv')
    }
    else if (response && response.qrLogoFilePath) {
      return response.qrLogoFilePath.replace('portal', 'spv')
    }
    else if (response && response.qrCodeImagePath) {
      return response.qrCodeImagePath.replace('portal', 'spv')
    }
  }

  addOverflowHidden() {
    document.body.classList.add('overflow-hidden')
  }

  removeOverflowHidden() {
    document.body.classList.remove('overflow-hidden')
  }


  copyLinkToClipboard(link: string): void {
    this.clipboard.copy(link)
    this.snackbar.open('Copied!')
  }

  downloadQRCode(QRLink: string) {
    this.raiseInteractTelementry('download-qr')
    fetch(QRLink)
      .then(response => response.blob())
      .then(blob => {
        fileSaver.saveAs(blob, 'QRCode.png')
      })
      .catch(_error => { })
  }

  sendViaEmail(link: string): void {
    this.raiseInteractTelementry('share-on-mail')
    if (!link) return

    const message = `Register for ${this.initialData.orgName} by clicking the link below:\n\n${link}\n\n\n\n`
    const subject = encodeURIComponent('Self Registration Link')
    const body = encodeURIComponent(message)
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`
    window.open(mailtoLink, '_self')
  }


  sendViaWhatsApp(link: string): void {
    this.raiseInteractTelementry('share-on-whatsapp')
    if (!link) return
    const message = `Register for ${this.initialData.orgName} by clicking the link below:\n\n${link + ' '}`

    const encodedLink = encodeURIComponent(message)
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedLink} `
    window.open(whatsappUrl, '_blank')
  }

  raiseInteractTelementry(subType: string) {
    this.eventsService.raiseInteractTelemetry(
      {
        type: 'click',
        subType: subType,
        id: 'share-custom-registration-link',
        pageid: '/app/home/directory/organisation'
      },
      {},
    )
  }
}