import { FormBuilder } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { RequestServiceService } from '../request-service.service'
import { AssignListPopupComponent } from './assign-list-popup.component'

describe('AssignListPopupComponent', () => {
    let component: AssignListPopupComponent

    const fb: Partial<FormBuilder> = {
        group: jest.fn(),
    }
    const requestService: Partial<RequestServiceService> = {}
    const data: any = {}
    const dialogRef: Partial<MatDialogRef<AssignListPopupComponent>> = {}

    beforeAll(() => {
        component = new AssignListPopupComponent(
            fb as FormBuilder,
            requestService as RequestServiceService,
            data as undefined,
            dialogRef as MatDialogRef<AssignListPopupComponent>
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
