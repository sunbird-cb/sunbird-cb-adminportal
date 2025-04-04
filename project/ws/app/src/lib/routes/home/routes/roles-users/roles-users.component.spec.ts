import { Router, ActivatedRoute } from '@angular/router'
import { ProfileV2Service } from '../../../home/services/home.servive'
import { ProfileV2UtillService } from '../../services/home-utill.service'
import { UsersService } from '../../services/users.service'
import { RolesUsersComponent } from './roles-users.component'

describe('RolesUsersComponent', () => {
    let component: RolesUsersComponent

    const usersSvc: Partial<UsersService> = {}
    const router: Partial<Router> = {}
    const profileUtilSvc: Partial<ProfileV2UtillService> = {}
    const route: Partial<ActivatedRoute> = {}
    const profile: Partial<ProfileV2Service> = {}
    const usersService: Partial<UsersService> = {}

    beforeAll(() => {
        component = new RolesUsersComponent(
            usersSvc as UsersService,
            router as Router,
            profileUtilSvc as ProfileV2UtillService,
            route as ActivatedRoute,
            profile as ProfileV2Service,
            usersService as UsersService
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
