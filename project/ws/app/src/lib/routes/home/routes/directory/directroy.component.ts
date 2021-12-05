
import { Component, OnInit } from '@angular/core'
import { NSProfileDataV2 } from '../../models/profile-v2.model'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils'
/* tslint:disable */
import _ from 'lodash'
import { DirectoryService } from '../../services/directory.services'
import { IBreadcrumbPath } from '@sunbird-cb/collection'

@Component({
  selector: 'ws-app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class DirectoryViewComponent implements OnInit {
  currentFilter = 'MDO'
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
    this.route.params.subscribe(params => {
      this.currentFilter = params['department']
      if (this.currentFilter === null || this.currentFilter === undefined) {
        this.currentFilter = 'MDO'
      }
    })

  }

  ngOnInit() {
    this.getAllDepartmentsHeaderAPI()
    this.getAllDepartments()
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
      this.getDepartDataByKey(this.departmentHearders[0])
      const teleData: IBreadcrumbPath = {
        text: 'Department List',
        clickUrl: '/app/home/department' + `${this.departmentHearders[0]}`,
      }
      this.raiseTelemetry(teleData, this.departmentHearders[0])
      this.createTableHeader()
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
  }
  getAllDepartments() {
    this.directoryService.getAllDepartmentsKong().subscribe(res => {
      this.wholeData2 = res.result.response.content
      this.getDepartDataByKey('CBC')
    })
  }
  onRoleClick(role: any) {
    this.router.navigate([`/app/roles/${role.id}/users`, { currentDept: this.currentFilter, roleId: role.id, depatName: role.mdo }])
  }
  filter(key: string | 'timestamp' | 'best' | 'saved') {
    const teleData: IBreadcrumbPath = {
      text: 'Department List',
      clickUrl: '/app/home/department' + `${key}`,
    }
    this.raiseTelemetry(teleData, 'click')
    this.getDepartDataByKey(key)
  }
  getDepartDataByKey(key: string) {
    if (key) {
      this.currentFilter = key
      this.currentDepartment = key
      const filteredData2: any[] = []
      switch (key) {
        case 'MDO':
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
        case 'CBP Providers':
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
        case 'CBC':
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

  raiseTelemetry(clickedItem: IBreadcrumbPath, sub: string) {
    this.events.raiseInteractTelemetry(
      'click',
      sub,
      {
        clickedItem,
        path: '/home/directory'
        ,
      },
    )
  }

}
