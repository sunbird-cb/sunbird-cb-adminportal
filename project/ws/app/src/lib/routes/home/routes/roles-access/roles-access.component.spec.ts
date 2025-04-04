
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router'
import { RolesService } from '../../services/roles.service'
import { UsersService } from '../../services/users.service'
import { RolesAccessComponent } from './roles-access.component'
import { of } from 'rxjs'

describe('RolesAccessComponent', () => {
    let component: RolesAccessComponent

    const router: Partial<Router> = {}
    const activeRoute: Partial<ActivatedRoute> = {
        snapshot: {
            parent: {
                params: { batch: '12', id: '1' },
                paramMap: convertToParamMap({ contentId: '1234' }),
                data: {
                    configService: {
                        unMappedUser: {
                            roles: ['PUBLIC', 'STATE_ADMIN'],
                        },

                    },
                },
            },
            params: { id: '1', formId: '123' },
            paramMap: convertToParamMap({ contentId: '1234' }),
            queryParams: of({ roleId: 'testRoleId' }),
        } as any,
        queryParams: of({ someParam: 'initialValue' }),
    }
    const usersService: Partial<UsersService> = {
        getAllKongUsers: jest.fn(() => of({
            res: {
                result: {
                    response: {
                        content: 'sample content',
                    },
                },
            },
        })),
    }
    const roleservice: Partial<RolesService> = {}

    beforeAll(() => {
        component = new RolesAccessComponent(
            router as Router,
            activeRoute as ActivatedRoute,
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
