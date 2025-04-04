
import { ConfigurationsService, ValueService } from '@sunbird-cb/utils'
import { MeetupComponent } from './meetup.component'

describe('MeetupComponent', () => {
    let component: MeetupComponent

    const configSvc: Partial<ConfigurationsService> = {}
    const valSvc: Partial<ValueService> = {}

    beforeAll(() => {
        component = new MeetupComponent(
            configSvc as ConfigurationsService,
            valSvc as ValueService
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
