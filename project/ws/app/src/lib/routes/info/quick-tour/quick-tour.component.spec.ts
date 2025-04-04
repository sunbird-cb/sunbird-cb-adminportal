import { ConfigurationsService } from '@sunbird-cb/utils'
import { QuickTourComponent } from './quick-tour.component'

describe('QuickTourComponent', () => {
    let component: QuickTourComponent

    const configSvc: Partial<ConfigurationsService> = {}

    beforeAll(() => {
        component = new QuickTourComponent(
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
