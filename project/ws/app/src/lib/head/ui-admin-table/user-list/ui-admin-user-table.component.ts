import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild,
  AfterViewInit, OnChanges, SimpleChanges,
} from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatTableDataSource } from '@angular/material/table'
import { MatDialog, MatPaginator, MatSnackBar } from '@angular/material'
import { MatSort } from '@angular/material/sort'
import * as _ from 'lodash'

import { ITableData, IColums } from '../interface/interfaces'
import { Router, ActivatedRoute } from '@angular/router'
import { UserPopupComponent } from '../user-popup/user-popup'
import { CreateMDOService as MDO2 } from '../../../routes/home/services/create-mdo.services'
import { EventService } from '@sunbird-cb/utils'
import { environment } from '../../../../../../../../src/environments/environment'

@Component({
  selector: 'ws-widget-ui-user-table',
  templateUrl: './ui-admin-user-table.component.html',
  styleUrls: ['./ui-admin-user-table.component.scss'],
})
export class UIAdminUserTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() tableData!: ITableData | undefined
  @Input() data?: []
  @Input() needCreateUser?: boolean = undefined
  @Input() needAddAdmin?: boolean
  @Input() isUpload?: boolean
  @Input() isCreate?: boolean
  @Input() otherInput?: any
  @Input() currentTabData!: string
  @Input() inputDepartmentId?: string | undefined
  @Output() clicked?: EventEmitter<any>
  @Output() actionsClick?: EventEmitter<any>
  @Output() eOnRowClick = new EventEmitter<any>()
  @Output() searchByEnterKey = new EventEmitter<any>()
  bodyHeight = document.body.clientHeight - 125
  displayedColumns: IColums[] | undefined
  viewPaginator = false
  dataSource!: any
  widgetData: any
  length!: number
  departmentRole!: string
  departmentId!: string | undefined
  pageSize = 5
  currentTabName!: string
  pageSizeOptions = [5, 10, 20]
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator
  @ViewChild(MatSort, { static: true }) sort?: MatSort
  selection = new SelectionModel<any>(true, [])
  departmentName: any
  userRoleDetails: any
  currentUserId!: any
  userRoles: string[] = []
  isStateAdmin = false
  isReports = false
  reportsPath: any
  constructor(
    private router: Router, public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private createMDOService2: MDO2,
    private events: EventService,
    private snackBar: MatSnackBar) {
    this.userRoles = _.get(this.activatedRoute, 'snapshot.parent.data.configService.unMappedUser.roles')
    if (this.userRoles.indexOf('STATE_ADMIN') >= 0) {
      this.isStateAdmin = true
    }
    this.dataSource = new MatTableDataSource<any>()
    this.actionsClick = new EventEmitter()
    this.clicked = new EventEmitter()
    this.dataSource.paginator = this.paginator

  }

  ngOnInit() {
    this.currentUserId = sessionStorage.getItem('idDetails') ? sessionStorage.getItem('idDetails') : ''
    if (this.tableData) {
      this.displayedColumns = this.tableData.columns
    }
    this.dataSource.data = this.data
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.viewPaginator = true
    this.activatedRoute.queryParams.subscribe(params => {
      this.departmentRole = params['currentDept']
      this.departmentName = params['depatName']
      this.departmentId = params['roleId']
      this.reportsPath = params['path']
      if (this.needCreateUser !== false && (this.departmentRole && this.departmentRole !== 'ministry') && this.departmentId) {
        this.needAddAdmin = true
        this.needCreateUser = true
      }
    })
    if (!this.departmentId && this.inputDepartmentId) {
      this.departmentId = this.inputDepartmentId
    }
    if (environment.departments && environment.departments.includes(this.departmentRole) && this.reportsPath === 'reports') {
      this.isReports = true
    }
  }

  ngOnChanges(data: SimpleChanges) {
    this.currentTabName = this.currentTabData
    this.dataSource.data = _.get(data, 'data.currentValue')
    this.length = this.dataSource.data.length
  }

  ngAfterViewInit() { }

  applyFilter(filterValue: any) {

    if (filterValue) {
      let fValue = filterValue.trim()
      fValue = filterValue.toLowerCase()
      this.dataSource.filter = fValue
    } else {
      this.dataSource.filter = ''
    }
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
      if (this.tableData.needUserMenus) {
        columns.push('Menu')
      }
      return columns
    }
    return ''
  }
  openPopup() {
    const dialogRef = this.dialog.open(UserPopupComponent, {
      maxHeight: 'auto',
      height: '65%',
      width: '80%',
      panelClass: 'remove-pad',
    })
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response !== undefined && response.data !== undefined && response.data.length > 0) {
        response.data.forEach((user: { userId: string }) => {
          if (this.departmentName) {
            if (this.otherInput && this.otherInput.depName) {
              this.departmentName = this.otherInput.depName
            }
            this.createMDOService2.searchedUserdata.subscribe(data => {
              this.userRoleDetails = []
              if (data.length > 0) {
                data.forEach((usr: any) => {
                  if (user.userId === usr.userId) {
                    usr.organisations.forEach((role: any) => {
                      this.userRoleDetails = role.roles
                    })
                  }
                })
              }
            })
            if (this.departmentRole === 'state') {
              this.userRoleDetails.push('STATE_ADMIN')
            } else {
              this.userRoleDetails.push('MDO_ADMIN')
            }

            if (this.departmentId !== undefined) {
              this.createMDOService2.assignAdminToDepartment(user.userId, this.departmentId, this.userRoleDetails).subscribe(res => {
                if (res) {
                  this.snackBar.open('Admin assigned Successfully')
                  this.router.navigate(['/app/home/directory', { department: this.departmentRole }])
                }
              },
                (error: any) => {
                  this.openSnackbar(error.error.message)
                })
            }
          }
        })
      }
    })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
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
    this.eOnRowClick.emit(e)

  }
  gotoCreateUser() {
    this.raiseTelemetry('button')
    this.router.navigate([`/app/home/create-user`],
      // tslint:disable-next-line:align
      {
        queryParams: {
          id: this.departmentId, currentDept: this.departmentRole,
          createDept: JSON.stringify(this.otherInput),
          redirectionPath: window.location.href,
        },
      })
  }

  raiseTelemetry(sub: string) {
    this.events.raiseInteractTelemetry({
      type: 'click',
      subType: sub,
      id: `${sub}-click`,
    },
      // tslint:disable-next-line:align
      {},
    )
  }

  onSearchEnter(event: any) {
    this.searchByEnterKey.emit(event.target.value)
  }

  downloadUsersReport(value: string) {
    const popup = this.snackBar
    const fileName = value.replace(/\s+/g, '-')
    const downloadUrl = `${environment.karmYogiPath}/${'content-store/user-report/'}${this.departmentId}/${fileName}-userReport.zip`
    // window.location.href = downloadUrl
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return
      }
      if (xhr.status === 200) {
        window.location.href = downloadUrl
      } else {
        popup.open('Report is not available')
      }
    }
    xhr.open('GET', downloadUrl)
    xhr.send()
  }

  downloadConsumptionReport(value: string) {
    const popup = this.snackBar
    const fileName = value.replace(/\s+/g, '-')
    const downloadUrl = `${environment.karmYogiPath}/${environment.userBucket}${this.departmentId}/${fileName}-userEnrolmentReport.zip`
    // window.location.href = downloadUrl
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return
      }
      if (xhr.status === 200) {
        window.location.href = downloadUrl
      } else {
        popup.open('Report is not available')
      }
    }
    xhr.open('GET', downloadUrl)
    xhr.send()
  }
}
