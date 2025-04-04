import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild,
  AfterViewInit, OnChanges, Inject, ChangeDetectorRef, AfterViewChecked,
} from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table'
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatSort } from '@angular/material/sort'
import * as _ from 'lodash'
import { ITableData, IColums, IAction } from './../interfaces/interfaces'
// Router
import { ActivatedRoute } from '@angular/router'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
// import { EventService } from '@sunbird-cb/utils'
import { NsContent } from '@sunbird-cb/collection'
// import * as moment from 'moment'
import { environment } from '../../../../../../../../../../src/environments/environment'
export interface IContentShareData {
  content: NsContent.IContent
}

@Component({
  selector: 'ws-app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss'],
})
export class SurveyListComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked {

  @Input() tableData!: ITableData | undefined
  @Input() data?: []
  @Input() isCreate?: boolean
  @Input() currentFilter?: ''
  @Input() totalRecordsFlag: any
  @Input() columns?: IColums[]
  @Input() needCheckBox?: Boolean
  @Input() needHash?: boolean
  @Input() actions?: IAction[]
  @Output() clicked?: EventEmitter<any>
  @Output() eOnRowClick = new EventEmitter<any>()
  @Output() eOnCreateClick = new EventEmitter<any>()

  bodyHeight = document.body.clientHeight - 125
  displayedColumns: any = []
  dataSource!: any
  widgetData: any
  length!: number
  pageSize = 20
  pageSizeOptions = [20, 30, 40]
  finalImg: any
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }
  // @ViewChild(MatSort, { static: true }) sort?: MatSort
  selection = new SelectionModel<any>(true, [])
  dialogRef: any
  configSvc: any
  searchColumn!: string
  limit = 20
  pageIndex = 0
  currentOffset = 0
  pendingListRecord?: number | 0
  totalRecords?: number | 0

  constructor(
    // private router: Router,
    // private matDialog: MatDialog,
    // private events: EventService,
    // private telemetrySvc: TelemetryService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public content: IContentShareData,
  ) {
    this.configSvc = this.route.parent && this.route.parent.snapshot.data.configService
    this.dataSource = new MatTableDataSource<any>()
    this.clicked = new EventEmitter()
    this.dataSource.paginator = this.paginator
  }

  ngOnInit() {
    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
    }
    this.dataSource.data = this.data
    if (this.data) {
      this.pendingListRecord = this.data.length
    }

  }

  ngOnChanges() {
    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
    }
    this.dataSource.data = this.data
    if (this.data) {
      this.pendingListRecord = this.data.length
    }
    this.length = this.dataSource.data.length
    if (this.paginator) {
      this.paginator.firstPage()
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  ngAfterViewChecked() {
    this.cd.detectChanges()
  }

  actionsClick($event: any) {
    if ($event.action === 'ViewCount') {
      if ($event.row && $event.row.SOLUTION_ID) {
        this.copyText($event.row.SOLUTION_ID)
        this.snackbar.open('Link Copied Successfully')
      }

    }
  }

  copyText(val: string) {
    const selBox = document.createElement('textarea')
    selBox.style.position = 'fixed'
    selBox.style.left = '0'
    selBox.style.top = '0'
    selBox.style.opacity = '0'
    selBox.value = `${environment.karmYogiPath}/surveyml/${val}`
    document.body.appendChild(selBox)
    selBox.focus()
    selBox.select()
    document.execCommand('copy')
    document.body.removeChild(selBox)
  }

}
