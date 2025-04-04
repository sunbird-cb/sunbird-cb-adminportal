
import { ConfigurationsService } from '@sunbird-cb/utils'
import { ConfigResolveService } from './config-resolver.service'

describe('ConfigResolveService', () => {
    let component: ConfigResolveService

    const confService: Partial<ConfigurationsService> = {}

    beforeAll(() => {
        component = new ConfigResolveService(
            confService as ConfigurationsService
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