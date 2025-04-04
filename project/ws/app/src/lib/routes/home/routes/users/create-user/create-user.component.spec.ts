import { ActivatedRoute, Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { CreateUserService } from './create-user.service'
import { SystemRolesManagementService } from '../../../services/system-roles-management.service'
import { CreateUserComponent } from './create-user.component'

describe('CreateUserComponent', () => {
    let component: CreateUserComponent

    const snackBar: Partial<MatSnackBar> = {}
    const configSvc: Partial<ConfigurationsService> = {}
    const createUserSvc: Partial<CreateUserService> = {}
    const roleManagementSvc: Partial<SystemRolesManagementService> = {}
    const activatedRoute: Partial<ActivatedRoute> = {}
    const router: Partial<Router> = {}
    const route: Partial<ActivatedRoute> = {}

    beforeAll(() => {
        component = new CreateUserComponent(
            snackBar as MatSnackBar,
            configSvc as ConfigurationsService,
            createUserSvc as CreateUserService,
            roleManagementSvc as SystemRolesManagementService,
            activatedRoute as ActivatedRoute,
            router as Router,
            route as ActivatedRoute
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
