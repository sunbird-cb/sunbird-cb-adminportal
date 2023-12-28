import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { EventsService } from '../services/events.service'
import { MatSnackBar, MatPaginator, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material'
import { MatSort } from '@angular/material/sort'
import { ITableData } from '../interfaces/interfaces'
import { MatDialog } from '@angular/material/dialog'
import { ParticipantsComponent } from '../participants/participants.component'
import { SuccessComponent } from '../success/success.component'
import { Router, ActivatedRoute } from '@angular/router'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils'
import * as moment from 'moment'
import { MomentDateAdapter } from '@angular/material-moment-adapter'
/* tslint:disable */
import _ from 'lodash'
import { TelemetryEvents } from '../../events/model/telemetry.event.model'
import { ProfileV2UtillService } from '../services/home-utill.service'
/* tslint:enable */

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
}
@Component({
  selector: 'ws-app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class CreateEventComponent implements OnInit {

  errorMessages = ''
  artifactURL: any
  participantsArr: any = []
  // presentersArr: any = []
  displayedColumns: string[] = ['fullname', 'email', 'type']
  @Input() tableData!: ITableData | undefined
  @Input() data?: []
  @Input() isUpload?: boolean
  @Input() isCreate?: boolean

  @Output() clicked?: EventEmitter<any>
  @Output() actionsClick?: EventEmitter<any>
  @Output() eOnRowClick = new EventEmitter<any>()
  @Output() eOnCreateClick = new EventEmitter<any>()

  createEventForm: FormGroup
  namePatern = `^[a-zA-Z\\s\\']{1,32}$`
  department: any = {}
  departmentName = ''
  toastSuccess: any
  pictureObj: any
  myreg = /^(https?|http):\/\/[^\s/$.?#].[^\s]*$/

  // myreg = /^(http|https:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/

  // eventTypes = [
  //   { title: 'Webinar', desc: 'General discussion involving', border: 'rgb(0, 116, 182)', disabled: false },
  // ]
  evntTypesList = ['Webinar', 'Karmayogi Talks']

  timeArr = [
    { value: '00:00' }, { value: '00:30' }, { value: '01:00' }, { value: '01:30' },
    { value: '02:00' }, { value: '02:30' }, { value: '03:00' }, { value: '03:30' },
    { value: '04:00' }, { value: '04:30' }, { value: '05:00' }, { value: '05:30' },
    { value: '06:00' }, { value: '06:30' }, { value: '07:00' }, { value: '07:30' },
    { value: '08:00' }, { value: '08:30' }, { value: '09:00' }, { value: '09:30' },
    { value: '10:00' }, { value: '10:30' }, { value: '11:00' }, { value: '11:30' },
    { value: '12:00' }, { value: '12:30' }, { value: '13:00' }, { value: '13:30' },
    { value: '14:00' }, { value: '14:30' }, { value: '15:00' }, { value: '15:30' },
    { value: '16:00' }, { value: '16:30' }, { value: '17:00' }, { value: '17:30' },
    { value: '18:00' }, { value: '18:30' }, { value: '19:00' }, { value: '19:30' },
    { value: '20:00' }, { value: '20:30' }, { value: '21:00' }, { value: '21:30' },
    { value: '22:00' }, { value: '22:30' }, { value: '23:00' }, { value: '23:30' },
  ]

  hoursList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  minsList = [0, 15, 30, 45, 59]

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  @ViewChild(MatSort, { static: true }) sort?: MatSort

  dataSource!: any
  widgetData: any
  length!: number
  pageSize = 5
  pageSizeOptions = [5, 10, 20]
  dialogRef: any
  activeUsers: any
  imageSrc: any
  imageSrcURL: any
  currentTab = 'eventInfo'
  userId: any
  username: any
  minDate: any
  maxDate: any
  todayDate: any
  todayTime: any
  eventimageURL: any
  departmentID: any
  orgtimeArr!: {
    value: string
  }[]
  newtimearray: any = []
  disableCreateButton = false
  displayLoader = false
  reqPayload: any

  constructor(private snackBar: MatSnackBar, private eventsSvc: EventsService, private matDialog: MatDialog,
    // tslint:disable-next-line:align
    private router: Router, private configSvc: ConfigurationsService, private changeDetectorRefs: ChangeDetectorRef,
    // tslint:disable-next-line:align
    private activeRoute: ActivatedRoute, private events: EventService, private profileUtilSvc: ProfileV2UtillService
  ) {

    if (this.configSvc.userProfile) {
      this.userId = this.configSvc.userProfile.userId
      this.username = this.configSvc.userProfile.userName
      this.department = this.configSvc.userProfile.departmentName
    } else {
      if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.rootOrgId')) {
        this.departmentID = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.rootOrgId')
      }
      if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.departmentName')) {
        this.department = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.departmentName')
      }
      if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.userId')) {
        this.userId = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.userId')
      }
      if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.userName')) {
        this.username = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.userName')
      }
    }
    this.createEventForm = new FormGroup({
      eventPicture: new FormControl('', [Validators.required]),
      eventTitle: new FormControl('', [Validators.required]),
      // summary: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      agenda: new FormControl('', []),
      // isItKarmayogiTalk: new FormControl('', []),
      eventType: new FormControl('', [Validators.required]),
      eventDate: new FormControl('', [Validators.required]),
      eventTime: new FormControl('', [Validators.required]),
      eventDurationHours: new FormControl(0, [Validators.required]),
      eventDurationMinutes: new FormControl(30, [Validators.required]),
      conferenceLink: new FormControl('', [Validators.required, Validators.pattern(this.myreg)]),
      presenters: new FormControl('', []),
    })

    // this.createEventForm.controls['eventDurationHours'].setValue(0)
    // this.createEventForm.controls['eventDurationMinutes'].setValue(30)
    this.createEventForm.controls['eventType'].setValue('Webinar')
    const minCurrentDate = new Date()
    const maxNewDate = new Date()
    this.minDate = minCurrentDate
    this.maxDate = maxNewDate.setMonth(maxNewDate.getMonth() + 1)
    this.todayDate = new Date((new Date().getTime()))
    this.todayTime = '00:00'
  }

  ngOnInit() {
    this.orgtimeArr = this.timeArr

    if (this.timeArr) {
      const hr = new Date().getHours()
      const min = new Date().getMinutes()

      // tslint:disable-next-line:prefer-template
      const nhr = ('0' + hr).slice(-2)
      // tslint:disable-next-line:prefer-template
      const nmin = ('0' + min).slice(-2)

      const currentTime = `${nhr}:${nmin}`
      const timearray: any = []
      const alltimearray: any = []
      this.timeArr.forEach((time: any) => {
        alltimearray.push(time)
        if (time.value > currentTime) {
          timearray.push(time)
        }
      })
      this.newtimearray = timearray
      this.timeArr = alltimearray
      this.todayTime = this.newtimearray[0].value
    }
  }

  openDialog() {
    this.dialogRef = this.matDialog.open(ParticipantsComponent, {
      width: '850px',
      height: '600px',
    })
    this.dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        this.addPresenters(response)
      }
    })
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.BTN_CONTENT,
      },
      {}
    )
  }

  addPresenters(responseObj: any) {
    Object.keys(responseObj.data).forEach((index: any) => {
      const obj = responseObj.data[index]
      const setSelectedPresentersObj = {
        name: obj.firstName || obj.firstname,
        email: this.profileUtilSvc.emailTransform(obj.profileDetails.personalDetails.primaryEmail),
        type: 'Karmayogi User',
        mdoName: obj.rootOrgName,
      }
      // this.presentersArr.push(setSelectedPresentersObj)
      this.participantsArr.push(setSelectedPresentersObj)
      // console.log('this.participantsArr', this.participantsArr)
      this.changeDetectorRefs.detectChanges()
      this.createEventForm.controls['presenters'].setValue(this.participantsArr)
    })
  }

  close() {
    this.dialogRef.close()
  }

  selectCover() {
    this.pictureObj = document.getElementById('coverPicture')
    this.pictureObj.click()
    this.createEventForm.controls['eventPicture'].markAsTouched()
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.BTN_CONTENT,
      },
      {}
    )
  }

  onFileSelect(event: any) {
    this.errorMessages = ''
    if (event.target.files.length > 0) {
      const mimeType = event.target.files[0].type
      if (mimeType.match(/image\/*/) == null) {
        this.errorMessages = `Please upload the file in either PNG, JPG, or JPEG format. Unfortunately,
          we can only accept files with these extensions at the moment.`
        return
      }
      if (event.target.files[0].size > 512000) {
        this.errorMessages = `The file you are trying to upload exceeds the maximum allowed size of 500KB.
        Please choose a smaller file and try again.`
        return
      }
      const reader = new FileReader()
      const file = event.target.files[0]
      reader.onload = () => this.imageSrcURL = reader.result
      reader.readAsDataURL(file)
      this.imageSrc = file
      this.createEventForm.controls['eventPicture'].setValue(this.imageSrc)

      const org = []
      const createdforarray: any[] = []
      createdforarray.push(this.departmentID)
      org.push(this.department)

      const request = {
        request: {
          content: {
            name: 'image asset',
            creator: this.username,
            createdBy: this.userId,
            code: 'image asset',
            mimeType: this.imageSrc.type,
            mediaType: 'image',
            contentType: 'Asset',
            primaryCategory: 'Asset',
            organisation: org,
            createdFor: createdforarray,
          },
        },
      }
      // start the upload and save the progress map
      this.eventsSvc.crreateAsset(request).subscribe((res: any) => {
        const contentID = res.result.identifier
        const formData: FormData = new FormData()
        formData.append('data', file)

        this.eventsSvc.uploadFile(contentID, formData).subscribe((fdata: any) => {
          this.eventimageURL = fdata.result.artifactUrl
          event.target.value = ''
        })
      })
    }
  }

  removeSelectedFile() {
    this.imageSrcURL = ''
    this.createEventForm.controls['eventPicture'].setValue('')
    this.eventimageURL = ''
  }

  changeEventType(event: any) {
    this.createEventForm.controls['eventType'].setValue(event.target.value)
  }

  updateDate(event: any) {
    const dd = event.value.getDate()
    const mm = event.value.getMonth() + 1
    const yr = event.value.getFullYear()
    const selectedDate = `${dd}-${mm}-${yr}`

    const dd1 = new Date().getDate()
    const mm1 = new Date().getMonth() + 1
    const yr1 = new Date().getFullYear()
    const todaysDate = `${dd1}-${mm1}-${yr1}`

    if (selectedDate === todaysDate) {
      this.timeArr = this.newtimearray
      this.todayTime = this.timeArr[0].value
    } else {
      this.timeArr = this.orgtimeArr
      this.todayTime = this.timeArr[0].value
    }
  }

  onSubmit() {
    this.disableCreateButton = true
    this.displayLoader = true
    const eventDurationMinutes = this.addMinutes(
      this.createEventForm.controls['eventDurationHours'].value,
      this.createEventForm.controls['eventDurationMinutes'].value
    )
    const timeArr = this.createEventForm.controls['eventTime'].value.split(':')
    const todayDate = moment(new Date()).valueOf()
    const expiryDateTime = moment(this.createEventForm.controls['eventDate'].value)
      .set('hour', timeArr[0])
      .set('minute', timeArr[1]).format('YYYYMMDDTHHmmss+0000')

    const startTimeArr = this.createEventForm.controls['eventTime'].value.split(':')
    // tslint:disable-next-line:radix
    const startMinutes = (startTimeArr[0] * 60) + parseInt(startTimeArr[1])
    // tslint:disable-next-line:radix
    const endMinutes = parseInt(this.createEventForm.controls['eventDurationHours'].value) * 60
    // tslint:disable-next-line:radix
    const totalMinutes = startMinutes + endMinutes + parseInt(this.createEventForm.controls['eventDurationMinutes'].value || 0)
    // tslint:disable-next-line:prefer-template
    let hours = (Math.floor(totalMinutes / 60) < 10) ? '0' + Math.floor(totalMinutes / 60) : Math.floor(totalMinutes / 60)
    // tslint:disable-next-line:prefer-template
    const hoursStr = (Math.floor(totalMinutes / 60) < 10) ? '0' + Math.floor(totalMinutes / 60) : Math.floor(totalMinutes / 60)
    hours = Number(hours)
    const minutes = totalMinutes % 60
    // tslint:disable-next-line:prefer-template
    const minutesstr = (Math.floor(minutes) < 10) ? '0' + Math.floor(minutes) : Math.floor(minutes)
    let finalTime
    let newendDate
    const eventDate = moment(this.createEventForm.controls['eventDate'].value).add((totalMinutes - 330), 'minutes').valueOf()
    if (hours < 24) {
      if (minutes === 0) {
        // tslint:disable-next-line:prefer-template
        finalTime = hoursStr + ':' + '00' + ':00+05:30'
      } else if (hours === 0) {
        // tslint:disable-next-line:prefer-template
        finalTime = '00' + ':' + minutesstr + ':00+05:30'
      } else {
        // tslint:disable-next-line:prefer-template
        finalTime = hoursStr + ':' + minutesstr + ':00+05:30'
      }
    } else {
      if (hours === 0) {
        // tslint:disable-next-line:prefer-template
        finalTime = '00' + ':' + minutesstr + ':00+05:30'
      } else {
        const fhr = Number(hours)
        // tslint:disable-next-line:prefer-template
        const nhr = ('0' + (fhr - 24)).slice(-2)
        if (minutes === 0) {
          // tslint:disable-next-line:prefer-template
          finalTime = nhr + ':' + '00' + ':00+05:30'
        } else {
          // tslint:disable-next-line:prefer-template
          finalTime = nhr + ':' + minutesstr + ':00+05:30'
        }
        const selectedStartDate = this.createEventForm.controls['eventDate'].value
        // tslint:disable-next-line:prefer-template
        const date = ('0' + (new Date(selectedStartDate).getDate() + 1)).slice(-2)
        // tslint:disable-next-line:prefer-template
        const month = ('0' + (new Date(selectedStartDate).getMonth() + 1)).slice(-2)
        const year = new Date(selectedStartDate).getFullYear()
        newendDate = `${year}-${month}-${date}`
      }
      this.events.raiseInteractTelemetry(
        {
          type: TelemetryEvents.EnumInteractTypes.CLICK,
          subType: TelemetryEvents.EnumInteractSubTypes.BTN_CONTENT,
        },
        {}
      )
    }

    const createdforarray: any[] = []
    createdforarray.push(this.departmentID)

    if (eventDate < todayDate) {
      const linkArry = []
      linkArry.push(this.createEventForm.controls['conferenceLink'].value)
      // form.request.event.recordedLinks = arry
      this.reqPayload = {
        request: {
          event: {
            mimeType: 'application/html',
            locale: 'en',
            isExternal: true,
            name: this.createEventForm.controls['eventTitle'].value,
            description: this.createEventForm.controls['description'].value,
            // instructions: this.createEventForm.controls['summary'].value,
            appIcon: this.eventimageURL,
            category: 'Event',
            createdBy: this.userId,
            authoringDisabled: false,
            isContentEditingDisabled: false,
            isMetaEditingDisabled: false,
            learningObjective: this.createEventForm.controls['agenda'].value,
            expiryDate: expiryDateTime,
            duration: eventDurationMinutes,
            // registrationLink: this.createEventForm.controls['conferenceLink'].value,
            recordedLinks: linkArry,
            resourceType: this.createEventForm.controls['eventType'].value,
            categoryType: 'Article',
            creatorDetails: this.createEventForm.controls['presenters'].value,
            sourceName: this.department,
            startDate: moment(this.createEventForm.controls['eventDate'].value).format('YYYY-MM-DD'),
            endDate: newendDate ? newendDate : moment(this.createEventForm.controls['eventDate'].value).format('YYYY-MM-DD'),
            // tslint:disable-next-line:prefer-template
            startTime: this.createEventForm.controls['eventTime'].value + ':00+05:30',
            endTime: finalTime,
            code: this.createEventForm.controls['eventTitle'].value,
            eventType: 'Online',
            // contentType: 'Event',
            // onlineProvider: 'Zoom',
            registrationEndDate: moment(this.createEventForm.controls['eventDate'].value).format('YYYY-MM-DD'),
            owner: this.department,
            createdFor: createdforarray,
          },
        },
      }
    } else {
      this.reqPayload = {
        request: {
          event: {
            mimeType: 'application/html',
            locale: 'en',
            isExternal: true,
            name: this.createEventForm.controls['eventTitle'].value,
            description: this.createEventForm.controls['description'].value,
            // instructions: this.createEventForm.controls['summary'].value,
            appIcon: this.eventimageURL,
            category: 'Event',
            createdBy: this.userId,
            authoringDisabled: false,
            isContentEditingDisabled: false,
            isMetaEditingDisabled: false,
            learningObjective: this.createEventForm.controls['agenda'].value,
            expiryDate: expiryDateTime,
            duration: eventDurationMinutes,
            registrationLink: this.createEventForm.controls['conferenceLink'].value,
            resourceType: this.createEventForm.controls['eventType'].value,
            categoryType: 'Article',
            creatorDetails: this.createEventForm.controls['presenters'].value,
            sourceName: this.department,
            startDate: moment(this.createEventForm.controls['eventDate'].value).format('YYYY-MM-DD'),
            endDate: newendDate ? newendDate : moment(this.createEventForm.controls['eventDate'].value).format('YYYY-MM-DD'),
            // tslint:disable-next-line:prefer-template
            startTime: this.createEventForm.controls['eventTime'].value + ':00+05:30',
            endTime: finalTime,
            code: this.createEventForm.controls['eventTitle'].value,
            eventType: 'Online',
            // contentType: 'Event',
            // onlineProvider: 'Zoom',
            registrationEndDate: moment(this.createEventForm.controls['eventDate'].value).format('YYYY-MM-DD'),
            owner: this.department,
            createdFor: createdforarray,
          },
        },
      }
    }

    // const formJson = this.encodeToBase64(form)
    if (eventDurationMinutes === 0) {
      this.displayLoader = false
      this.disableCreateButton = false
      this.openSnackbar('Duration cannot be zero')
    } else {
      this.eventsSvc.createEvent(this.reqPayload).subscribe(
        res => {
          this.displayLoader = false
          this.disableCreateButton = false
          const identifier = res.result.identifier
          const versionKey = res.result.versionKey
          // this.fileSubmit(identifier)
          this.publishEvent(identifier, versionKey)
        },
        (err: any) => {
          this.displayLoader = false
          this.disableCreateButton = false
          this.openSnackbar(err.error.split(':')[1])
        }
      )
    }
  }

  encodeToBase64(body: any) {
    const sString = JSON.stringify(body)
    const aUTF16CodeUnits = new Uint16Array(sString.length)
    Array.prototype.forEach.call(aUTF16CodeUnits, (_el, idx, arr) => arr[idx] = sString.charCodeAt(idx))
    return { data: btoa(new Uint8Array(aUTF16CodeUnits.buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')) }
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  addMinutes(hrs: number, mins: number) {
    if (mins > 0) {
      return (hrs * 60) + mins
    }
    const minutes = (hrs * 60) + 0
    return minutes
  }

  publishEvent(identifierkey: any, versionKey: any) {
    const reqestBody = {
      request: {
        event: {
          versionKey,
          status: 'Live',
          identifier: identifierkey,
        },
      },
    }
    this.eventsSvc.publishEvent(identifierkey, reqestBody).subscribe(
      res => {
        this.showSuccess(res)
      },
      (err: any) => {
        this.openSnackbar(err.error.split(':')[1])
      }
    )
  }

  goToList() {
    this.router.navigate([`/app/home/events`])
    this.events.raiseInteractTelemetry(
      {
        type: TelemetryEvents.EnumInteractTypes.CLICK,
        subType: TelemetryEvents.EnumInteractSubTypes.BTN_CONTENT,
      },
      {}
    )
  }
  showSuccess(res: any) {
    this.dialogRef = this.matDialog.open(SuccessComponent, {
      width: '612px',
      data: res,
      panelClass: 'remove-overflow',
    })
    this.dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.router.navigate([`/app/home/events`])
      },         700)
    })
  }

  omit_special_char(event: any) {
    const k = event.charCode
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57))
  }
}
