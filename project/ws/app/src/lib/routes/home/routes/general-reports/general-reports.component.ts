import { Component, OnInit, ViewChild } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { environment } from '../../../../../../../../../src/environments/environment'
/* tslint:disable */
import _ from 'lodash'
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator'
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table'
import { DatePipe } from '@angular/common'
import { MomentDateAdapter } from '@angular/material-moment-adapter'
import moment from 'moment'
import { GeneralReportsService } from './general-reports.service'
import { sectorConstants } from '../sectors/sectors-constats.model'

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
  selector: 'ws-general-reports',
  templateUrl: './general-reports.component.html',
  styleUrls: ['./general-reports.component.scss'],
  providers: [DatePipe,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]

})
export class GeneralReportsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null
  currentUser!: string | null
  tabledata: any = []
  dataSource: MatTableDataSource<any>
  reportSectionData: any = []
  todayDate: any
  maxDate: any
  reportData: any = []
  buckets: any
  displayLoader = false

  constructor(
    public dialog: MatDialog,
    private configSvc: ConfigurationsService,
    private generalReportsService: GeneralReportsService,
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
        { displayName: 'Report name', key: 'reportName' },
        { displayName: 'Report type', key: 'reportType' },
        { displayName: 'Last updated on', key: 'lastUpdateOn' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: 'reportName',
      sortState: 'asc',
      needUserMenus: false,
      actionColumnName: 'Action',
      actions: [{ icon: '', label: 'Download', name: 'DownloadFile', type: 'Standard', disabled: false }],
    }

    this.generalReportsService.getContent().subscribe((result: any) => {
      if (result && result.reports && result.reports.buckets) {
        this.buckets = result.reports.buckets
        this.getTableData(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
      }
    },
      (error) => {
        this.snackBar.open(error.statusText, 'X', { duration: sectorConstants.duration })
      }
    )
    setTimeout(() => this.dataSource.paginator = this.paginator)
  }

  getTableData(rDate: any) {
    this.displayLoader = true
    this.reportSectionData = []
    this.generalReportsService.getReportContnet(rDate).subscribe((result: any) => {
      this.buckets.forEach((bucket: any) => {
        if (bucket.enable) {
          let lastUpdateOn: any = '-'
          let downloadUrl: any = ''
          const resp = result[bucket.key]
          if (resp && resp.lastModified) {
            lastUpdateOn = this.datePipe.transform(resp.lastModified, 'dd/MM/yyyy, h:mm a')
            downloadUrl = this.datePipe.transform(resp.lastModified, 'yyyy-MM-dd')
          }
          this.reportSectionData.push({
            reportName: bucket.name,
            reportType: "Detailed data report",
            lastUpdateOn: lastUpdateOn,
            downloadUrl: downloadUrl,
            bucketKey: bucket.key
          })
        }
        this.dataSource = new MatTableDataSource(this.reportSectionData)
      })
      this.displayLoader = false
    }, error => {
      this.displayLoader = false
      // tslint:disable-next-line: no-console
      this.snackBar.open(error.statusText, 'X', { duration: sectorConstants.duration })
    })
  }

  downloadFile(event: any) {
    if (event.row.downloadUrl && event.row.downloadUrl !== '') {
      this.downloadReport(event.row)
    } else {
      this.snackBar.open('Report is not available.', 'X', { duration: sectorConstants.duration })
    }
  }

  updateDate(event: any) {
    this.getTableData(moment(new Date(event.value)).format("YYYY-MM-DD"))
  }

  async downloadReport(row: any) {
    const downloadUrl = `${environment.spvPath}/apis/proxies/v8/storage/v1/spvReport/${row.bucketKey.split(".zip")[0]}/${row.downloadUrl}/${row.bucketKey}`
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
