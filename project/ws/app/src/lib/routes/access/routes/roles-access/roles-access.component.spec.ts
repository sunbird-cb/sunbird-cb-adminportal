(window as any)['env'] = {
    name: 'test-environment',
    sitePath: '/test-site-path',
    karmYogiPath: '/test-karm-yogi-path',
    cbpPath: '/test-cbp-path',
}
import { ActivatedRoute } from '@angular/router'
import { UsersService } from '../../../home/services/users.service'
import { RolesService } from '../../../home/services/roles.service'
import { RolesAccessComponent } from './roles-access.component'
import { of } from 'rxjs'

describe('RolesAccessComponent', () => {
    let component: RolesAccessComponent

    const activatedRoute: Partial<ActivatedRoute> = {
        queryParams: of({}),
    }
    const usersService: Partial<UsersService> = {}
    const roleservice: Partial<RolesService> = {}

    beforeAll(() => {
        component = new RolesAccessComponent(
            activatedRoute as ActivatedRoute,
            usersService as UsersService,
            roleservice as RolesService
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
