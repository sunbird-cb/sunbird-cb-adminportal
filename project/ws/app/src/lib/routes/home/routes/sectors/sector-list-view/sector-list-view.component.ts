import { Router } from '@angular/router'
import {
  Component, EventEmitter, Input, OnInit, Output, ViewChild,
} from '@angular/core'
import * as _ from 'lodash'
import { IAction, ITableData } from '../../events/interfaces/interfaces'
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator'
import { MatSort } from '@angular/material/sort'
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table'
import { sectorConstants } from '../sectors-constats.model'

@Component({
  selector: 'ws-sector-list-view',
  templateUrl: './sector-list-view.component.html',
  styleUrls: ['./sector-list-view.component.scss'],
})
export class SectorListViewComponent implements OnInit {
  @Input() tableData!: ITableData | undefined
  @Input() data: any = []
  @Input() isCreate?: boolean
  @Output() filterData?: EventEmitter<any>
  @Input() actions?: IAction[]
  displayedColumns: any = []
  dataSource!: any
  length!: number
  pageSize = sectorConstants.pageSize
  pageSizeOptions = sectorConstants.pageOptions
  cardMenu: any
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }

  constructor(
    private router: Router,
  ) {
    this.dataSource = new MatTableDataSource<any>()
    this.filterData = new EventEmitter()
    this.dataSource.paginator = this.paginator
  }

  // find the action column data
  getFinalColumns() {
    if (this.tableData !== undefined) {
      const columns = _.map(this.tableData.columns, c => c.key)
      if (this.tableData.needCheckBox) {
        columns.splice(0, 0, 'select')
      }
      if (this.tableData.needHash) {
        columns.splice(0, 0, 'SR')
      }
      if (this.tableData.actions && this.tableData.actions.length > 0) {
        columns.push('Actions')
      }
      if (this.tableData.actions && this.tableData.actions.length > 0) {
        // columns.push('Menu')
      }
      return columns
    }
    return ''
  }

  ngOnInit() {
    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
    }
    this.dataSource.data = this.data
    this.length = this.dataSource.data.length
    setTimeout(() => this.dataSource.paginator = this.paginator)
  }

  // Filter sectors based on the user search
  applyFilter(event: string) {
    if (event) {
      this.dataSource.data = this.data.filter((d: any) => d.name.toString().toLowerCase().includes(event.toLowerCase()))
    } else {
      this.dataSource.data = this.data
    }
  }

  // Navigate to create sector
  onCreateClick() {
    this.router.navigateByUrl('/app/home/sectors/new')
  }
  // Navigate to create sub sectors
  onClickButton(row: any) {
    this.router.navigateByUrl(`/app/home/sectors/${row.code}/sub-sectors`)
  }
}
