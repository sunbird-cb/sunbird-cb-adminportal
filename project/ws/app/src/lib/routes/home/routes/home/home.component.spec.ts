
import { Router, ActivatedRoute } from '@angular/router'
import { EventService, TelemetryService, UtilityService, ValueService } from '@sunbird-cb/utils'
import { LeftMenuService } from '@sunbird-cb/collection'
import { HomeComponent } from './home.component'
import { of } from 'rxjs'

describe('HomeComponent', () => {
    let component: HomeComponent

    const valueSvc: Partial<ValueService> = {
        isLtMedium$: of(true),
    }

    const router: Partial<Router> = {
        events: of(),
    }
    const activeRoute: Partial<ActivatedRoute> = {}
    const telemetrySvc: Partial<TelemetryService> = {}
    const events: Partial<EventService> = {}
    const utilitySvc: Partial<UtilityService> = {}
    const leftMenuService: Partial<LeftMenuService> = {
        onMessage: () => of({
            text: {
                message: 'sample',
            },
        }),
    }

    beforeAll(() => {
        component = new HomeComponent(
            valueSvc as ValueService,
            router as Router,
            activeRoute as ActivatedRoute,
            telemetrySvc as TelemetryService,
            events as EventService,
            utilitySvc as UtilityService,
            leftMenuService as LeftMenuService
        )
    })

    beforeEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
    })

    it('should create a instance of component', () => {
        expect(component).toBeTruthy()
    })

})
