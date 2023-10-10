import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { RequestsService } from '../../services/onboarding-requests.service'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-onboarding-requests',
  templateUrl: './onboarding-requests.component.html',
  styleUrls: ['./onboarding-requests.component.scss'],
})
export class OnboardingRequestsComponent implements OnInit {
  tabledata: any = []
  tabledataApproved: any = []
  tabledataPositions: any = []
  data: any = []
  requestType: any
  displayType: any
  currentFilter = 'pending'
  isSpvAdmin = false

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private requestService: RequestsService) {
    // this.requestType = this.activatedRoute.snapshot.params.type
  }

  ngOnInit() {
    const userRoles = _.get(this.activatedRoute, 'snapshot.parent.data.configService.userRoles')
    this.findSpvAdmin(userRoles)
    this.activatedRoute.params.subscribe((routeParams: any) => {
      this.data = []
      this.requestType = routeParams.type
      this.displayType = this.requestType
      if (this.requestType === 'designation') {
        this.requestType = 'position'
        this.currentFilter = 'designations'
      } else {
        this.currentFilter = 'pending'
      }
      if (this.requestType === 'position') {
        if (this.activatedRoute.snapshot.data && this.activatedRoute.snapshot.data.positionsList.data) {
          const resData = this.activatedRoute.snapshot.data.positionsList.data
          resData.forEach((req: any) => {
            this.data.push(req)
          })
          this.data.sort((a: any, b: any) => a.name - b.name)
        } else {
          this.data = []
        }
      } else {
        if (this.activatedRoute.snapshot.data && this.activatedRoute.snapshot.data.requestsList.data) {
          const resData = this.activatedRoute.snapshot.data.requestsList.data
          this.formatData(resData, this.currentFilter)
        } else {
          this.getPendingList()
        }
      }

      this.tabledata = {
        columns: [
          { key: 'createdDate', displayName: 'Created on' },
          { key: this.requestType, displayName: this.getDisplayName() },
          { key: 'firstName', displayName: 'Full name' },
          { key: 'email', displayName: 'Email' },
        ],
        actions: [
          { name: 'edit', label: 'Edit', icon: 'edit', type: 'link' },
        ],
        needHash: false,
        needCheckBox: false,
        sortState: 'asc',
        sortColumn: 'name',
        needUserMenus: false,
        actionColumnName: 'Edit',
      }

      this.tabledataApproved = {
        columns: [
          { key: 'lastupdateDate', displayName: 'Last updated on' },
          { key: this.requestType, displayName: this.getDisplayName() },
          { key: 'firstName', displayName: 'Full name' },
          { key: 'email', displayName: 'Email' },
        ],
        actions: [],
        needHash: false,
        needCheckBox: false,
        sortState: 'asc',
        sortColumn: 'name',
        needUserMenus: false,
        actionColumnName: 'Edit',
      }
      this.tabledataPositions = {
        columns: [
          { key: 'name', displayName: 'Name' },
          { key: 'description', displayName: 'Description' },
        ],
        actions: [],
        needHash: false,
        needCheckBox: false,
        sortState: 'asc',
        sortColumn: 'name',
        needUserMenus: false,
        actionColumnName: 'Edit',
      }
    })
  }

  getDisplayName() {
    return this.displayType.charAt(0).toUpperCase() + this.displayType.substr(1).toLowerCase()
  }

  formatData(resData: any, list: any) {
    resData.forEach((req: any) => {
      req.wfInfo.forEach((val: any) => {
        // this.data.push(val)
        const newobj = JSON.parse(val.updateFieldValues)
        const obj = newobj[0]

        if (obj.toValue && ((this.requestType === 'position' && obj.toValue.position) ||
          (this.requestType === 'organisation' && obj.toValue.organisation) || (this.requestType === 'domain' && obj.toValue.domain))) {
          // const date = new Date(val.createdOn).getDate()
          // tslint:disable-next-line:prefer-template
          const date = ('0' + (new Date(val.createdOn).getDate())).slice(-2)
          // const mm = new Date(val.createdOn).getMonth() + 1
          // tslint:disable-next-line:prefer-template
          const mm = ('0' + (new Date(val.createdOn).getMonth() + 1)).slice(-2)
          const year = new Date(val.createdOn).getFullYear()
          // tslint:disable-next-line:prefer-template
          const createdDate = date + `-` + mm + `-` + year
          val.createdDate = createdDate

          // tslint:disable-next-line:prefer-template
          const udate = ('0' + (new Date(val.lastUpdatedOn).getDate())).slice(-2)
          // tslint:disable-next-line:prefer-template
          const umm = ('0' + (new Date(val.lastUpdatedOn).getMonth() + 1)).slice(-2)
          const uyear = new Date(val.lastUpdatedOn).getFullYear()
          // tslint:disable-next-line:prefer-template
          const updatedDate = udate + `-` + umm + `-` + uyear
          val.lastupdateDate = updatedDate

          val.description = obj.description
          val.firstName = obj.firstName
          val.email = obj.email
          val.mobile = obj.mobile
          if (this.requestType === 'position') {
            val.position = obj.toValue.position
          } else if (this.requestType === 'organisation') {
            val.organisation = obj.toValue.organisation
          } else if (this.requestType === 'domain') {
            val.domain = obj.toValue.domain
          }
          this.data.push(val)

          this.data.sort((a: any, b: any) => {
            return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
          })

          if (list === 'rejected' || list === 'approved') {
            this.data.sort((a: any, b: any) => {
              return new Date(b.lastUpdatedOn).getTime() - new Date(a.lastUpdatedOn).getTime()
            })
          } else {
            this.data.sort((a: any, b: any) => {
              return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
            })
          }
        }
      })
    })
  }

  filter(key: 'pending' | 'approved' | 'rejected' | 'designations') {
    switch (key) {
      case 'pending':
        this.data = []
        this.currentFilter = 'pending'
        if (this.activatedRoute.snapshot.data && this.activatedRoute.snapshot.data.requestsList.data) {
          const resData = this.activatedRoute.snapshot.data.requestsList.data
          this.formatData(resData, 'pending')
        } else {
          this.getPendingList()
        }
        break
      case 'approved':
        this.data = []
        this.currentFilter = 'approved'
        if (this.activatedRoute.snapshot.data && this.activatedRoute.snapshot.data.aprovedrequestsList.data) {
          const resData = this.activatedRoute.snapshot.data.aprovedrequestsList.data
          this.formatData(resData, 'approved')
        } else {
          this.getApprovedList()
        }
        break
      case 'rejected':
        this.data = []
        this.currentFilter = 'rejected'
        if (this.activatedRoute.snapshot.data && this.activatedRoute.snapshot.data.rejectedList.data) {
          const resData = this.activatedRoute.snapshot.data.rejectedList.data
          this.formatData(resData, 'rejected')
        } else {
          this.getRejectedList()
        }
        break
      case 'designations':
        this.data = []
        this.currentFilter = 'designations'
        if (this.activatedRoute.snapshot.data && this.activatedRoute.snapshot.data.positionsList.data) {
          const resData = this.activatedRoute.snapshot.data.positionsList.data
          resData.forEach((req: any) => {
            this.data.push(req)
          })
          this.data.sort((a: any, b: any) => a.name - b.name)
        } else {
          this.data = []
        }
        break
      default:
        break
    }
  }

  getPendingList() {
    const reqbody = {
      serviceName: this.requestType,
      applicationStatus: 'IN_PROGRESS',
      limit: 1000,
      offset: 0,
      deptName: 'iGOT',
    }
    if (this.requestType === 'position') {
      this.requestService.getPositionsList(reqbody).subscribe((res: any) => {
        const resData = res.result.data
        this.formatData(resData, 'pending')
      })
    } else if (this.requestType === 'organisation') {
      this.requestService.getOrgsList(reqbody).subscribe((res: any) => {
        const resData = res.result.data
        this.formatData(resData, 'pending')
      })
    } else if (this.requestType === 'domain') {
      this.requestService.getDomainsList(reqbody).subscribe((res: any) => {
        const resData = res.result.data
        this.formatData(resData, 'pending')
      })
    }
  }

  getApprovedList() {
    const reqbody = {
      serviceName: this.requestType,
      applicationStatus: 'APPROVED',
      limit: 1000,
      offset: 0,
      deptName: 'iGOT',
    }
    if (this.requestType === 'position') {
      this.requestService.getPositionsList(reqbody).subscribe((res: any) => {
        const resData = res.result.data
        this.formatData(resData, 'approved')
      })
    } else if (this.requestType === 'organisation') {
      this.requestService.getOrgsList(reqbody).subscribe((res: any) => {
        const resData = res.result.data
        this.formatData(resData, 'approved')
      })
    } else if (this.requestType === 'domain') {
      this.requestService.getDomainsList(reqbody).subscribe((res: any) => {
        const resData = res.result.data
        this.formatData(resData, 'approved')
      })
    }
  }

  getRejectedList() {
    const reqbody = {
      serviceName: this.requestType,
      applicationStatus: 'REJECTED',
      limit: 1000,
      offset: 0,
      deptName: 'iGOT',
    }
    if (this.requestType === 'position') {
      this.requestService.getPositionsList(reqbody).subscribe((res: any) => {
        const resData = res.result.data
        this.formatData(resData, 'rejected')
      })
    } else if (this.requestType === 'organisation') {
      this.requestService.getOrgsList(reqbody).subscribe((res: any) => {
        const resData = res.result.data
        this.formatData(resData, 'rejected')
      })
    } else if (this.requestType === 'domain') {
      this.requestService.getDomainsList(reqbody).subscribe((res: any) => {
        const resData = res.result.data
        this.formatData(resData, 'rejected')
      })
    }
  }

  actionsClick($event: { action: string, row: any }) {
    this.route.navigate(['requests-approval'], { relativeTo: this.activatedRoute.parent, state: $event })
  }

  findSpvAdmin(roles: any) {
    roles.forEach((value: any) => {
      if (value === 'spv_admin') {
        this.isSpvAdmin = true
      }
    })
  }
}
