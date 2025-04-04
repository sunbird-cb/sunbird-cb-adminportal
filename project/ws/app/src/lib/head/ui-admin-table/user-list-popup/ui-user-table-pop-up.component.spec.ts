import { ProfileV2UtillService } from '../../../routes/home/services/home-utill.service'
import { UsersService } from '../../../routes/home/services/users.service'
import { ActivatedRoute } from '@angular/router'
import { CreateMDOService } from '../../../routes/home/services/create-mdo.services'
import { UIUserTablePopUpComponent } from './ui-user-table-pop-up.component'

describe('UIUserTablePopUpComponent', () => {
    let component: UIUserTablePopUpComponent

    const profileUtilSvc: Partial<ProfileV2UtillService> = {}
    const userService: Partial<UsersService> = {}
    const activatedRoute: Partial<ActivatedRoute> = {}
    const createMDOService2: Partial<CreateMDOService> = {}

    beforeAll(() => {
        component = new UIUserTablePopUpComponent(
            profileUtilSvc as ProfileV2UtillService,
            userService as UsersService,
            activatedRoute as ActivatedRoute,
            createMDOService2 as CreateMDOService
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
