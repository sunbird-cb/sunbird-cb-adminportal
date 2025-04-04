import { FormBuilder } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { ConfigResolveService } from '../../../resolvers/config-resolver.service'
import { RequestServiceService } from '../request-service.service'
import { SingleAssignPopupComponent } from './single-assign-popup.component'

describe('SingleAssignPopupComponent', () => {
    let component: SingleAssignPopupComponent

    const fb: Partial<FormBuilder> = {
        group: jest.fn(),
    }
    const requestService: Partial<RequestServiceService> = {}
    const data: any = {}
    const configService: Partial<ConfigResolveService> = {}
    const dialogRef: Partial<MatDialogRef<SingleAssignPopupComponent>> = {}

    beforeAll(() => {
        component = new SingleAssignPopupComponent(
            fb as FormBuilder,
            requestService as RequestServiceService,
            data as undefined,
            configService as ConfigResolveService,
            dialogRef as MatDialogRef<SingleAssignPopupComponent>
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
