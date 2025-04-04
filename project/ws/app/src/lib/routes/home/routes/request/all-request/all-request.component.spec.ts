import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { DomSanitizer } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { RequestServiceService } from '../request-service.service'
import { AllRequestComponent } from './all-request.component'

describe('AllRequestComponent', () => {
    let component: AllRequestComponent

    const sanitizer: Partial<DomSanitizer> = {}
    const router: Partial<Router> = {}
    const requestService: Partial<RequestServiceService> = {}
    const snackBar: Partial<MatSnackBar> = {}
    const dialog: Partial<MatDialog> = {}

    beforeAll(() => {
        component = new AllRequestComponent(
            sanitizer as DomSanitizer,
            router as Router,
            requestService as RequestServiceService,
            snackBar as MatSnackBar,
            dialog as MatDialog
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
