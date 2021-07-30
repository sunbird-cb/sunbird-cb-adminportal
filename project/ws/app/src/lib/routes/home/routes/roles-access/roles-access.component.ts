import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core'
import {
  Router,

  // , ActivatedRoute
} from '@angular/router'
import * as _ from 'lodash'
// import { RolesAccessService } from '../../services/roles-access.service'
@Component({
  selector: 'ws-app-roles-access',
  templateUrl: './roles-access.component.html',
  styleUrls: ['./roles-access.component.scss'],
})
export class RolesAccessComponent implements OnInit, AfterViewInit, OnDestroy {
  tabledata: any = []
  data: any = []

  constructor(private router: Router,
    // private activeRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.tabledata = {
      columns: [
        { displayName: 'Role', key: 'role' },
        { displayName: 'Number of users', key: 'count' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: '',
      sortState: 'asc',
    }
    this.fetchRoles()
  }

  ngAfterViewInit() {
    // this.elementPosition = this.menuElement.nativeElement.parentElement.offsetTop
  }

  /* Click event to navigate to a particular role */
  onRoleClick() {
    this.router.navigate([`/app/home/users`])
  }

  /* API call to get all roles*/
  fetchRoles() {
    // const test = _.sortBy(_.uniq(_.flatten(_.map(_.get(this.activeRoute.snapshot, 'data.rolesList.data.orgTypeList'), 'roles')))) || []

  }

  ngOnDestroy() { }
}
