
import { ActivatedRoute } from '@angular/router'
import { EventService } from '../../services/event.service'
import { EventOverviewComponent } from './event-overview.component'

describe('EventOverviewComponent', () => {
    let component: EventOverviewComponent

    const activatedRoute: Partial<ActivatedRoute> = {}
    const appEventSvc: Partial<EventService> = {}

    beforeAll(() => {
        component = new EventOverviewComponent(
            activatedRoute as ActivatedRoute,
            appEventSvc as EventService
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
