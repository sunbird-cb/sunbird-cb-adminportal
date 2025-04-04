import { MatDialogRef } from '@angular/material/dialog'
import { SystemRolesManagementService } from '../../../../services/system-roles-management.service'
import { OpenRolesDialogComponent } from './open-roles-dialog.component'

describe('OpenRolesDialogComponent', () => {
    let component: OpenRolesDialogComponent

    const dialogRef: Partial<MatDialogRef<OpenRolesDialogComponent>> = {}
    const data: any = {
        rolesData: {
            superAdmin: {},
            orgAdmin: {},
            deptAdmin: {},
        },

    }
    const rolesSvc: Partial<SystemRolesManagementService> = {}

    beforeAll(() => {
        component = new OpenRolesDialogComponent(
            dialogRef as MatDialogRef<OpenRolesDialogComponent>,
            data as undefined,
            rolesSvc as SystemRolesManagementService
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
