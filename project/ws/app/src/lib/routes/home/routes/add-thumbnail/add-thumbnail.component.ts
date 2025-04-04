import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core'
import { Subscription } from 'rxjs'
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { DomSanitizer } from '@angular/platform-browser'
/* tslint:disable */
import _ from 'lodash'
import { environment } from '../../../../../../../../../src/environments/environment'
import { SectorsService } from '../sectors/sectors.service'
import { sectorConstants } from '../sectors/sectors-constats.model'
/* tslint:enable */
@Component({
  selector: 'ws-auth-add-thumbnail',
  templateUrl: './add-thumbnail.component.html',
  styleUrls: ['./add-thumbnail.component.scss'],
})
export class AddThumbnailComponent implements OnInit {
  toggle: any = null
  currentParentId!: string
  startForm!: UntypedFormGroup
  public status = 'draft'
  userId!: string
  searchLanguage = ''
  queryFilter = ''
  currentFilter = 'myimages'
  public pagination!: any
  isAdmin = false
  newDesign = true
  public imageList!: any
  public fetchError = false
  showLoadMore!: boolean
  totalContent!: number
  routerSubscription = <Subscription>{}
  isChecked: boolean
  isEditEnabled = false
  thumbanilSelectval!: string
  @Input() stage = 1
  @Input() type = ''
  @Output() addAppIcon = new EventEmitter<string>()

  canUpdate = true
  @Input() isUpdate = false
  showMainContent: Boolean = true
  srcResult: any
  public imagePath: any
  imgURL: any
  public message: string | undefined

  constructor(
    private sectotsService: SectorsService,
    public dialogRef: MatDialogRef<AddThumbnailComponent>,
    private sanitizer: DomSanitizer,
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.isChecked = false
  }

  ngOnInit() {
    this.pagination = {
      offset: sectorConstants.offset,
      limit: sectorConstants.limit,
    }
    this.startForm = this.formBuilder.group({
      thumbnail: [],
    })
    this.filter('all')
    this.imageList = []

  }

  // upload icon
  onFileSelected(files: any) {
    if (files.length === sectorConstants.zero) {
      return
    }

    const mimeType = files[0].type
    if (mimeType.match(sectorConstants.fileTypeRegex) == null) {
      this.message = 'Only images are supported.'
      return
    }
    this.message = ''
    const reader = new FileReader()
    this.imagePath = files.length ? files[0] : ''
    this.isChecked = true
    reader.readAsDataURL(files.length ? files[0] : '')
    reader.onload = _event => {
      this.imgURL = reader.result
    }
  }
  // toggle the button
  showHideButton() {
    this.showMainContent = this.showMainContent ? false : true
  }

  // when user load icon
  onValChange(val: any | null = null) {
    this.isChecked = true
    this.thumbanilSelectval = val ? val.identifier : ''
    this.toggle = val
  }

  // get all icons
  filter(key: string | 'myimages' | 'all') {
    if (key) {
      this.fetchContent(false, null)
    }
  }
  // get default icon
  changeToDefaultImg($event: any) {
    $event.target.src = '/assets/instances/eagle/app_logos/default.png'
  }
  // get the icon using API
  fetchContent(loadMoreFlag: boolean, createdBy: string | null) {
    const requestData = {
      request: {
        filters: {
          createdBy,
          compatibilityLevel: {
            min: sectorConstants.minCompatibilityLevel,
            max: sectorConstants.maxCompatibilityLevel,
          },
          contentType: ['Asset'],
          mediaType: ['image'],
          status: ['Draft'],
          resourceCategory: ['sector'],
        },
        query: this.queryFilter,
        sort_by: { lastUpdatedOn: 'desc' },

      },
    }

    this.sectotsService.fetchImagesContent(requestData).subscribe((data: any) => {
      this.imageList =
        loadMoreFlag && !this.queryFilter
          ? (this.imageList || []).concat(
            data && data.result && data.result.content ? _.uniqBy(data.result.content, 'identifier') : [],
          )
          : data && data.result.content
            ? _.uniqBy(data.result.content, 'identifier')
            : []
      this.totalContent = data && data.result.response ? data.result.response.totalHits : sectorConstants.zero
      this.fetchError = false
    },
                                                                  error => {
        // tslint:disable-next-line: no-console
        console.log(error)
      })
  }
  // format the URL to dispaly sector image
  public bypass(uri: string) {
    // tslint:disable-next-line: triple-equals
    if (uri && uri.indexOf(environment.contentBucket) != -1) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(uri)
    }
    return '/assets/instances/eagle/app_logos/default.png'
  }
  // upload new icon
  public uploadThumbnail() {
    this.dialogRef.close({ imgUrl: this.toggle ? this.toggle.artifactUrl : '' })
  }
  // upload the selected the icon
  public uploadSelectedThumbnail() {
    this.dialogRef.close({ file: this.imagePath })
  }
  // format the URL to dispaly sector image
  getUrl(url: string) {
    if (this.sectotsService.getChangedArtifactUrl(url)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.sectotsService.getChangedArtifactUrl(url))
    }
    return '/assets/instances/eagle/app_logos/default.png'
  }

}
