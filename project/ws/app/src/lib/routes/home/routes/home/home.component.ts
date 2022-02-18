
import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, HostListener, ViewChild } from '@angular/core'
import { Router, Event, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router'
import { EventService, TelemetryService, UtilityService, ValueService } from '@sunbird-cb/utils'
import { map } from 'rxjs/operators'
/* tslint:disable */
import _ from 'lodash'
import { ILeftMenu, LeftMenuService } from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { Subscription } from 'rxjs'
/* tslint:enable */

@Component({
  selector: 'ws-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  /* tslint:disable */
  host: { class: 'margin-top-l' },
  /* tslint:enable */
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  sideNavBarOpened = true
  panelOpenState = false
  titles = [{ title: 'NETWORK', url: '/app/network-v2', icon: 'group' }]
  widgetData!: NsWidgetResolver.IWidgetData<ILeftMenu>
  unread = 0
  currentRoute = 'home'
  currentPath!: string
  myRoles!: Set<string>
  subscription: Subscription
  banner!: NsWidgetResolver.IWidgetData<any>
  private bannerSubscription: any
  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  mode$ = this.isLtMedium$.pipe(map(isMedium => (isMedium ? 'over' : 'side')))
  userRouteName = ''
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  elementPosition: any
  sticky = false
  department: any = {}
  departmentName = ''
  private defaultSideNavBarOpenedSubscription: any
  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset
    if (windowScroll >= this.elementPosition) {
      this.sticky = true
    } else {
      this.sticky = false
    }
  }
  constructor(private valueSvc: ValueService, private router: Router, private activeRoute: ActivatedRoute, private telemetrySvc: TelemetryService, private events: EventService, private utilitySvc: UtilityService, private leftMenuService: LeftMenuService) {
    this.subscription = this.leftMenuService.onMessage().subscribe(message => {
      if (message) {
        this.raiseTelemetry(message.text.name)
      } else {
        // clear messages when empty message received
      }
    })
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        // console.log(event.url)
        const pageContext = this.utilitySvc.routeData
        const data = {
          pageContext,
        }
        // console.log('data: ', data)
        if (data.pageContext.pageId && data.pageContext.module) {
          this.telemetrySvc.impression(data)
        } else {
          this.telemetrySvc.impression()
        }
        // this.widgetData = this.activeRoute.snapshot.data &&
        //   this.activeRoute.snapshot.data.pageData.data.menus || []
        if (this.activeRoute.snapshot.data.department.data) {
          const leftData = this.activeRoute.snapshot.data.pageData.data.menus
          _.set(leftData, 'widgetData.logo', true)
          _.set(leftData, 'widgetData.logoPath', _.get(this.activeRoute, 'snapshot.data.department.data.logo'))
          _.set(leftData, 'widgetData.name', _.get(this.activeRoute, 'snapshot.data.department.data.description'))
          _.set(leftData, 'widgetData.userRoles', this.myRoles)
          this.widgetData = leftData
        } else {
          this.widgetData = this.activeRoute.snapshot.data.pageData.data.menus

        }

        this.department = this.activeRoute.snapshot.data.department.data
        this.departmentName = this.department ? this.department.deptName : ''

      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        // console.log(event.error)
      }
    })

  }
  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })
    // Application start telemetry
    this.telemetrySvc.start('app', 'view', '')
  }
  ngAfterViewInit() {
    // this.elementPosition = this.menuElement.nativeElement.offsetTop
  }
  bindUrl(path: string) {
    if (path) {
      this.currentRoute = path
    }
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
    if (this.bannerSubscription) {
      this.bannerSubscription.unsubscribe()
    }
  }
  sidenavClick() {
    if (this.currentPath !== window.location.href) {
      this.currentPath = window.location.href
    }
  }

  raiseTelemetry(sub: string) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: sub,
        id: `${_.camelCase(sub)}-menu`,
      },
      {},
    )
  }

}
