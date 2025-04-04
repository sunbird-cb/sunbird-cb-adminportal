import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild,
  AfterViewInit, OnChanges, SimpleChanges, ElementRef,
} from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table'
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator'
import { MatSort } from '@angular/material/sort'
import * as _ from 'lodash'

// import {IColums } from '../interface/interfaces'
import { Router } from '@angular/router'
import { EventService } from '@sunbird-cb/utils'
import { environment } from '../../../../../../../../src/environments/environment'
import { MatDialog } from '@angular/material/dialog'
import { InfoModalComponent } from '../../info-modal/info-modal.component'
import { CreateMDOService } from '../../../routes/home/services/create-mdo.services'
import { DesignationsService } from '../../../routes/create-mdo/routes/designation/services/designations.service'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { BehaviorSubject } from 'rxjs'

@Component({
  selector: 'ws-widget-directory-table',
  templateUrl: './directory-table.component.html',
  styleUrls: ['./directory-table.component.scss'],
})
export class UIDirectoryTableComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('searchInput') searchInput!: ElementRef
  @Input() tableData!: any
  @Input() data?: []
  @Input() totalDataCount!: number
  @Input() selectedDepartment!: string
  @Input() departmentID!: string
  @Input() needCreate: Boolean = true
  @Output() clicked?: EventEmitter<any>
  @Output() actionsClick?: EventEmitter<any>
  @Output() eOnRowClick = new EventEmitter<any>()
  @Output() searchByEnterKey = new EventEmitter<any>()
  @Output() pageChangeEvent = new EventEmitter<any>()

  bodyHeight = document.body.clientHeight - 125
  // displayedColumns: IColums[] | undefined
  dataSource!: any
  widgetData: any
  length!: number
  pageSize = 20
  pageSizeOptions = [20, 30, 40]
  isSelectedDept = true
  showNewNoContent = false
  openCreateNavBar = false
  openMode = ''
  rowData: any
  dropdownList: {
    statesList: any[],
    ministriesList: any[]
  } = {
      statesList: [],
      ministriesList: [],
    }
  @ViewChild(MatPaginator) private paginator!: MatPaginator
  @ViewChild(MatSort, { static: true }) sort?: MatSort
  selection = new SelectionModel<any>(true, [])
  customSelfRegistration = false
  selfRegistrationData: any = {}
  dialogRef: any
  private filterSubject: BehaviorSubject<any> = new BehaviorSubject<any>('');
  pageIndex = 0
  constructor(
    private router: Router, private events: EventService, public dialog: MatDialog,
    private designationsService: DesignationsService,
    private createMdoService: CreateMDOService,
  ) {
    this.dataSource = new MatTableDataSource<any>()
    this.actionsClick = new EventEmitter()
    this.clicked = new EventEmitter()

    this.filterSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((filterValue) => {
        this.searchByEnterKey.emit(filterValue)
        this.pageIndex = 0
      })
  }

  ngOnInit() {

    if (this.tableData) {
      // this.displayedColumns = this.tableData.columns
    }
    if (environment.departments && environment.departments.includes(this.selectedDepartment)) {
      this.isSelectedDept = false
    }
    this.dataSource.data = this.data
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort

    this.initializeValuesAndAPIs()
  }

  ngOnChanges(data: SimpleChanges) {
    this.tableData = null
    this.tableData = _.get(data, 'tableData.currentValue')
    if (this.dataSource && this.dataSource.filter) this.dataSource.filter = ''
    this.showNewNoContent = this.tableData?.showNewNoContent ? true : false
    this.dataSource.data = _.get(data, 'data.currentValue', [])
    this.length = this.tableData.tableDataCount

    // this.paginator.firstPage()
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
      this.tableData.loader = false
    }

    else if (this.dataSource && this.dataSource.data && this.dataSource.data.length === 0 && this.getFilterValue) {
      this.tableData.loader = false
    }
  }
  ngAfterViewInit() { }

  applyFilter(filterValue: any) {
    this.filterSubject.next(filterValue)
  }

  onOrgPageChange(event: any) {
    this.pageIndex = event.pageIndex
    this.pageChangeEvent.emit(event)
  }

  initializeValuesAndAPIs() {
    this.createMdoService.getStatesOrMinisteries('state').subscribe(res => {
      if (res && res.result && res.result && res.result.response && res.result.response.content) {
        this.dropdownList.statesList = _.orderBy(res.result.response.content, ['orgName'], ['asc'])
      }
    })

    this.createMdoService.getStatesOrMinisteries('ministry').subscribe(res => {
      if (res && res.result && res.result && res.result.response && res.result.response.content) {
        this.dropdownList.ministriesList = _.orderBy(res.result.response.content, ['orgName'], ['asc'])
      }
    })
  }

  get getFilterValue(): any {
    return this.filterSubject.getValue()
  }


  buttonClick(action: string, row: any) {
    if (this.tableData) {
      const isDisabled = _.get(_.find(this.tableData.actions, ac => ac.name === action), 'disabled') || false
      if (!isDisabled && this.actionsClick) {
        this.actionsClick.emit({ action, row })
      }
    }
  }

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
      if (this.tableData.link) {
        columns.push(this.tableData?.link?.column)
      }
      return columns
    }
    return ''
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  filterList(list: any[], key: string) {
    return list.map(lst => lst[key])
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: any) => this.selection.select(row))
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`
  }

  onRowClick(e: any) {
    this.eOnRowClick.emit({ data: e, type: 'users' })
    this.raiseTelemetryForRow('row', e)
  }

  gotoCreateNew() {
    if (this.selectedDepartment === 'organisation') {
      this.openCreateNavBar = true
      this.openMode = 'createNew'
      this.toggleOverlay(true)

      // this.openMode = 'viewMode'
      this.rowData = {}
    } else {
      this.router.navigate([`/app/home/${this.selectedDepartment}/create-department`, { needAddAdmin: true }])
    }
  }
  raiseTelemetryForRow(sub: string, e: any) {
    this.events.raiseInteractTelemetry({
      type: 'click',
      subType: sub,
      // tslint:disable-next-line:align
      id: `${sub}-click`,
      // tslint:disable-next-line:align
    }, {
      id: e.id,
      type: 'department',
    },
    )
  }

  onSearchEnter(filterValue: any) {
    this.searchByEnterKey.emit(filterValue)
  }

  buttonClickAction(event: any) {
    this.openCreateNavBar = false
    this.customSelfRegistration = false
    this.toggleOverlay(false)

    if (event.action === 'create') {

    }
  }

  generateCustRegistrationLink(row: any) {
    this.designationsService.getOrgReadData(row.id).subscribe((res: any) => {
      const frameworkId = _.get(res, 'frameworkid')

      if (frameworkId) {
        this.designationsService.getFrameworkInfo(frameworkId).subscribe({
          next: res => {
            const frameworkDetails = _.get(res, 'result.framework')
            if (frameworkDetails && Array.isArray(frameworkDetails.categories) && frameworkDetails.categories.length > 0) {
              const categoryDesignation = frameworkDetails.categories[0]

              if (
                categoryDesignation?.terms &&
                Array.isArray(categoryDesignation.terms) &&
                categoryDesignation.terms.length > 0 &&
                Array.isArray(categoryDesignation.terms[0]?.associations) &&
                categoryDesignation.terms[0].associations.length > 0
              ) {
                this.dialogRef = this.dialog.open(InfoModalComponent, {
                  panelClass: 'info-dialog',
                  data: { type: 'import-igot-master-review' }
                })
              } else {
                this.dialogRef = this.dialog.open(InfoModalComponent, {
                  panelClass: 'info-dialog',
                  data: { type: 'import-igot-master-create' }
                })
              }
              this.subscribeToAfterClosedModal(row)

            }

          },
          error: () => {
          },
        })

      } else {
        this.dialogRef = this.dialog.open(InfoModalComponent, {
          panelClass: 'info-dialog',
          data: { type: 'import-igot-master-create' }
        })
        this.subscribeToAfterClosedModal(row)
      }

    })

  }

  subscribeToAfterClosedModal(row: any) {
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.hasOwnProperty('reviewImporting') && !result.reviewImporting) {
        this.customSelfRegistration = true
        this.selfRegistrationData.title = 'Custom Self Registration'
        this.selfRegistrationData.QRGenerated = false
        this.selfRegistrationData.openMode = 'edit'
        this.selfRegistrationData.orgId = row.id
        this.selfRegistrationData.qrRegistrationLink = row.qrRegistrationLink
        this.selfRegistrationData.registrationLink = row.registrationLink
        this.selfRegistrationData.startDateRegistration = row.startDateRegistration
        this.selfRegistrationData.endDateRegistration = row.endDateRegistration
        this.selfRegistrationData.orgName = row.organisation

        this.toggleOverlay(true)
      }
      else if (result && result.reviewImporting || result.startImporting) {
        this.goToRoute('designation_master/import-designation', row)
      }
      else return

    })
  }

  organizationCreatedEmit(_event: any) {
    setTimeout(() => {
      this.searchByEnterKey.emit('')
    }, 1000)

  }

  goToRoute(type: string, data: any) {
    this.eOnRowClick.emit({ data: data, type: type })
    this.raiseTelemetryForRow('row', data)
  }

  editOrganization(data: any) {
    this.openCreateNavBar = true
    this.openMode = 'editMode'
    this.rowData = data
    this.toggleOverlay(true)
  }

  linkGeneratedEmit(event: any): void {
    if (event) this.searchByEnterKey.emit('')
  }

  toggleOverlay(showOverlay: boolean): void {
    const sidenav = document.querySelector('ws-app-home mat-sidenav') as HTMLElement
    if (sidenav) {
      sidenav.style.zIndex = showOverlay ? '0' : '2'
    }
  }
}
