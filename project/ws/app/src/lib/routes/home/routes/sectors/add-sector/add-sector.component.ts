import { Component, OnInit } from '@angular/core'
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog'
import { ActivatedRoute, Router } from '@angular/router'
import * as _ from 'lodash'
import { AddThumbnailComponent } from '../../add-thumbnail/add-thumbnail.component'
// import { ImageCropComponent } from '../../image-crop/image-crop.component'
import { environment } from '../../../../../../../../../../src/environments/environment'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { SectorsService } from '../sectors.service'
import { DomSanitizer } from '@angular/platform-browser'
import { sectorConstants } from '../sectors-constats.model'

@Component({
  selector: 'ws-app-add-sector',
  templateUrl: './add-sector.component.html',
  styleUrls: ['./add-sector.component.scss'],
})
export class AddSectorComponent implements OnInit {

  currentUser!: string | null
  addSectorForm: UntypedFormGroup
  disableCreateButton = false
  myreg = sectorConstants.nameRegex
  aspectRatio = 1 / 2
  isLoading = false

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private sectorsService: SectorsService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {
    this.currentUser = _.get(this.activatedRoute, 'snapshot.parent.data.configService.userProfile.userId')
    this.addSectorForm = new UntypedFormGroup({
      sectorTitle: new UntypedFormControl('', [Validators.required, Validators.pattern(this.myreg)]),
      imgUrl: new UntypedFormControl('', [Validators.required]),
    })
  }

  ngOnInit() {

  }
  // Navigate to sectors page
  goToList() {
    this.router.navigateByUrl('/app/home/sectors')
  }

  // create sectors
  onSubmit() {
    const reqestBody = {
      request: {
        name: this.addSectorForm.controls['sectorTitle'].value,
        imgUrl: this.addSectorForm.controls['imgUrl'].value,
      },
    }
    this.isLoading = true
    this.sectorsService.createSector(reqestBody).subscribe((resp: any) => {
      if (resp && resp.responseCode === 'OK') {
        this.snackBar.open('Sector is successfuly created.')
        this.router.navigate([`/app/home/sectors`])
      }
      this.isLoading = false
    },                                                     eResp => {
      if (eResp && eResp.error && eResp.error.responseCode === 'BAD_REQUEST') {
        this.snackBar.open(eResp.error.params.errmsg)
      }
      if (eResp && eResp.error && eResp.error.responseCode !== 'BAD_REQUEST') {
        this.snackBar.open(
          (eResp && eResp.statusText) ? eResp.statusText : 'Something went wrong.', 'X',
          { duration: sectorConstants.duration }
        )
      }
      this.isLoading = false
    })
  }

  // format the URL to dispaly sector image
  generateUrl(oldUrl: string) {
    const chunk = oldUrl ? oldUrl.split('/') : []
    const newChunk = environment.contentBucket.split('/')
    const newLink = []
    for (let i = 0; i < chunk.length; i += 1) {
      if (i === 2) {
        newLink.push(newChunk[i])
      } else if (i === 3) {
        newLink.push(environment.contentBucket)
      } else {
        newLink.push(chunk[i])
      }
    }
    const newUrl = newLink.join('/')
    return newUrl
  }
  // Show modal to select the sector image
  openDialog() {
    const dialogConfig = new MatDialogConfig()
    const dialogRef = this.dialog.open(AddThumbnailComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(data => {
      if (data && data.imgUrl) {
        this.addSectorForm.patchValue({
          imgUrl: data.imgUrl,
        })
      } else if (data && data.file) {
        this.uploadAppIcon(data.file)
      }
    })
  }

  // upload sector icon
  uploadAppIcon(file: File) {
    if (!file) {
      return
    }
    // const formdata = new FormData()
    const fileName = file.name

    if (
      !(
        ['.png', '.jpg', '.jpeg'].indexOf(
          `.${fileName
            .toLowerCase()
            .split('.')
            .pop()}`,
        ) > -1
      )
    ) {
      return
    }

    if (file.size > (sectorConstants.fileCount * sectorConstants.fileSize * sectorConstants.fileSize)) {
      this.snackBar.open('Size is greater than allowed.')
      return
    }

    // const dialogRef = this.dialog.open(ImageCropComponent, {
    //   width: '70%',
    //   data: {
    //     isRoundCrop: false,
    //     imageFile: file,
    //     width: sectorConstants.width,
    //     height: sectorConstants.width,
    //     isThumbnail: true,
    //     imageFileName: fileName,
    //   },
    // })

    // dialogRef.afterClosed().subscribe({
    //   next: (result: File) => {
    //     if (result) {
    //       formdata.append('content', result, fileName)
    //       let randomNumber = ''
    //       // tslint:disable-next-line: no-increment-decrement
    //       for (let i = 0; i < 16; i++) {
    //         randomNumber += Math.floor(Math.random() * 10)
    //       }

    //       const requestBody = {
    //         request: {
    //           content: {
    //             code: randomNumber,
    //             contentType: 'Asset',
    //             createdBy: this.currentUser,
    //             creator: this.currentUser,
    //             mimeType: 'image/png',
    //             mediaType: 'image',
    //             name: fileName,
    //             language: ['English'],
    //             license: 'CC BY 4.0',
    //             primaryCategory: 'Asset',
    //           },
    //         },
    //       }
    //       this.sectorsService.createImageContent(requestBody).subscribe((res: any) => {
    //         this.sectorsService
    //           .upload(formdata, {
    //             contentId: res.result.identifier,
    //             contentType: this.sectorsService.CONTENT_BASE_STATIC,
    //           }).subscribe((data: any) => {
    //             if (data.result) {
    //               this.addSectorForm.controls.appIcon.setValue(this.generateUrl(data.result.artifactUrl))
    //             }
    //           })
    //       })
    //     }
    //   },
    // })
  }

  // format the URL to dispaly sector image
  getUrl(url: string) {
    if (this.sectorsService.getChangedArtifactUrl(url)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.sectorsService.getChangedArtifactUrl(url))
    }
    return '/assets/instances/eagle/app_logos/default.png'
  }
}
