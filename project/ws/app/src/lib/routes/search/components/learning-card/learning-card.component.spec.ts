import { ConfigurationsService, EventService } from '@sunbird-cb/utils'
import { DomSanitizer } from '@angular/platform-browser'
import { LearningCardComponent } from './learning-card.component'

describe('LearningCardComponent', () => {
    let component: LearningCardComponent

    const events: Partial<EventService> = {}
    const configSvc: Partial<ConfigurationsService> = {}
    const domSanitizer: Partial<DomSanitizer> = {}

    beforeAll(() => {
        component = new LearningCardComponent(
            events as EventService,
            configSvc as ConfigurationsService,
            domSanitizer as DomSanitizer
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
