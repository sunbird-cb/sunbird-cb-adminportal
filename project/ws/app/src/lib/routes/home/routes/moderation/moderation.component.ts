
import { Component, OnInit } from '@angular/core'
import { NSProfileDataV2 } from '../../models/profile-v2.model'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
/* tslint:disable */
import _ from 'lodash'
import { ModerationService } from '../../services/moderation.service'

@Component({
  selector: 'ws-app-directory',
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class ModerationViewComponent implements OnInit {
  currentFilter = 'MDO'
  portalProfile!: NSProfileDataV2.IProfile
  tabs: any
  tabsData: NSProfileDataV2.IProfileTab[]
  currentUser!: string | null
  tabledata: any = []
  currentDepartment!: string
  data: any = []
  wholeData2: any = []
  moderationHearders: any = []
  departmentHeaderArray: any = []
  moderationServiceData: any = []
  moderatedData: any = []
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private configSvc: ConfigurationsService,
    private moderationService: ModerationService,
    private router: Router
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
    this.moderationService.getModeratedData().subscribe((data: any) => {
      this.moderatedData = data.payload.feedbackList
    })
    this.moderationService.getData().subscribe((data: any) => {
      this.moderationServiceData = data.payload.feedbackList
    })

  }
  getAllDepartmentsHeaderAPI() {
    this.moderationHearders.push('For review')
    this.moderationHearders.push('Approved')
    this.moderationHearders.push('Rejected')
    this.getDepartDataByKey(this.moderationHearders[0])
    this.createTableHeader()
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
    this.moderationService.getAllDepartmentsKong().subscribe(res => {

      this.wholeData2 = res.result.response.content
      this.getDepartDataByKey('For review')
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
      const filteredData2: any[] = []
      switch (key) {
        case 'Rejected':
          this.moderationService.getModeratedData().subscribe((data: any) => {
            this.moderatedData = data.payload.feedbackList
          })
          this.moderatedData.forEach((element: any) => {
            if (element.classification !== 'SFW') {
              filteredData2.push(element)
            }

          })
          break
        case 'Approved':
          this.moderationService.getModeratedData().subscribe((data: any) => {
            this.moderatedData = data.payload.feedbackList
          })
          this.moderatedData.forEach((element: any) => {
            if (element.classification === 'SFW') {
              filteredData2.push(element)
            }
          })
          break
        case 'For review':
          this.moderationService.getData().subscribe((data: any) => {
            this.moderationServiceData = data.payload.feedbackList
          })
          this.moderationServiceData.forEach((element: any) => {
            filteredData2.push(element)
          })
          break
      }
      this.data = filteredData2
    }
    this.createTableHeader()
  }

  actionClick(clickedData: any) {
    this.router.navigate([`/app/home/${this.currentFilter}/create-department`, { data: JSON.stringify(clickedData) }])
  }

}
