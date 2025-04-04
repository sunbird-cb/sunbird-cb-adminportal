import { MatDialogRef } from '@angular/material/dialog'
import { ConfirmationPopupComponent } from './confirmation-popup.component'

describe('ConfirmationPopupComponent', () => {
    let component: ConfirmationPopupComponent

    const data: any = {}
    const dialogRef: Partial<MatDialogRef<ConfirmationPopupComponent>> = {}

    beforeAll(() => {
        component = new ConfirmationPopupComponent(
            data as undefined,
            dialogRef as MatDialogRef<ConfirmationPopupComponent>
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
