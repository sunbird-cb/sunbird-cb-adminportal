
import { MatDialogRef } from '@angular/material/dialog'
import { SuccessComponent } from './success.component'

describe('SuccessComponent', () => {
    let component: SuccessComponent

    const dialogRef: Partial<MatDialogRef<SuccessComponent>> = {}

    beforeAll(() => {
        component = new SuccessComponent(
            dialogRef as MatDialogRef<SuccessComponent>
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
