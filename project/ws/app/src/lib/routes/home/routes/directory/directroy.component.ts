import { Component, OnInit, ViewChild } from '@angular/core'
import { NSProfileDataV2 } from '../../models/profile-v2.model'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils'
/* tslint:disable */
import _ from 'lodash'
import { DirectoryService } from '../../services/directory.services'
import { UIDirectoryTableComponent } from '../../../../head/ui-admin-table/directory-list/directory-table.component'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'ws-app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1' },
  /* tslint:enable */
})
export class DirectoryViewComponent implements OnInit {
  @ViewChild(UIDirectoryTableComponent)
  searchInputvalue!: UIDirectoryTableComponent

  currentFilter = 'mdo'
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
  key = 'mdo'
  currentTab: any
  pagination = { limit: 20, offset: 0 }
  totalCount = 0
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private configSvc: ConfigurationsService,
    private directoryService: DirectoryService,
    private router: Router,
    private events: EventService,
    private datePipe: DatePipe
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
      this.currentTab = params['tab']
      if (this.currentFilter === null || this.currentFilter === undefined) {
        this.currentFilter = 'organisation'
      }
    })
    this.getAllDepartmentsHeaderAPI()
    this.getAllDepartments('')
    // console.log(this.key, 'key----')
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
      this.departmentHearders.push('Organisation') // need to remove befor commit
      if (this.departmentHearders && this.departmentHearders.length) {
        this.getDepartDataByKey(this.currentFilter)
        this.createTableHeader()
      }
    })
  }
  createTableHeader() {
    this.tabledata = []
    if (this.currentFilter === 'organisation') {
      this.tabledata = {
        columns: [
          { displayName: 'Organisation', key: 'organisation' },
          { displayName: 'Type', key: 'type' },
          { displayName: 'State/Center', key: 'stateOrMinistry' },
          { displayName: 'Created On', key: 'createdOn' },
        ],
        actions: [{ name: '', label: '', icon: 'remove_red_eye', type: 'menu' }],
        link: { name: 'generate_link', generateLabel: 'Generate Link', column: 'Custom Registration', viewLabel: 'View Link' },
        needCheckBox: false,
        needHash: false,
        sortColumn: '',
        sortState: 'asc',
        showNewNoContent: true,
        loader: true,
        tableDataCount: this.totalCount
      }
    } else {
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
        loader: true,
        tableDataCount: this.totalCount

      }
    }
    // console.log(key, 'key-------')
  }
  getAllDepartments(queryText: any) {
    this.tabledata.loader = true
    const query = queryText ? queryText : ''
    this.directoryService.getAllDepartmentsKong(query, this.pagination, this.currentTab,).subscribe(res => {
      this.wholeData2 = res.result.response.content
      this.tabledata.tableDataCount = res.result.response.count
      this.totalCount = res.result.response.count
      // this.wholeData2 = _.orderBy(this.wholeData2, ['createdDate'], ['desc'])
      if (this.departmentHearders && this.departmentHearders.length) {
        this.getDepartDataByKey(this.currentFilter)
      }
    })
  }
  onPageChange(event: any) {
    if (event) {
      this.pagination.offset = event.pageIndex
      this.pagination.limit = event.pageSize
      this.getAllDepartments('')
    }
  }

  onRoleClick(role: any,) {
    this.router.navigate([`/app/roles/${role.data.id}/users`], {
      queryParams:
      {
        currentDept: this.currentFilter,
        roleId: role.data.id,
        depatName: role.data.channel,
        orgName: role.data.mdo || role.data.organisation,
        tab: role.type,
        subOrgType: role.data.type
      }
    })
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
    } else if (value === 'organisation') {
      key = 'organisation'
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

    this.currentTab = value
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
                mdo: element.orgName,
                channel: element.channel,
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
                mdo: element.orgName,
                channel: element.channel,
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
                mdo: element.orgName,
                channel: element.channel,
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
                mdo: element.orgName,
                channel: element.channel,
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
                mdo: element.orgName,
                channel: element.channel,
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
        case 'organisation':
          this.wholeData2.forEach((element: any) => {
            let department = key
            // if (element.isMinistry || element.isState || element.isCbc || element.isMdo) {
            const obj = {
              id: element.id,
              currentDepartment: department,
              type: element.ministryOrStateType ? element.ministryOrStateType.charAt(0).toUpperCase() + element.ministryOrStateType.slice(1) : '',
              user: element.noOfMembers || 0,
              head: department,
              typeid: element.organisationSubType,
              organisation: element.orgName,
              createdBy: element.createdBy,
              createdOn: this.transformDate(element.createdDate),
              channel: element.channel,
              logo: element.logo,
              description: element.description,
              qrRegistrationLink: element?.qrRegistrationLink || null,
              registrationLink: element?.registrationLink || null,
              startDateRegistration: element?.startDateRegistration || null,
              endDateRegistration: element?.endDateRegistration || null,
              stateOrMinistry: element?.ministryOrStateName

            }
            filteredData2.push(obj)
            // }
          })
      }
      this.data = filteredData2.map((dept: any) => {
        return {
          id: dept.id,
          mdo: dept.mdo,
          channel: dept.channel,
          type: dept.type,
          user: dept.user,
          head: dept.head,
          typeid: dept.typeid,
          createdBy: dept.createdBy,
          createdOn: dept.createdOn,
          organisation: dept.organisation,
          logo: dept.logo,
          description: dept.description,
          qrRegistrationLink: dept.qrRegistrationLink,
          registrationLink: dept.registrationLink,
          startDateRegistration: dept.startDateRegistration,
          endDateRegistration: dept.endDateRegistration,
          stateOrMinistry: dept.stateOrMinistry,

        }
      })
      this.data = [...this.data]
      this.tabledata.loader = false
      // this.data.sort((a: any, b: any) => {
      //   const textA = a.mdo.trimStart().toUpperCase()
      //   const textB = b.mdo.trimStart().toUpperCase()
      //   return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      // })
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
    this.pagination.offset = 0
    this.getAllDepartments(enterValue)
  }

  transformDate(dateString: string): string | null {
    const isoDateString = dateString
      .replace(' ', 'T')
      .replace(/:(\d{3})\+/, '.$1+')
      .replace(/(\+\d{2})(\d{2})$/, '$1:$2')

    return this.datePipe.transform(isoDateString, 'dd/MM/yyyy, hh:mm a')
  }
}
