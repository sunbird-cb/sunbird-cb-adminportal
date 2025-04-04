
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute } from '@angular/router'
import { SystemRolesManagementService } from '../../services/system-roles-management.service'
import { TenantAdminService } from '../../services/tenant-admin.service'
import { UsersComponent } from './users.component'

describe('UsersComponent', () => {
    let component: UsersComponent

    const snackBar: Partial<MatSnackBar> = {}
    const dialog: Partial<MatDialog> = {}
    const activatedRoute: Partial<ActivatedRoute> = {}
    const rolesSvc: Partial<SystemRolesManagementService> = {}
    const tenantAdminSvc: Partial<TenantAdminService> = {}

    beforeAll(() => {
        component = new UsersComponent(
            snackBar as MatSnackBar,
            dialog as MatDialog,
            activatedRoute as ActivatedRoute,
            rolesSvc as SystemRolesManagementService,
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
