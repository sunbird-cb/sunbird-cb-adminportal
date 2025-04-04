import { MatDialogRef } from '@angular/material/dialog'
import { RejectReasonDialogComponent } from './reject-reason-dialog.component'

describe('RejectReasonDialogComponent', () => {
    let component: RejectReasonDialogComponent

    const dialogRef: Partial<MatDialogRef<RejectReasonDialogComponent>> = {}

    beforeAll(() => {
        component = new RejectReasonDialogComponent(
            dialogRef as MatDialogRef<RejectReasonDialogComponent>
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
