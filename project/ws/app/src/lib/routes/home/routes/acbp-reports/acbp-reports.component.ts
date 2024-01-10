import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatSnackBar } from '@angular/material'
import { environment } from '../../../../../../../../../src/environments/environment'
/* tslint:disable */
import _ from 'lodash'
import { MatPaginator, MatTableDataSource } from '@angular/material'
import { DatePipe } from '@angular/common'
import { MomentDateAdapter } from '@angular/material-moment-adapter'
import moment from 'moment'
import { AcbpReportsService } from './acbp-reports.service'

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
  selector: 'ws-app-acbp-reports',
  templateUrl: './acbp-reports.component.html',
  styleUrls: ['./acbp-reports.component.scss'],
  providers: [DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]

})
export class AcbpReportsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | null = null
  currentUser!: string | null
  tabledata: any = []
  dataSource: MatTableDataSource<any>
  reportSectionData: any = []
  todayDate: any
  maxDate: any
  reportData = []
  buckets: any
  displayLoader = false

  constructor(
    public dialog: MatDialog,
    private configSvc: ConfigurationsService,
    private acbpReportsService: AcbpReportsService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
  ) {
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
    this.dataSource = new MatTableDataSource(this.reportSectionData)
    this.dataSource.paginator = this.paginator

  }

  ngOnInit() {

    this.todayDate = new Date(new Date())
    this.maxDate = new Date(new Date())

    this.tabledata = {
      columns: [
        { displayName: 'Criteria', key: 'criteria' },
        { displayName: 'Last updated on', key: 'lastUpdateOn' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: 'Criteria',
      sortState: 'asc',
      needUserMenus: false,
      actions: [{ icon: '', label: 'Download', name: 'DownloadFile', type: 'Standard', disabled: false }],
    }

    this.acbpReportsService.getAcbpContent().subscribe((result: any) => {
      if (result && result.reports && result.reports.buckets) {
        this.buckets = result.reports.buckets
        this.getTableData(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
      }
    })
    setTimeout(() => this.dataSource.paginator = this.paginator)
  }

  getTableData(rDate: any) {
    this.displayLoader = true
    this.reportSectionData = []
    this.acbpReportsService.getAcbpReportContnet(rDate).subscribe((result: any) => {
      this.buckets.forEach((bucket: any) => {
        if (bucket.enable) {
          let lastUpdateOn: any = '-'
          let downloadUrl: any = ''
          const resp = result[bucket.key]
          if (resp.lastModified) {
            lastUpdateOn = this.datePipe.transform(resp.lastModified, 'dd/MM/yyyy, h:mm a')
            downloadUrl = this.datePipe.transform(resp.lastModified, 'yyyy-MM-dd')
          }
          this.reportSectionData.push({
            criteria: bucket.name,
            lastUpdateOn: lastUpdateOn,
            downloadUrl: downloadUrl,
            bucketKey: bucket.key
          })
        }
        this.displayLoader = false
        this.dataSource = new MatTableDataSource(this.reportSectionData)
      })
    }, error => {
      this.displayLoader = false
      // tslint:disable-next-line: no-console
      console.log(error)
    })
  }

  downloadFile(event: any) {
    if (event.row.downloadUrl && event.row.downloadUrl !== '') {
      this.downloadReport(event.row)
    } else {
      this.snackBar.open('Report is not available.', 'X', { duration: 2000 })
    }
  }

  updateDate(event: any) {
    this.getTableData(moment(new Date(event.value)).format("YYYY-MM-DD"))
  }

  async downloadReport(row: any) {
    const downloadUrl = `${environment.spvPath}/apis/proxies/v8/storage/v1/spvReport/${row.bucketKey.split(".csv")[0]}/${row.downloadUrl}/${row.bucketKey}`
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return
      }
      if (xhr.status === 200) {
        window.location.href = downloadUrl
      }
    }
    xhr.open('GET', downloadUrl)
    xhr.send()
  }
}
