import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ConfigurationsService } from '@sunbird-cb/utils'
//import { environment } from '../../../../../../../../../src/environments/environment'
/* tslint:disable */
import _ from 'lodash'
import { CommsService } from './comms.service'
import { MatPaginator, MatTableDataSource } from '@angular/material'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'ws-app-comms',
  templateUrl: './comms.component.html',
  styleUrls: ['./comms.component.scss'],
  providers: [DatePipe]
})
export class CommsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | null = null
  currentUser!: string | null
  tabledata: any = []
  dataSource: MatTableDataSource<any>
  reportSectionData: any

  constructor(
    public dialog: MatDialog,
    private configSvc: ConfigurationsService,
    private commsService: CommsService,
    private datePipe: DatePipe
  ) {
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
    this.dataSource = new MatTableDataSource(this.reportSectionData)
    this.dataSource.paginator = this.paginator

  }

  ngOnInit() {

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

    this.commsService.getCommsContent().subscribe((result: any) => {
      if (result && result.comms && result.comms.buckets) {
        this.getTableData(result.comms.buckets)
      }
    })
    setTimeout(() => this.dataSource.paginator = this.paginator)
  }

  getTableData(apiResp: any) {
    this.reportSectionData = []
    apiResp.forEach((bucket: any, index: number) => {
      this.reportSectionData.push({
        criteria: bucket.name,
        lastUpdateOn: this.datePipe.transform(new Date(), 'dd/MM/yyyy, h:mm a') || '',
        downloadUrl: `https://downloadlink.com${index + 1}`
      })
    })
    this.dataSource = new MatTableDataSource(this.reportSectionData)
  }

  downloadFile(event: any) {
    if (event && event.row && event.row.downloadUrl) {
      console.log("file ", event.row.downloadUrl)
    }
  }

}
