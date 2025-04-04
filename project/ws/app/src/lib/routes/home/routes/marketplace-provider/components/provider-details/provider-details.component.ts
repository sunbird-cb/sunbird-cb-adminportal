import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import * as _ from 'lodash'
import { MarketplaceService } from '../../services/marketplace.service'
import { HttpErrorResponse } from '@angular/common/http'
import { DatePipe } from '@angular/common'
import { forkJoin, of } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { MatSnackBar } from '@angular/material/snack-bar'
import { LoaderService } from '../../../../services/loader.service'
import { environment } from '../../../../../../../../../../../src/environments/environment'

@Component({
  selector: 'ws-app-provider-details',
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.scss'],
})
export class ProviderDetailsComponent implements OnInit, OnChanges {
  @ViewChild('thumbNailInput', { static: false }) thumbNailInput!: ElementRef<HTMLInputElement>
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>

  @Input() providerDetails?: any

  @Output() loadProviderDetails = new EventEmitter<Boolean>()

  helpCenterGuide = {
    header: 'Provider Details: Video Guides and Tips',
    guideNotes: [
      'Ensure all mandatory fields in the onboarding form regarding the content provider are filled. Once completed, proceed to uploading course catalog for the content provider.',
      'Partner code is a unique code that helps to differentiate the content provider.',
    ],
    helpVideoLink: `/assets/public/content/guide-videos/CIOS_Updated_demo.mp4`,
  }
  providerFormGroup!: FormGroup
  providerDetalsBeforUpdate: any

  logoTouched = false
  imageUrl!: string
  thumbnailFile: any
  FILE_UPLOAD_MAX_SIZE = 100 * 1024 * 1024
  pdfUploaded = false
  pdfFile: any
  thumbNailUrl = ''
  uploadedPdfUrl = ''
  fileName = ''
  fileUploadedDate: string | null = ''
  thumbnailResourceId = ''
  pdfResourceId = ''

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private marketPlaceSvc: MarketplaceService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private loaderService: LoaderService,
  ) {
    this.initialization()
  }

  initialization() {
    this.providerFormGroup = this.formBuilder.group({
      contentPartnerName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/), Validators.maxLength(70)]),
      partnerCode: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/), Validators.maxLength(6)]),
      websiteUrl: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/), Validators.maxLength(70)]),
      description: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9,.\-_$/:\[\] ' !]*$/), Validators.maxLength(500)]),
      providerTips: this.formBuilder.array([]),
    })
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.providerDetails && changes.providerDetails.currentValue) {
      this.providerDetalsBeforUpdate = JSON.parse(JSON.stringify(changes.providerDetails.currentValue))
      this.patchProviderDetails(changes.providerDetails.currentValue)
    }
  }

  patchProviderDetails(providerDetails: any) {
    this.providerFormGroup.patchValue({
      contentPartnerName: _.get(providerDetails, 'data.contentPartnerName', ''),
      partnerCode: _.get(providerDetails, 'data.partnerCode', ''),
      websiteUrl: _.get(providerDetails, 'data.websiteUrl', ''),
      description: _.get(providerDetails, 'data.description', ''),
    })
    this.providerFormGroup.controls.partnerCode.disable()
    this.getTipsList.clear()
    this.imageUrl = _.get(providerDetails, 'data.link')
    this.thumbNailUrl = this.imageUrl
    if (_.get(providerDetails, 'data.documentUrl')) {
      this.uploadedPdfUrl = _.get(providerDetails, 'data.documentUrl', '')
      this.fileUploadedDate = _.get(providerDetails, 'data.documentUploadedDate', '')
      this.pdfUploaded = true
      this.fileName = this.getFileName
    }
    _.get(providerDetails, 'data.providerTips', []).forEach((tip: string) => {
      this.addTips(tip)
    })
  }

  get getFileName() {
    let fileName = ''
    const fileNameWithPrefix = this.uploadedPdfUrl.split('/').pop()
    if (fileNameWithPrefix) {
      fileName = fileNameWithPrefix.includes('_')
        ? fileNameWithPrefix.split('_').slice(1).join('_')
        : fileNameWithPrefix
    }
    return fileName
  }

  getControlValidation(controlName: string, validator: string): Boolean {
    const control = this.providerFormGroup.get(controlName)
    if (control && control.errors && control.errors[validator]) {
      return true
    }
    return false
  }

  get getTipsList() {
    return this.providerFormGroup.get('providerTips') as FormArray
  }

  addTips(message = '') {
    this.getTipsList.push(new FormControl(message, Validators.required))
  }

  removeTipAtIndex(index: number) {
    this.getTipsList.removeAt(index)
  }

  getTextLength(controlName: string) {
    return _.get(this.providerFormGroup.get(controlName), 'value.length', 0)
  }

  //#region (thumnail upload)

  onThumbNailSelected(event: any): void {
    this.logoTouched = true
    this.thumbnailFile = event
    const fileName = event.name.replace(/[^A-Za-z0-9_.]/g, '')
    if (this.thumbnailFile) {
      if (fileName.toLowerCase().endsWith('.svg') || fileName.toLowerCase().endsWith('.png')) {
        const fileSizeInKB = this.thumbnailFile.size / 1000
        const minSizeKB = 300
        const maxSizeMB = 2
        const maxSizeKB = maxSizeMB * 1000
        if (fileSizeInKB >= minSizeKB && fileSizeInKB <= maxSizeKB) {
          const reader = new FileReader()
          reader.onload = (e: any) => {
            const img = new Image()
            img.onload = () => {
              this.cropImage(img)
            }
            img.src = e.target.result
          }
          reader.readAsDataURL(this.thumbnailFile)
        } else {
          this.showSnackBar('Please upload image sized between 300 KB and 2 MB')
        }
      } else {
        this.showSnackBar('Please upload svg or png image')
      }
    }
  }

  cropImage(image: HTMLImageElement): void {
    const canvas = this.canvas.nativeElement
    const ctx = canvas.getContext('2d')

    const aspectRatio = 16 / 9
    let width = image.width
    let height = image.height
    if (width / height > aspectRatio) {
      width = height * aspectRatio
    } else {
      height = width / aspectRatio
    }

    const startX = (image.width - width) / 2
    const startY = (image.height - height) / 2

    canvas.width = width
    canvas.height = height

    if (ctx) {
      ctx.drawImage(image, startX, startY, width, height, 0, 0, width, height)
    }
    canvas.toBlob(blob => {
      if (blob) {
        this.thumbnailFile = new File([blob], this.thumbnailFile.name, {
          type: 'image/png',
          lastModified: Date.now(),
        })
      }
    },            'image/png')

    this.imageUrl = canvas.toDataURL('image/png')
  }
  //#endregion

  onDrop(file: File) {
    const fileName = file.name.replace(/[^A-Za-z0-9_.]/g, '')
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      this.showSnackBar('Please upload PDF file')
    } else if (file.size > this.FILE_UPLOAD_MAX_SIZE) {
      this.showSnackBar('file size should not be more than 100 MB')
    } else {
      this.pdfFile = file
      this.pdfUploaded = true
      this.fileName = file.name
      this.fileUploadedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy')
    }
  }

  removePdf() {
    this.pdfFile = null
    this.pdfUploaded = false
    this.fileName = ''
    this.uploadedPdfUrl = ''
  }

  //#region (submit details or update)
  submit() {
    this.logoTouched = true
    if (this.providerFormGroup.valid && this.imageUrl) {
      this.createContentsToUpload()
    }
  }

  createContentsToUpload() {
    const resourceCreationSubscriptions: any = []
    this.loaderService.changeLoad.next(true)
    if (this.thumbnailFile) {
      const formData = new FormData()
      formData.append(
        'content',
        this.thumbnailFile as Blob,
        (this.thumbnailFile as File).name.replace(/[^A-Za-z0-9_.]/g, ''),
      )
      resourceCreationSubscriptions.push(
        this.marketPlaceSvc.uploadThumbNail(formData).pipe(
          mergeMap((res: any) => {
            return of({
              fileType: 'thumbnail',
              result: res.result,
            })
          })
        )
      )
    }
    if (this.pdfFile) {
      const formData = new FormData()
      formData.append(
        'content',
        this.pdfFile as Blob,
        (this.pdfFile as File).name.replace(/[^A-Za-z0-9_.]/g, ''),
      )
      resourceCreationSubscriptions.push(
        this.marketPlaceSvc.uploadCIOSContract(formData).pipe(
          mergeMap((res: any) => {
            return of({
              fileType: 'ciosFile',
              result: res.result,
            })
          })
        )
      )
    }

    forkJoin(resourceCreationSubscriptions).subscribe({
      next: responcess => {
        responcess.forEach((responce: any) => {
          const createdUrl = _.get(responce, 'result.url')
          const urlToReplace = 'https://storage.googleapis.com/igot'
          let url = createdUrl
          if (createdUrl.startsWith(urlToReplace)) {
            const urlSplice = createdUrl.slice(urlToReplace.length).split('/')
            url = `${environment.karmYogiPath}/content-store/${urlSplice.slice(1).join('/')}`
          }
          if (responce.fileType === 'thumbnail') {
            this.thumbNailUrl = url
          } else if (responce.fileType === 'ciosFile') {
            this.uploadedPdfUrl = url
          }
        })
        if (this.providerDetails && this.providerDetails.id) {
          this.upDateProviderDetails()
        } else {
          this.saveProviderDetails()
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loaderService.changeLoad.next(false)
        const errmsg = _.get(error, 'error.params.errMsg', 'Something went worng, please try again later')
        this.showSnackBar(errmsg)
      },
    })

    if (resourceCreationSubscriptions.length === 0 && this.providerDetails && this.providerDetails.id) {
      this.upDateProviderDetails()
    }
  }

  saveProviderDetails() {
    if (this.providerFormGroup.valid && this.imageUrl) {
      const formDetails = this.providerFormGroup.value
      const formBody: any = {
        websiteUrl: formDetails.websiteUrl,
        isActive: true,
        description: formDetails.description,
        contentPartnerName: formDetails.contentPartnerName,
        providerTips: formDetails.providerTips,
        link: this.thumbNailUrl,
        documentUrl: this.uploadedPdfUrl,
        documentUploadedDate: this.fileUploadedDate,
        partnerCode: formDetails.partnerCode.toUpperCase(),
      }

      this.marketPlaceSvc.createProvider(formBody).subscribe({
        next: (responce: any) => {
          this.loaderService.changeLoad.next(false)
          if (responce) {
            setTimeout(() => {
              const successMsg = 'Successfully Onboarded'
              this.showSnackBar(successMsg)
              const providerId = _.get(responce, 'result.id')
              this.router.navigate([`/app/home/marketplace-providers/onboard-partner/${providerId}`])
            },         1000)
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loaderService.changeLoad.next(false)
          const errmsg = _.get(error, 'error.params.errMsg', 'Something went worng, please try again later')
          this.showSnackBar(errmsg)
        },
      })
    } else {
      this.showSnackBar('Please fill all the mandator fields with proper data')
    }
  }

  upDateProviderDetails() {
    if (this.providerFormGroup.valid && this.imageUrl) {
      const formDetails = this.providerFormGroup.value
      this.providerDetalsBeforUpdate['data']['websiteUrl'] = formDetails.websiteUrl
      this.providerDetalsBeforUpdate['data']['isActive'] = true
      this.providerDetalsBeforUpdate['data']['description'] = formDetails.description
      this.providerDetalsBeforUpdate['data']['contentPartnerName'] = formDetails.contentPartnerName
      this.providerDetalsBeforUpdate['data']['providerTips'] = formDetails.providerTips
      this.providerDetalsBeforUpdate['data']['link'] = this.thumbNailUrl
      this.providerDetalsBeforUpdate['data']['documentUrl'] = this.uploadedPdfUrl
      this.providerDetalsBeforUpdate['data']['documentUploadedDate'] = this.fileUploadedDate

      this.marketPlaceSvc.updateProvider(this.providerDetalsBeforUpdate).subscribe({
        next: (responce: any) => {
          this.loaderService.changeLoad.next(false)
          if (responce) {
            setTimeout(() => {
              const successMsg = 'Provider details updated successfully.'
              this.showSnackBar(successMsg)
              this.sendDetailsUpdateEvent()
            },         1000)
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loaderService.changeLoad.next(false)
          const errmsg = _.get(error, 'error.params.errMsg', 'Something went worng, please try again later')
          this.showSnackBar(errmsg)
        },
      })
    } else {
      this.showSnackBar('Please fill all the mandator fields with proper data')
    }
  }

  sendDetailsUpdateEvent() {
    this.loadProviderDetails.emit(true)
  }

  navigateToProvidersDashboard() {
    this.router.navigateByUrl('/app/home/marketplace-providers')
  }
  //#endregion

  showSnackBar(message: string) {
    this.snackBar.open(message)
  }

}
