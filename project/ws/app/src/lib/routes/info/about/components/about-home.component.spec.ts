import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout'
import { DomSanitizer, SafeResourceUrl, SafeStyle } from '@angular/platform-browser'
import { ConfigurationsService, NsPage } from '@sunbird-cb/utils'
import { ActivatedRoute, Data } from '@angular/router'
import { AboutHomeComponent } from './about-home.component'
import { of } from 'rxjs'

describe('AboutHomeComponent', () => {
    let component: AboutHomeComponent
    let breakpointObserver: Partial<BreakpointObserver>
    let domSanitizer: Partial<DomSanitizer>
    let configSvc: Partial<ConfigurationsService>
    let activateRoute: Partial<ActivatedRoute>

    beforeAll(() => {
        breakpointObserver = {
            observe: jest.fn().mockReturnValue(of({ matches: true } as BreakpointState)),
        }
        domSanitizer = {
            bypassSecurityTrustResourceUrl: jest.fn().mockImplementation(url => url as SafeResourceUrl),
            bypassSecurityTrustStyle: jest.fn().mockImplementation(style => style as SafeStyle),
        }
        configSvc = {
            pageNavBar: {} as Partial<NsPage.INavBackground>,
        }
        activateRoute = {
            data: of({
                pageData: {
                    data: {
                        banner: {
                            videoLink: 'https://example.com/video.mp4',
                        },
                    },
                },
            } as Data),
        }

        component = new AboutHomeComponent(
            breakpointObserver as BreakpointObserver,
            domSanitizer as DomSanitizer,
            configSvc as ConfigurationsService,
            activateRoute as ActivatedRoute,
        )
    })

    beforeEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
    })

    it('should create an instance of the component', () => {
        expect(component).toBeTruthy()
    })

    it('should initialize isSmallScreen$ observable with true', done => {
        component.isSmallScreen$.subscribe(isSmallScreen => {
            expect(isSmallScreen).toBe(true)
            done()
        })
    })

    it('should unsubscribe from subscriptionAbout on ngOnDestroy', () => {
        component.ngOnInit()
        component.ngOnDestroy()

    })
})
