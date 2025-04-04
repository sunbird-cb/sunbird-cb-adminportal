import { MatSnackBar } from '@angular/material/snack-bar'
import { TenantAdminService } from '../../../services/tenant-admin.service'
import { CreateUserV2Component } from './create-userV2.component'

describe('CreateUserV2Component', () => {
    let component: CreateUserV2Component

    const snackBar: Partial<MatSnackBar> = {}
    const tenantAdminSvc: Partial<TenantAdminService> = {}

    beforeAll(() => {
        component = new CreateUserV2Component(
            snackBar as MatSnackBar,
            tenantAdminSvc as TenantAdminService
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
