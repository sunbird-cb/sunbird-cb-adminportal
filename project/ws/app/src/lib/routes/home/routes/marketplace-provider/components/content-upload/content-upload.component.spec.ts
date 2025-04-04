
import { Router } from '@angular/router'
import { MarketplaceService } from '../../services/marketplace.service'
import { DatePipe } from '@angular/common'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ContentUploadComponent } from './content-upload.component'

describe('ContentUploadComponent', () => {
    let component: ContentUploadComponent

    const router: Partial<Router> = {}
    const marketPlaceSvc: Partial<MarketplaceService> = {}
    const datePipe: Partial<DatePipe> = {}
    const snackBar: Partial<MatSnackBar> = {}
    const dialog: Partial<MatDialog> = {}

    beforeAll(() => {
        component = new ContentUploadComponent(
            router as Router,
            marketPlaceSvc as MarketplaceService,
            datePipe as DatePipe,
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
