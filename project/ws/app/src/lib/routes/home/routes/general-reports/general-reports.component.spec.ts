
import { MatDialog } from '@angular/material/dialog'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { MatSnackBar } from '@angular/material/snack-bar'
import { DatePipe } from '@angular/common'
import { GeneralReportsService } from './general-reports.service'
import { GeneralReportsComponent } from './general-reports.component'

describe('GeneralReportsComponent', () => {
    let component: GeneralReportsComponent

    const dialog: Partial<MatDialog> = {}
    const configSvc: Partial<ConfigurationsService> = {}
    const generalReportsService: Partial<GeneralReportsService> = {}
    const datePipe: Partial<DatePipe> = {}
    const snackBar: Partial<MatSnackBar> = {}

    beforeAll(() => {
        component = new GeneralReportsComponent(
            dialog as MatDialog,
            configSvc as ConfigurationsService,
            generalReportsService as GeneralReportsService,
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