import { ConfigurationsService } from '@sunbird-cb/utils'
import { AboutVideoComponent } from './about-video.component'

describe('AboutVideoComponent', () => {
    let component: AboutVideoComponent

    const configSvc: Partial<ConfigurationsService> = {}

    beforeAll(() => {
        component = new AboutVideoComponent(
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
