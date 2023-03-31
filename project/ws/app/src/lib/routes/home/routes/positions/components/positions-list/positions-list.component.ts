
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ITableData } from '@sunbird-cb/collection/lib/ui-admin-table/interface/interfaces'
// tslint:disable-next-line
import _ from 'lodash'

@Component({
  selector: 'ws-app-positions-list',
  templateUrl: './positions-list.component.html',
  styleUrls: ['./positions-list.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class PositionsListComponent implements OnInit {

  tableData: ITableData | undefined
  data?: any[]
  constructor(private aRoute: ActivatedRoute, private route: Router) {
    this.tableData = {
      columns: [
        { key: 'id', displayName: 'Unique ID', },
        { key: 'name', displayName: 'Position', },
        { key: 'description', displayName: 'Position Description', },
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
    this.data = this.aRoute.snapshot.data.positions.data || []
    // console.log(this.aRoute.snapshot.data.positions.data)
  }
  actionsClick($event: { action: string, row: any }) {
    console.log($event)
    this.route.navigate(['new-position'], { relativeTo: this.aRoute.parent, state: $event })
  }
}