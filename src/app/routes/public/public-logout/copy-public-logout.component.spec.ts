
import { ConfigurationsService } from '@sunbird-cb/utils'
import { PublicLogoutComponent } from './public-logout.component'

describe('PublicLogoutComponent', () => {
    let component: PublicLogoutComponent

    const configSvc: Partial<ConfigurationsService> = {}

    beforeAll(() => {
        component = new PublicLogoutComponent(
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
