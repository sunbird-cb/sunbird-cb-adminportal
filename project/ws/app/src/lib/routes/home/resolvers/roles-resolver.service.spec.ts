import { RolesService } from '../services/roles.service'
import { RolesResolver } from './roles-resolver.service'

describe('RolesResolver', () => {
    let component: RolesResolver

    const rolesService: Partial<RolesService> = {}

    beforeAll(() => {
        component = new RolesResolver(
            rolesService as RolesService
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