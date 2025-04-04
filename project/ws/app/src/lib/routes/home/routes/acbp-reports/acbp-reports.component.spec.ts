
import { MatDialog } from '@angular/material/dialog'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { MatSnackBar } from '@angular/material/snack-bar'
import { DatePipe } from '@angular/common'
import { AcbpReportsService } from './acbp-reports.service'
import { AcbpReportsComponent } from './acbp-reports.component'

describe('AcbpReportsComponent', () => {
    let component: AcbpReportsComponent

    const dialog: Partial<MatDialog> = {}
    const configSvc: Partial<ConfigurationsService> = {}
    const acbpReportsService: Partial<AcbpReportsService> = {}
    const datePipe: Partial<DatePipe> = {}
    const snackBar: Partial<MatSnackBar> = {}

    beforeAll(() => {
        component = new AcbpReportsComponent(
            dialog as MatDialog,
            configSvc as ConfigurationsService,
            acbpReportsService as AcbpReportsService,
            datePipe as DatePipe,
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
