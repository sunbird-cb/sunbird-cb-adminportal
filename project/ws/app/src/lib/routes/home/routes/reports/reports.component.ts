import { Component, OnInit, ViewChild } from '@angular/core'
import { NSProfileDataV2 } from '../../models/profile-v2.model'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils'
/* tslint:disable */
import _ from 'lodash'
import { DirectoryService } from '../../services/directory.services'
import { UIDirectoryTableComponent } from '../../../../head/ui-admin-table/directory-list/directory-table.component'

@Component({
  selector: 'ws-app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {

  @ViewChild(UIDirectoryTableComponent, { static: false })
  searchInputvalue!: UIDirectoryTableComponent

  currentFilter = 'ministry'
  portalProfile!: NSProfileDataV2.IProfile
  tabs: any
  tabsData: NSProfileDataV2.IProfileTab[]
  currentUser!: string | null
  tabledata: any = []
  currentDepartment!: string
  data: any = []
  wholeData2: any = []
  departmentHearders: any = []
  departmentHeaderArray: any = []
  isStateAdmin = false
  key = 'ministry'
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private configSvc: ConfigurationsService,
    private directoryService: DirectoryService,
    private router: Router,
    private events: EventService,
  ) {
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
    this.tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
    this.tabs = this.route.data.subscribe(data => {
      this.portalProfile = data.profile
        && data.profile.data
        && data.profile.data.length > 0
        && data.profile.data[0]
    })
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentFilter = params['tab']
      if (this.currentFilter === null || this.currentFilter === undefined) {
        this.currentFilter = 'ministry'
      }
    })
    this.getAllDepartmentsHeaderAPI()
    this.getAllDepartments('')
  }
  getAllDepartmentsHeaderAPI() {
    this.directoryService.getDepartmentTitles().subscribe(res => {
      const departmentHeaderArray = JSON.parse(res.result.response.value)
      departmentHeaderArray.orgTypeList.forEach((ele: { name: any, isHidden: any }) => {
        if (!(ele.isHidden)) {
          if (ele.name === 'CBP') {
            this.departmentHearders.push('CBP Providers')
          } else {
            this.departmentHearders.push(ele.name)
          }
        }
      })
      if (this.departmentHearders && this.departmentHearders.length) {
        this.getDepartDataByKey(this.currentFilter)
        this.createTableHeader()
      }
    })
  }
  createTableHeader() {
    this.tabledata = []
    this.tabledata = {
      actions: [{ name: 'Edit', label: 'Edit info', icon: 'remove_red_eye', type: 'button' }],
      columns: [
        { displayName: 'Department', key: 'mdo' },
        { displayName: 'Type', key: 'type' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      sortState: 'asc',

    }
    // console.log(key, 'key-------')
  }
  getAllDepartments(queryText: any) {
    const query = queryText ? queryText : ''
    this.directoryService.getAllDepartmentsKong(query).subscribe(res => {
      this.wholeData2 = res.result.response.content
      if (this.departmentHearders && this.departmentHearders.length) {
        this.getDepartDataByKey(this.currentFilter)
      }
    })
  }
  onRoleClick(role: any) {
    this.router.navigate([`/app/roles/${role.id}/users`], { queryParams: { currentDept: this.currentFilter, roleId: role.id, depatName: role.mdo, deptType: role.type } })
  }

  filter(value: string) {
    this.searchInputvalue.searchInput.nativeElement.value = ''
    let key = ''
    let index = 1
    if (value === 'cbc') {
      key = 'cbc'
    } else if (value === 'cbp providers') {
      key = 'cbp-providers'
    } else if (value === 'mdo') {
      key = 'mdo'
    } else if (value === 'spv') {
      key = 'spv'
    } else if (value === 'state') {
      key = 'state'
    } else if (value === 'ministry') {
      key = 'ministry'
    }
    if (key === 'cbc') {
      index = 1
    } else if (key === 'cbp-providers') {
      index = 2
    } else if (key === 'spv') {
      index = 3
    }
    const data = {
      index,
      label: key,
    }
    this.searchInputvalue.applyFilter('')
    this.getAllDepartments('')
    this.raiseTabTelemetry(key, data)
    this.getDepartDataByKey(key)
  }
  getDepartDataByKey(key: string) {
    if (key) {
      this.currentFilter = key
      this.currentDepartment = key
      const filteredData2: any[] = []
      switch (key) {
        case 'mdo':
          this.wholeData2.forEach((element: any) => {
            let department = ''
            if (element.isMdo) {
              department = key
              const obj = {
                id: element.id,
                mdo: element.channel,
                currentDepartment: department,
                type: department,
                user: element.noOfMembers || 0,
                head: department,
                typeid: element.organisationSubType,
              }
              filteredData2.push(obj)
            }
          })
          break
        case 'cbp-providers':
          this.wholeData2.forEach((element: any) => {
            let department = ''
            if (element.isCbp) {
              department = key
              const obj = {
                id: element.id,
                mdo: element.channel,
                currentDepartment: department,
                type: department,
                user: element.noOfMembers || 0,
                head: department,
                typeid: element.organisationSubType,
              }
              filteredData2.push(obj)
            }
          })
          break
        case 'cbc':
          this.wholeData2.forEach((element: any) => {
            let department = ''
            if (element.isCbc) {
              department = key
              const obj = {
                id: element.id,
                mdo: element.channel,
                currentDepartment: department,
                type: department,
                user: element.noOfMembers || 0,
                head: department,
                typeid: element.organisationSubType,
              }
              filteredData2.push(obj)
            }
          })
          break
        case 'state':
          this.wholeData2.forEach((element: any) => {
            let department = ''
            if (element.isState) {
              department = key
              const obj = {
                id: element.id,
                mdo: element.channel,
                currentDepartment: department,
                type: department,
                user: element.noOfMembers || 0,
                head: department,
                typeid: element.organisationSubType,
              }
              filteredData2.push(obj)
            }
          })
          break
        case 'ministry':
          this.wholeData2.forEach((element: any) => {
            let department = ''
            if (element.isMinistry) {
              department = key
              const obj = {
                id: element.id,
                mdo: element.channel,
                currentDepartment: department,
                type: department,
                user: element.noOfMembers || 0,
                head: department,
                typeid: element.organisationSubType,
              }
              filteredData2.push(obj)
            }
          })
      }
      this.data = filteredData2.map((dept: any) => {
        return {
          id: dept.id,
          mdo: dept.mdo,
          type: dept.type,
          user: dept.user,
          head: dept.head,
          typeid: dept.typeid,
        }
      })
    }
    this.createTableHeader()
  }

  actionClick(clickedData: any) {
    this.router.navigate([`/app/home/${this.currentFilter}/create-department`, { data: JSON.stringify(clickedData) }])
  }
  raiseTabTelemetry(sub: string, data: WsEvents.ITelemetryTabData) {
    this.events.handleTabTelemetry(sub, data)
  }

  onEnterkySearch(enterValue: any) {
    this.getAllDepartments(enterValue)
  }

}
