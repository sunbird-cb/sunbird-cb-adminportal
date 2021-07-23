
import { Component, OnInit } from '@angular/core'
import { NSProfileDataV2 } from '../../models/profile-v2.model'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
/* tslint:disable */
import _ from 'lodash'
import { DirectoryService } from './directory.services'

@Component({
  selector: 'ws-app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class DirectoryViewComponent implements OnInit {
  /* tslint:disable */
  Math: any
  /* tslint:enable */
  currentFilter = 'MDO'
  discussionList!: any
  discussProfileData!: any
  portalProfile!: NSProfileDataV2.IProfile
  userDetails: any
  location!: string | null
  tabs: any
  tabsData: NSProfileDataV2.IProfileTab[]
  currentUser!: string | null
  connectionRequests!: any[]
  tabledata: any = []
  currentDepartment!: string
  data: any = []
  wholeData: any = []
  wholeData2: any = []
  departmentHearders: any = []
  departmentHeaderArray: any = []

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private configSvc: ConfigurationsService,
    private directoryService: DirectoryService,
    private router: Router
  ) {
    this.Math = Math
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
  ngOnDestroy() {
    if (this.tabs) {
      this.tabs.unsubscribe()
    }
  }

  ngOnInit() {
    // int left blank
    // this.getAllDepartmentsAPI()
    // this.getDepartmentHeader()
    this.getAllDepartmentsHeaderAPI()
    this.getAllDepartments()
  }
  getAllDepartmentsHeaderAPI() {
    this.directoryService.getDepartmentTitles().subscribe(res => {
      this.departmentHeaderArray = JSON.parse(res.result.response.value)
      this.departmentHeaderArray.orgTypeList.forEach((ele: { name: any }) => {
        this.departmentHearders.push(ele.name)
      })
      this.getDepartDataByKey(this.departmentHearders[0])
      this.createTableHeader()
    })
  }
  getDepartmentHeader() {
    this.wholeData.forEach((head: { deptTypeInfos: [{ deptType: void }] }) => {
      head.deptTypeInfos.forEach(dept => {
        if (this.departmentHearders.indexOf(dept.deptType) === -1) {
          this.departmentHearders.push(dept.deptType)
        }
      })

    })
  }
  createTableHeader() {
    this.tabledata = []
    this.tabledata = {
      actions: [{ name: 'Edit', label: 'Edit info', icon: 'remove_red_eye', type: 'button' }],
      columns: [
        { displayName: this.currentFilter, key: 'mdo' },
        { displayName: 'Type', key: 'type' },
        { displayName: 'Users', key: 'user' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      sortState: 'asc',
    }
  }
  // getAllDepartmentsAPI() {
  //   this.directoryService.getAllDepartments().subscribe(res => {
  //     this.wholeData = res
  //     this.getDepartmentHeader()
  //   })
  // }
  getAllDepartments() {
    this.directoryService.getAllDepartmentsKong().subscribe(res => {
      this.wholeData2 = res.result.response.content
    })
  }
  onRoleClick(role: any) {
    this.router.navigate([`/app/roles/${role.id}/users`, { currentDept: this.currentFilter, roleId: role.id, depatName: role.mdo }])
  }
  filter(key: string | 'timestamp' | 'best' | 'saved') {
    this.getDepartDataByKey(key)
  }
  getDepartDataByKey(key: string) {
    if (key) {
      this.currentFilter = key
      this.currentDepartment = key
      // const filteredData: any[] = []
      const filteredData2: any[] = []

      // this.wholeData.map((dept: any) => {
      //   dept.deptTypeInfos.forEach((deptsub: { deptType: any, deptSubType: string, id: string }) => {
      //     if (deptsub.deptType === this.currentFilter) {
      //       const obj = {
      //         id: dept.id,
      //         mdo: dept.deptName,
      //         type: deptsub.deptSubType,
      //         user: dept.noOfUsers,
      //         head: dept.headquarters,
      //         typeid: deptsub.id,
      //       }

      //       filteredData.push(obj)
      //     }
      //   })
      // })
      this.wholeData2.forEach((element: any) => {

        var department = 'CBP'
        if (element.isMdo) {
          department = 'MDO'
        } else if (element.isCbp) {
          department = 'CBP'
        } else if (element.isCbc) {
          department = 'CBC'
        }
        const obj = {
          id: element.id,
          mdo: element.channel,
          currentDepartment: department,
          type: "MDO",
          user: element.noOfMembers || 0,
          head: "head",
          typeid: 6,
        }
        if (obj.currentDepartment === this.currentFilter) {
          filteredData2.push(obj)
        }
      })
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
      console.log(this.data)
      // this.data = filteredData.map((dept: any) => {
      //   return {
      //     id: dept.id,
      //     mdo: dept.mdo,
      //     type: dept.type,
      //     user: dept.user,
      //     head: dept.head,
      //     typeid: dept.typeid,
      //   }
      // })

    }


    this.tabsData = []
    this.tabledata = {
      actions: [{ name: 'Edit', label: 'Edit info', icon: 'remove_red_eye', type: 'button' }],
      columns: [
        { displayName: this.currentFilter, key: 'mdo' },
        { displayName: 'Type', key: 'type' },
        { displayName: 'Users', key: 'user' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      sortState: 'asc',

    }
  }

  actionClick(clickedData: any) {
    this.router.navigate([`/app/home/${this.currentFilter}/create-department`, { data: JSON.stringify(clickedData) }])
  }

}
