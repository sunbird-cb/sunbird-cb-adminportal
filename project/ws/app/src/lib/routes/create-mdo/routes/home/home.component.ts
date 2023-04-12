import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
// import { NsWidgetResolver } from '@sunbird-cb/resolver'
// import { ILeftMenu } from '@sunbird-cb/collection'
import { ValueService } from '@sunbird-cb/utils'
import { map } from 'rxjs/operators'

@Component({
  selector: 'ws-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  currentRoute = 'users'
  // widgetData!: NsWidgetResolver.IWidgetData<ILeftMenu>
  isLtMedium$ = this.valueSvc.isLtMedium$
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  private defaultSideNavBarOpenedSubscription: any
  public screenSizeIsLtMedium = false
  sideNavBarOpened = true
  mydept!: string
  role: any
  dept!: string
  urlValue: any = ''
  titles: any = []
  deptType: any
  constructor(
    private valueSvc: ValueService,
    // private router: Router,
    private route: ActivatedRoute,
  ) {
    // this.router.events.subscribe((event: Event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.bindUrl(event.urlAfterRedirects.replace('/app/roles-access/', ''))
    //     this.widgetData = this.activeRoute.snapshot.data &&
    //       this.activeRoute.snapshot.data.pageData.data.menus || []
    //   }
    //   if (event instanceof NavigationError) {

    //   }
    // })

  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.dept = params['currentDept']
      this.mydept = params['depatName']
      this.deptType = params['deptType']

      this.urlValue = this.dept
    })

    if (this.deptType === 'ministry' || this.deptType === 'state') {
      this.titles = [
        { title: 'Reports', url: '/app/home/reports' },
        { title: this.dept, url: `/app/home/reports/${this.urlValue}` },
        { title: this.mydept, url: 'none' },
      ]
    } else {
      this.titles = [
        { title: 'Directory', url: '/app/home/directory' },
        { title: this.dept, url: `/app/home/directory/${this.urlValue}` },
        { title: this.mydept, url: 'none' },
      ]
    }
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }

  bindUrl(path: string) {
    if (path) {
      this.currentRoute = path
    }
  }
}
