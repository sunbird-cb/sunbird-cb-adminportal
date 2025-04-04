import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core'
import { MarketplaceService } from '../../services/marketplace.service'
import { map } from 'rxjs/operators'
import * as _ from 'lodash'
import { DatePipe } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'ws-app-content-upload',
  templateUrl: './content-upload.component.html',
  styleUrls: ['./content-upload.component.scss'],
  providers: [DatePipe],
})
export class ContentUploadComponent implements OnInit, OnChanges {
  //#region (global variables)
  //#region (view chaild, input and output)
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>

  @Input() providerDetails?: any
  @Input() selectedTabIndex = 0

  @Output() loadProviderDetails = new EventEmitter<Boolean>()
  //#endregion

  helpCenterGuide = {
    header: 'Content Upload Details: Video Guides and Tips',
    guideNotes: [
      'While uploading the course catalog, ensure to define key properties such as Content Details, Certificate Configuration, and Progress Transform Settings. These are essential for accurate tracking and effective learner engagement. you will have the provision to update the properties later also.',
      'Upload the course catalog using a CSV or XLSX file. Once uploaded, the system will indicate whether the courses are live. Non-published courses and published courses will be displayed in separate tabs for better organization. Additionally, you can download detailed logs for reference and troubleshooting.',
    ],
    helpVideoLink: `/assets/public/content/guide-videos/CIOS_Updated_demo.mp4`,
  }

  contentTableData: any
  uploadedContentList = []
  showUploadedStatusLoader = false
  contenetMenuItems: {
    icon: string,
    btnText: string,
    action: string
  }[] = []
  contentSearchKey = ''
  contentTablePaginationDetails: any

  publishedCoursesTableData: any
  publishedCoursesList: any = []
  showPublishedCoursesLoader = false
  publishedCoursesSerachKey = ''
  publishedCoursesTablePaginationDetails: any

  unPublishedCoursesTableData: any
  unPublishedCoursesList: any = [
  ]
  showUnpublishedCoursesLoader = false
  unpublishedCoursesMenuItems: {
    icon: string,
    btnText: string,
    action: string
  }[] = []
  unPublishedCoursesSearchKey = ''
  unPublishedCoursesTablePaginationDetails: any

  uploadMode = 'viaCsv'

  defaultPagination = {
    startIndex: 0,
    lastIndes: 20,
    pageSize: 20,
    pageIndex: 0,
    totalCount: 20,
  }

  delayTabLoad = true
  viaApiTabIndex = 0
  //#endregion

  //#region (constructor: contains Intialization of TransforamtionControls from routes data)
  constructor(
    private marketPlaceSvc: MarketplaceService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) {
  }

  //#endregion

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.providerDetails &&
      changes.providerDetails.currentValue) {
      this.tableDataInitialzation()
    }

    if (changes.selectedTabIndex && changes.selectedTabIndex.currentValue === 1) {
      this.delayTabLoad = false
    }
  }

  tableDataInitialzation() { // All tables data Initialzation
    this.contentTableData = {
      columns: [
        { displayName: 'File Name', key: 'name', cellType: 'text' },
        { displayName: 'File Status', key: 'status', cellType: 'status' },
        { displayName: 'Initiated On', key: 'intiatedOn', cellType: 'text' },
        { displayName: 'Completed On', key: 'completedOn', cellType: 'text' },
      ],
      needCheckBox: false,
      showDeleteAll: false,
      showSearchBox: false,
      showPagination: false,
    }
    this.contenetMenuItems = [
      {
        icon: '',
        btnText: 'Download Log',
        action: 'downloadLog',
      },
    ]

    this.unPublishedCoursesTableData = {
      columns: [
        { displayName: 'Course name', key: 'courseName', cellType: 'text', imageKey: 'courseImg', cellClass: 'text-overflow-elipse' },
        { displayName: 'Source', key: 'source', cellType: 'text' },
        { displayName: 'Listed On', key: 'listedOn', cellType: 'text' },

      ],
      needCheckBox: true,
      showDeleteAll: true,
    }
    this.unpublishedCoursesMenuItems = [
      {
        icon: '',
        btnText: 'Delete',
        action: 'delete',
      },
    ]
    this.setPagination('notPublished', this.defaultPagination)

    this.publishedCoursesTableData = {
      columns: [
        { displayName: 'Course name', key: 'courseName', cellType: 'text', imageKey: 'courseImg', cellClass: 'text-overflow-elipse' },
        { displayName: 'Source', key: 'source', cellType: 'text' },
        { displayName: 'Publised On', key: 'publishedOn', cellType: 'text' },
        { displayName: 'Listed On', key: 'listedOn', cellType: 'text' },

      ],
      needCheckBox: false,
      showDeleteAll: false,
    }
    this.setPagination('published', this.defaultPagination)
  }

  //#region (ng Onint: contains Initialing api calls to get all 3 tables data)
  ngOnInit() {
    if (this.providerDetails.trasformContentJson) {
      this.getTablesData()
    }
  }

  //#region (get data for tables)
  getTablesData() {
    this.getContentList()
    this.getPublishedCoursesList()
    this.getUnPublishedCoursesList()
  }

  getContentList() {
    if (this.providerDetails && this.providerDetails.id) {
      this.showUploadedStatusLoader = true
      this.marketPlaceSvc.getContentList(this.providerDetails.id)
        .pipe(map((responce: any) => {
          return this.formateContentList(responce)
        }))
        .subscribe({
          next: (result: any) => {
            this.showUploadedStatusLoader = false
            this.uploadedContentList = result
          },
          error: (error: HttpErrorResponse) => {
            this.showUploadedStatusLoader = false
            const errmsg = _.get(error, 'error.params.errMsg', 'Some thing went wrong please try again')
            this.showSnackBar(errmsg)
          },
        })
    }
  }

  formateContentList(responce: any) {
    let formatedList: any = []
    if (responce) {
      formatedList = responce
        .sort((a: any, b: any) => {
          const dateA = new Date(a.initiatedOn)
          const dateB = new Date(b.initiatedOn)
          return dateB.getTime() - dateA.getTime()
        })
        .map((element: any) => {
          return {
            status: element.status === 'success' ? 'Live' :
              element.status === 'InProgress' ? 'In Progress' : 'Failed',
            name: element.fileName,
            intiatedOn: this.datePipe.transform(new Date(element.initiatedOn), 'dd MMM yyyy hh:mm a'),
            completedOn: this.datePipe.transform(new Date(element.completedOn), 'dd MMM yyyy hh:mm a'),
            gcpfileName: element.gcpfileName,
          }
        })
    }
    return formatedList
  }

  getPublishedCoursesList() {
    if (_.get(this.providerDetails, 'data.partnerCode')) {
      this.showPublishedCoursesLoader = true
      this.publishedCoursesList = []
      const formBody = {
        filterCriteriaMap: {
          partnerCode: _.get(this.providerDetails, 'data.partnerCode'),
          status: ['live'],
        },
        pageNumber: this.publishedCoursesTablePaginationDetails.pageIndex,
        pageSize: this.publishedCoursesTablePaginationDetails.pageSize,
        // "orderBy": "duration",
        // "orderDirection": "desc",
        searchString: this.publishedCoursesSerachKey,
      }
      this.marketPlaceSvc.getCoursesList(formBody)
        .pipe(map((responce: any) => {
          const formatedData = {
            totalCount: _.get(responce, 'totalCount', 0),
            formatedList: this.formateCoursesList(_.get(responce, 'data', [])),
          }
          return formatedData
        }))
        .subscribe({
          next: (result: any) => {
            this.publishedCoursesList = result.formatedList
            this.publishedCoursesTablePaginationDetails.totalCount = result.totalCount
            this.showPublishedCoursesLoader = false
          },
          error: (error: HttpErrorResponse) => {
            const errmsg = _.get(error, 'error.params.errMsg', 'Some thing went wrong please try again')
            this.showPublishedCoursesLoader = false
            const message = _.get(error, 'error.message')
            if (!(error.status === 400 && message.includes('index_not_found_exception'))) {
              this.showSnackBar(errmsg)
            }
          },
        })
    }
  }

  getUnPublishedCoursesList() {
    if (_.get(this.providerDetails, 'data.partnerCode')) {
      this.showUnpublishedCoursesLoader = true
      this.unPublishedCoursesList = []
      const formBody = {
        filterCriteriaMap: {
          status: ['draft', 'notInitiated'],
          partnerCode: _.get(this.providerDetails, 'data.partnerCode'),
        },
        pageNumber: this.unPublishedCoursesTablePaginationDetails.pageIndex,
        pageSize: this.unPublishedCoursesTablePaginationDetails.pageSize,
        // "orderBy": "duration",
        // "orderDirection": "desc",
        searchString: this.unPublishedCoursesSearchKey,
      }
      this.marketPlaceSvc.getCoursesList(formBody)
        .pipe(map((responce: any) => {
          const formatedData = {
            totalCount: _.get(responce, 'totalCount', 0),
            formatedList: this.formateCoursesList(_.get(responce, 'data', [])),
          }
          return formatedData
        }))
        .subscribe({
          next: (result: any) => {
            this.unPublishedCoursesList = result.formatedList
            this.unPublishedCoursesTablePaginationDetails.totalCount = result.totalCount
            this.showUnpublishedCoursesLoader = false
          },
          error: (error: HttpErrorResponse) => {
            const errmsg = _.get(error, 'error.params.errMsg', 'Some thing went wrong please try again')
            this.showPublishedCoursesLoader = false
            const message = _.get(error, 'error.message')
            if (!(error.status === 400 && message.includes('index_not_found_exception'))) {
              this.showSnackBar(errmsg)
            }
          },
        })
    }
  }

  formateCoursesList(responce: any[]) {
    const formatedList: any = []
    responce.forEach((course: any) => {
      const publishedOnDate = new Date(_.get(course, 'publishedOn'))
      const formateCourse = {
        id: _.get(course, 'externalId', ''),
        courseName: _.get(course, 'name', ''),
        courseImg: _.get(course, 'appIcon', ''),
        source: _.get(course, 'source', ''),
        courseStatus: course.isActive ? 'Published' : 'Not Published',
        publishedOn: isNaN(publishedOnDate.getTime()) ? 'N/A'
          : this.datePipe.transform(publishedOnDate, 'MMM dd, yyyy'),
        listedOn: course.createdDate ? (this.datePipe.transform(new Date(course.createdDate), 'MMM dd, yyyy')) : 'N/A',
        isActive: course.isActive,
        isChecked: false,
      }
      formatedList.push(formateCourse)
    })
    return formatedList
  }
  //#endregion
  //#endregion

  setPagination(tableType: string, pagination: any) {
    switch (tableType) {
      case 'published':
        this.publishedCoursesTablePaginationDetails = JSON.parse(JSON.stringify(pagination))
        break
      case 'notPublished':
        this.unPublishedCoursesTablePaginationDetails = JSON.parse(JSON.stringify(pagination))
        break
    }
  }
  //#endregion

  sendDetailsUpdateEvent() { // send event to parrent to get updated data so that chailds get updated detail
    this.loadProviderDetails.emit(true)
  }

  //#region (table event: All table click events and search events)
  searchCourses(publishedCourses: boolean, searchKey: string) {
    if (publishedCourses) {
      this.publishedCoursesSerachKey = searchKey
      this.setPagination('published', this.defaultPagination)
      this.getPublishedCoursesList()
    } else {
      this.unPublishedCoursesSearchKey = searchKey
      this.setPagination('notPublished', this.defaultPagination)
      this.getUnPublishedCoursesList()
    }
  }

  pageChange(event: any, courseType: string) {
    if (courseType === 'published') {
      this.publishedCoursesTablePaginationDetails = event
      this.getPublishedCoursesList()
    } else if (courseType === 'notPublished') {
      this.unPublishedCoursesTablePaginationDetails = event
      this.getUnPublishedCoursesList()
    }
  }

  contentEvents(event: any) {
    switch (event.action) {
      case 'delete':
        this.deletedSelectedCourses(event)
        break
      case 'downloadLog':
        if (event.rows.gcpfileName) {
          this.downloadLog(event.rows.gcpfileName, event.rows.name)
        }
        break
      case 'refresh':
        this.getTablesData()
        break
    }
  }

  deletedSelectedCourses(event: any) {
    if (event && event.rows && event.rows.length !== 0) {
      const formBody = {
        partnerCode: _.get(this.providerDetails, 'data.partnerCode'),
        externalId: event.rows.length ? event.rows.map((item: any) => item.id) : [event.rows.id],
      }
      this.marketPlaceSvc.deleteUnPublishedCourses(formBody).subscribe({
        next: (res: any) => {
          if (res) {
            const msg = event.rows.length && event.rows.length > 1
              ? 'Selected courses are deleted successfully' : 'Selected course is deleted successfully'
            this.showSnackBar(msg)
            setTimeout(() => {
              this.getUnPublishedCoursesList()
            },         2000)
          }
        },
        error: (error: HttpErrorResponse) => {
          const errmsg = _.get(error, 'error.params.errMsg', 'Some thing went wrong please try again')
          this.showSnackBar(errmsg)
        },
      })
    } else {
      this.showSnackBar('Please select course to delete.')
    }
  }

  downloadLog(gcpfileName: string, fileName: string) {
    this.marketPlaceSvc.downloadLogs(gcpfileName)
      .subscribe({
        next: (res: Blob) => {
          if (res) {
            this.downloadBlob(res, fileName)
          }
        },
        error: (error: HttpErrorResponse) => {
          const errmsg = _.get(error, 'error.params.errMsg', 'Some thing went wrong please try again')
          this.showSnackBar(errmsg)
        },
      })
  }

  downloadBlob(blob: Blob, fileName: string) {
    // Create a temporary URL for the Blob object
    const blobUrl = window.URL.createObjectURL(blob)

    // Create an anchor element and simulate a click to start the download
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = `${fileName}`.replace('xlsx', 'csv')
    link.click()
    window.URL.revokeObjectURL(blobUrl)
    const message = 'Logs Downloaded Successfully.'
    this.showSnackBar(message)
  }
  //#endregion

  showSnackBar(message: string) {
    this.snackBar.open(message)
  }

}
