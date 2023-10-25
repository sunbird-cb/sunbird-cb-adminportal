import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { RequestsService } from '../../services/onboarding-requests.service'
import * as _ from 'lodash'
import { PageEvent } from '@angular/material'

@Component({
  selector: 'ws-app-email-domains',
  templateUrl: './email-domains.component.html',
  styleUrls: ['./email-domains.component.scss'],
})
export class EmailDomainsComponent implements OnInit {
  tabledata: any = []
  tabledataApproved: any = []
  data: any = []
  requestType = 'domain'
  currentFilter = 'pending'
  isSpvAdmin = false
  userDataTotalCount = 0
  limit = 20
  pageIndex = 0
  currentOffset = 0

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private requestService: RequestsService) {
    // this.requestType = this.activatedRoute.snapshot.params.type
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.data && this.activatedRoute.snapshot.data.requestsList) {
      const resData = this.activatedRoute.snapshot.data.requestsList.data.data
      this.userDataTotalCount = this.activatedRoute.snapshot.data.requestsList.data.count
      this.formatData(resData, this.currentFilter)
    } else {
      this.getPendingList()
    }

    this.tabledata = {
      columns: [
        { key: 'createdDate', displayName: 'Created on' },
        { key: this.requestType, displayName: 'Domain' },
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
        { key: this.requestType, displayName: 'Domain' },
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
  }

  formatData(resData: any, list: any) {
    this.data = []
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
          val.domain = obj.toValue.domain
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

  filter(key: 'pending' | 'approved' | 'rejected') {
    this.currentOffset = 0
    this.limit = 20
    switch (key) {
      case 'pending':
        this.data = []
        this.currentFilter = 'pending'
        this.getPendingList()
        break
      case 'approved':
        this.data = []
        this.currentFilter = 'approved'
        this.getApprovedList()
        break
      case 'rejected':
        this.data = []
        this.currentFilter = 'rejected'
        this.getRejectedList()
        break
      default:
        break
    }
  }

  getPendingList() {
    const reqbody = {
      serviceName: this.requestType,
      applicationStatus: 'IN_PROGRESS',
      limit: this.limit,
      offset: this.currentOffset,
      deptName: 'iGOT',
    }
    this.requestService.getDomainsList(reqbody).subscribe((res: any) => {
      this.userDataTotalCount = res.result.count
      const resData = res.result.data
      this.formatData(resData, 'pending')
    })
  }

  getApprovedList() {
    const reqbody = {
      serviceName: this.requestType,
      applicationStatus: 'APPROVED',
      limit: this.limit,
      offset: this.currentOffset,
      deptName: 'iGOT',
    }
    this.requestService.getDomainsList(reqbody).subscribe((res: any) => {
      const resData = res.result.data
      this.userDataTotalCount = res.result.count
      this.formatData(resData, 'approved')
    })
  }

  getRejectedList() {
    const reqbody = {
      serviceName: this.requestType,
      applicationStatus: 'REJECTED',
      limit: this.limit,
      offset: this.currentOffset,
      deptName: 'iGOT',
    }
    this.requestService.getDomainsList(reqbody).subscribe((res: any) => {
      const resData = res.result.data
      this.userDataTotalCount = res.result.count
      this.formatData(resData, 'rejected')
    })
  }

  actionsClick($event: { action: string, row: any }) {
    this.route.navigate(['requests-approval'], { relativeTo: this.activatedRoute.parent, state: $event })
  }

  onPaginateChange(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.limit = event.pageSize
    this.currentOffset = event.pageIndex
    switch (this.currentFilter) {
      case 'pending':
        this.getPendingList()
        break
      case 'approved':
        this.getApprovedList()
        break
      case 'rejected':
        this.getRejectedList()
        break
      default:
        break
    }
  }
}
