
import { ActivatedRoute } from '@angular/router'
import { EventService } from '../../services/event.service'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { AppEventComponent } from './app-event.component'

describe('AppEventComponent', () => {
    let component: AppEventComponent

    const activatedRoute: Partial<ActivatedRoute> = {}
    const appEventSvc: Partial<EventService> = {}
    const configSvc: Partial<ConfigurationsService> = {}

    beforeAll(() => {
        component = new AppEventComponent(
            activatedRoute as ActivatedRoute,
            appEventSvc as EventService,
            configSvc as ConfigurationsService
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
