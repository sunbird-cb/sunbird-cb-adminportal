
import { MatDialogRef } from '@angular/material/dialog'
import { ViewUsersComponent } from './view-users.component'

describe('ViewUsersComponent', () => {
    let component: ViewUsersComponent

    const dialogRef: Partial<MatDialogRef<ViewUsersComponent>> = {}
    const data: any = {}

    beforeAll(() => {
        component = new ViewUsersComponent(
            dialogRef as MatDialogRef<ViewUsersComponent>,
            data as any
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
