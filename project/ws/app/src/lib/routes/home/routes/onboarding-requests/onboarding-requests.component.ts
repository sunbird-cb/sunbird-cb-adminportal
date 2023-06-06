import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { RequestsService } from '../../services/onboarding-requests.service'

@Component({
  selector: 'ws-app-onboarding-requests',
  templateUrl: './onboarding-requests.component.html',
  styleUrls: ['./onboarding-requests.component.scss'],
})
export class OnboardingRequestsComponent implements OnInit {
  tabledata: any = []
  tabledataApproved: any = []
  data: any = []
  requestType: any
  displayType: any
  currentFilter = 'pending'

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private requestService: RequestsService) {
    // this.requestType = this.activatedRoute.snapshot.params.type
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((routeParams: any) => {
      this.data = []
      this.currentFilter = 'pending'
      this.requestType = routeParams.type
      if (this.activatedRoute.snapshot.data && this.activatedRoute.snapshot.data.requestsList.data) {
        const resData = this.activatedRoute.snapshot.data.requestsList.data
        this.formatData(resData)
      } else {
        this.getPendingList()
      }

      if (this.requestType === 'position') {
        this.displayType = 'Position'
      } else if (this.requestType === 'organisation') {
        this.displayType = 'Organisation'
      } else if (this.requestType === 'domain') {
        this.displayType = 'Domain'
      }

      this.tabledata = {
        columns: [
          { key: 'createdDate', displayName: 'Created On' },
          { key: this.requestType, displayName: this.displayType },
          { key: 'firstName', displayName: 'Full Name' },
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
          { key: 'createdDate', displayName: 'Created On' },
          { key: this.requestType, displayName: this.displayType },
          { key: 'firstName', displayName: 'Full Name' },
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
    })
  }

  formatData(resData: any) {
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
        }
      })
    })
  }

  filter(key: 'pending' | 'approved' | 'rejected') {
    switch (key) {
      case 'pending':
        this.data = []
        this.currentFilter = 'pending'
        if (this.activatedRoute.snapshot.data && this.activatedRoute.snapshot.data.requestsList.data) {
          const resData = this.activatedRoute.snapshot.data.requestsList.data
          this.formatData(resData)
        } else {
          this.getPendingList()
        }
        break
      case 'approved':
        this.data = []
        this.currentFilter = 'approved'
        if (this.activatedRoute.snapshot.data && this.activatedRoute.snapshot.data.aprovedrequestsList.data) {
          const resData = this.activatedRoute.snapshot.data.aprovedrequestsList.data
          this.formatData(resData)
        } else {
          this.getApprovedList()
        }
        break
      case 'rejected':
        this.data = []
        this.currentFilter = 'rejected'
        if (this.activatedRoute.snapshot.data && this.activatedRoute.snapshot.data.rejectedList.data) {
          const resData = this.activatedRoute.snapshot.data.rejectedList.data
          this.formatData(resData)
        } else {
          this.getRejectedList()
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
        this.formatData(resData)
      })
    } else if (this.requestType === 'organisation') {
      this.requestService.getOrgsList(reqbody).subscribe((res: any) => {
        const resData = res.result.data
        this.formatData(resData)
      })
    } else if (this.requestType === 'domain') {
      this.requestService.getDomainsList(reqbody).subscribe((res: any) => {
        const resData = res.result.data
        this.formatData(resData)
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
        this.formatData(resData)
      })
    } else if (this.requestType === 'organisation') {
      this.requestService.getOrgsList(reqbody).subscribe((res: any) => {
        const resData = res.result.data
        this.formatData(resData)
      })
    } else if (this.requestType === 'domain') {
      this.requestService.getDomainsList(reqbody).subscribe((res: any) => {
        const resData = res.result.data
        this.formatData(resData)
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
        this.formatData(resData)
      })
    } else if (this.requestType === 'organisation') {
      this.requestService.getOrgsList(reqbody).subscribe((res: any) => {
        const resData = res.result.data
        this.formatData(resData)
      })
    } else if (this.requestType === 'domain') {
      this.requestService.getDomainsList(reqbody).subscribe((res: any) => {
        const resData = res.result.data
        this.formatData(resData)
      })
    }
  }

  actionsClick($event: { action: string, row: any }) {
    this.route.navigate(['requests-approval'], { relativeTo: this.activatedRoute.parent, state: $event })
  }
}
