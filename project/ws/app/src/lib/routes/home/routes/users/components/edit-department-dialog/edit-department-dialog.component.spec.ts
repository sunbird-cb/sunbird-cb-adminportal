import { MatDialogRef } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { TenantAdminService } from '../../../../services/tenant-admin.service'
import { EditDepartmentDialogComponent } from './edit-department-dialog.component'

describe('EditDepartmentDialogComponent', () => {
    let component: EditDepartmentDialogComponent

    const dialogRef: Partial<MatDialogRef<EditDepartmentDialogComponent>> = {}
    const data: any = {}
    const tenantAdminSvc: Partial<TenantAdminService> = {}
    const snackBar: Partial<MatSnackBar> = {}

    beforeAll(() => {
        component = new EditDepartmentDialogComponent(
            dialogRef as MatDialogRef<EditDepartmentDialogComponent>,
            data as undefined,
            tenantAdminSvc as TenantAdminService,
            snackBar as MatSnackBar
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
