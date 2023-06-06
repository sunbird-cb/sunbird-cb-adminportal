
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ITableData } from '@sunbird-cb/collection/lib/ui-admin-table/interface/interfaces'
// tslint:disable-next-line
import _ from 'lodash'
import { PositionsService } from '../../services/position.service'

@Component({
  selector: 'ws-app-positions-list',
  templateUrl: './positions-list.component.html',
  styleUrls: ['./positions-list.component.scss'],
})
export class PositionsListComponent implements OnInit {

  tableData: ITableData | undefined
  data?: any[]
  constructor(private aRoute: ActivatedRoute, private positionsSvc: PositionsService) {
    this.tableData = {
      columns: [
        { key: 'createdOn', displayName: 'Created On' },
        { key: 'name', displayName: 'Position' },
        { key: 'description', displayName: 'Position Description' },
      ],
      actions: [
        // { name: 'edit', label: 'Edit', icon: 'edit', type: 'link' },
        // { name: 'delete', label: 'Delete', icon: 'delete', type: 'link' },
      ],
      needHash: false,
      needCheckBox: false,
      sortState: 'asc',
      sortColumn: 'name',
      needUserMenus: false,
    }

  }
  ngOnInit(): void {
    if (this.aRoute.snapshot.data && this.aRoute.snapshot.data.positions.data) {
      this.data = this.aRoute.snapshot.data.positions.data
    } else {
      this.getPositionsList()
    }
  }

  getPositionsList() {
    const reqbody = {
      serviceName: 'position',
      applicationStatus: 'APPROVED',
      limit: 1000,
      offset: 0,
      deptName: 'iGOT',
    }
    this.positionsSvc.getPositionsList(reqbody).subscribe((res: any) => {
      this.data = res.result.data
    })
  }
  // actionsClick($event: { action: string, row: any }) {
  //   // console.log($event)
  //   this.route.navigate(['new-position'], { relativeTo: this.aRoute.parent, state: $event })
  // }
}
