import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { FormControl } from '@angular/forms'
import { PageEvent } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import * as _ from 'lodash'
import { debounceTime } from 'rxjs/operators'

@Component({
  selector: 'ws-app-courses-table',
  templateUrl: './courses-table.component.html',
  styleUrls: ['./courses-table.component.scss'],
})
export class CoursesTableComponent implements OnInit, OnChanges {
  @Input() tableData!: any
  @Input() data?: []
  @Input() paginationDetails: any = {
    startIndex: 0,
    lastIndes: 20,
    pageSize: 20,
    pageIndex: 0,
    totalCount: 20,
  }
  @Input() menuItems = []
  @Input() showLoader = false
  @Output() actionsClick = new EventEmitter<any>()
  @Output() searchKey = new EventEmitter<string>()
  @Output() pageChange = new EventEmitter<any>()

  searchControl = new FormControl()
  showSearchBox = true
  displayedColumns: any
  dataSource!: any
  pageSizeOptions = [20, 30, 40]
  columnsList: any = []
  allSelected = false
  selectedRowData: any = []
  showDeleteAll = true
  tableColumns = []
  noDataMessage = 'No data found'
  showPagination = true

  constructor() {
    this.dataSource = new MatTableDataSource<any>()
  }

  ngOnInit() {
    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
      this.showDeleteAll = this.tableData.showDeleteAll
      this.showSearchBox = _.get(this.tableData, 'showSearchBox', true)
      this.noDataMessage = _.get(this.tableData, 'noDataMessage', 'No data found')
      this.showPagination = _.get(this.tableData, 'showPagination', true)
    }

    this.searchControl.valueChanges
      .pipe(debounceTime(300)) // Adjust the debounce time as needed
      .subscribe(value => this.searchKey.emit(value))
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tableData) {
      this.getFinalColumns()
    }
    if (changes.data) {
      this.dataSource.data = this.data
      this.selectedRowData = []
    }
  }

  getFinalColumns() {
    this.columnsList = []
    const columns = JSON.parse(JSON.stringify(this.tableData.columns))
    if (this.tableData.needCheckBox) {
      const selectColumn = { displayName: '', key: 'select', cellType: 'select' }
      columns.splice(0, 0, selectColumn)
    }
    if (this.menuItems.length > 0) {
      const selectColumn = { displayName: '', key: 'menu', cellType: 'menu' }
      columns.push(selectColumn)
    }
    this.tableColumns = columns
    this.columnsList = _.map(columns, c => c.key)
  }

  deleteAllSelected() {
    this.buttonClick('delete', this.selectedRowData)
  }

  buttonClick(action: string, rows: any) {
    if (this.tableData) {
      this.actionsClick.emit({ action, rows })
    }
  }

  selectAll() {
    this.selectedRowData = []
    _.get(this.dataSource, 'filteredData', []).forEach((rowData: any) => {
      if (!rowData.isActive) {
        rowData['isChecked'] = this.allSelected
        if (this.allSelected) {
          this.selectedRowData.push(rowData)
        }
      }
    })
  }

  onCheckboxChange(column: any) {
    if (column.isChecked) {
      this.selectedRowData.push(column)
    } else {
      this.selectedRowData = this.selectedRowData.filter((rowData: any) => rowData.id !== column.id)
    }
  }

  onChangePage(pe: PageEvent) {
    this.paginationDetails.startIndex = pe.pageIndex * pe.pageSize
    this.paginationDetails.lastIndex = (pe.pageIndex + 1) * pe.pageSize
    this.paginationDetails.pageSize = pe.pageSize
    this.paginationDetails.pageIndex = pe.pageIndex

    this.pageChange.emit(this.paginationDetails)
  }

}
