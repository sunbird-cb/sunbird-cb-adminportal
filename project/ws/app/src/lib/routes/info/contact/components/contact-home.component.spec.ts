
import { ConfigurationsService } from '@sunbird-cb/utils'
import { ContactHomeComponent } from './contact-home.component'

describe('ContactHomeComponent', () => {
    let component: ContactHomeComponent

    const configSvc: Partial<ConfigurationsService> = {}

    beforeAll(() => {
        component = new ContactHomeComponent(
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
