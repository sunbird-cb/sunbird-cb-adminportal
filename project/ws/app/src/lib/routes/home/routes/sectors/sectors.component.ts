import { Component, OnInit } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { ConfigurationsService } from '@sunbird-cb/utils'
import * as _ from 'lodash'
import { SectorsService } from './sectors.service'

@Component({
  selector: 'ws-app-sectors',
  templateUrl: './sectors.component.html',
  styleUrls: ['./sectors.component.scss'],
})
export class SectorsComponent implements OnInit {

  currentUser!: string | null
  tabledata: any = []
  data: any = []
  isLoading = false

  constructor(
    public dialog: MatDialog,
    private configSvc: ConfigurationsService,
    private sectorsService: SectorsService,
  ) {
    this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
  }

  ngOnInit() {
    this.tabledata = {
      columns: [
        { displayName: 'Sector', key: 'name' },
        { displayName: 'Sub-sectors', key: 'subSector' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: 'name',
      sortState: 'asc',
      needUserMenus: false,
      actionColumnName: 'Actions',
      actions: [{ icon: '', label: 'Action', name: 'DownloadFile', type: 'Standard', disabled: false }],
    }
    this.isLoading = true
    // Get all sectors
    this.sectorsService.getAllSectors().subscribe((resp: any) => {
      if (resp && resp.result && resp.result.sectors) {
        resp.result.sectors.forEach((obj: any) => {
          this.data.push({
            identifier: obj.identifier,
            name: obj.name,
            children: obj.children,
            code: obj.code,
            subSector: obj.children.length ? this.getSubSectors(obj.children) : '',
          })
        })
      }
      this.isLoading = false
    },                                            error => {
      this.isLoading = false
      // tslint:disable-next-line: no-console
      console.log(error)
    })
  }

  // Get all sub sectors
  getSubSectors(children: any) {
    const namesArray: any = []
    children.forEach((obj: any) => {
      namesArray.push(obj.name)
    })
    return namesArray.join(', ')
  }

}
