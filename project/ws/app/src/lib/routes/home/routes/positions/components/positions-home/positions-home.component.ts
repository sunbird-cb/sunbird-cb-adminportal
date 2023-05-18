
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-app-positions-home',
  templateUrl: './positions-home.component.html',
  styleUrls: ['./positions-home.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class PositionsHomeComponent implements OnInit {
  currentFilter = 'inactive'

  constructor(private route: Router) {
    this.currentActive = this.currentFilter
  }
  ngOnInit(): void {
  }

  set currentActive(val) {
    this.currentFilter = val
  }
  get currentActive() {
    this.currentFilter = this.route.url.includes('active-positions') || this.route.url.includes('new-position') ? 'active' : 'inactive'
    return this.currentFilter

  }
  filter(key: 'active' | 'inactive') {
    this.currentFilter = key
    switch (key) {
      case 'active':
        this.route.navigate(['app', 'home', 'positions', 'active-positions'], {})
        break
      case 'inactive':
        this.route.navigate(['app', 'home', 'positions', 'positions-for-approval'], {})

        break

      default:

        break
    }
  }
  newPosition() {
    this.route.navigate(['app', 'home', 'positions', 'new-position'], {})
  }
}
