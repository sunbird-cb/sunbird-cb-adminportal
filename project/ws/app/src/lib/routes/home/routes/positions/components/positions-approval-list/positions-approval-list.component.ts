import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { PositionsService } from '../../services/position.service'
// tslint:disable-next-line
import _ from 'lodash'
@Component({
  selector: 'ws-app-positions-approval-list',
  templateUrl: './positions-approval-list.component.html',
  styleUrls: ['./positions-approval-list.component.scss'],
})

export class PositionsApprovalListComponent implements OnInit {
  tabledata: any
  data: any = []
  constructor(
    private aRoute: ActivatedRoute,
    private route: Router,
    private positionsSvc: PositionsService) {
    this.tabledata = {
      columns: [
        { key: 'createdDate', displayName: 'Created On' },
        { key: 'position', displayName: 'Position' },
        { key: 'firstName', displayName: 'Full Name' },
        { key: 'email', displayName: 'Email' },
      ],
      actions: [
        { name: 'edit', label: 'Edit', icon: 'edit', type: 'link' },
        // { name: 'delete', label: 'Delete', icon: 'delete', type: 'link' },
      ],
      needHash: false,
      needCheckBox: false,
      sortState: 'asc',
      sortColumn: 'name',
      needUserMenus: false,
      actionColumnName: 'Edit',
    }

  }
  ngOnInit() {
    if (this.aRoute.snapshot.data && this.aRoute.snapshot.data.positions.data) {
      const resData = this.aRoute.snapshot.data.positions.data
      resData.forEach((req: any) => {
        req.wfInfo.forEach((val: any) => {
          const newobj = JSON.parse(val.updateFieldValues)
          const obj = newobj[0]

          if (obj.toValue && obj.toValue.position) {
            const date = new Date(val.createdOn).getDate()
            const mm = new Date(val.createdOn).getMonth()
            const year = new Date(val.createdOn).getFullYear()
            // tslint:disable-next-line:prefer-template
            const createdDate = date + `-` + mm + `-` + year
            val.createdDate = createdDate

            val.description = obj.description
            val.firstName = obj.firstName
            val.email = obj.email
            val.mobile = obj.mobile
            val.position = obj.toValue.position
            this.data.push(val)
          }
        })
      })
    } else {
      this.getPositionsList()
    }
  }

  getPositionsList() {
    const reqbody = {
      serviceName: 'position',
      applicationStatus: 'IN_PROGRESS',
      limit: 1000,
      offset: 0,
      deptName: 'iGOT',
    }
    this.positionsSvc.getPositionsList(reqbody).subscribe((res: any) => {
      // this.data = res.result.data
      const resData = res.result.data
      resData.forEach((req: any) => {
        req.wfInfo.forEach((val: any) => {
          this.data.push(val)
        })
      })
    })
  }

  actionsClick($event: { action: string, row: any }) {
    // this.route.navigate(['new-position'], { relativeTo: this.aRoute.parent, state: $event })
    this.route.navigate(['new-position'], { relativeTo: this.aRoute.parent, state: $event })
  }
}
