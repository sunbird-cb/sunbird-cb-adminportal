
import { Router } from '@angular/router'
import { MarketplaceService } from '../../services/marketplace.service'
import { DatePipe } from '@angular/common'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MarketPlaceDashboardComponent } from './market-place-dashboard.component'

describe('MarketPlaceDashboardComponent', () => {
    let component: MarketPlaceDashboardComponent

    const dialog: Partial<MatDialog> = {}
    const router: Partial<Router> = {}
    const marketPlaceSvc: Partial<MarketplaceService> = {}
    const snackBar: Partial<MatSnackBar> = {}
    const datePipe: Partial<DatePipe> = {}

    beforeAll(() => {
        component = new MarketPlaceDashboardComponent(
            dialog as MatDialog,
            router as Router,
            marketPlaceSvc as MarketplaceService,
            snackBar as MatSnackBar,
            datePipe as DatePipe
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
