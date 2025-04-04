(window as any)['env'] = {
    name: 'test-environment',
    sitePath: '/test-site-path',
    karmYogiPath: '/test-karm-yogi-path',
    cbpPath: '/test-cbp-path',
}

import { MatDialog } from '@angular/material/dialog'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { MatSnackBar } from '@angular/material/snack-bar'
import { CommsService } from './comms.service'
import { DatePipe } from '@angular/common'
import { CommsComponent } from './comms.component'

describe('CommsComponent', () => {
    let component: CommsComponent

    const dialog: Partial<MatDialog> = {}
    const configSvc: Partial<ConfigurationsService> = {}
    const commsService: Partial<CommsService> = {}
    const datePipe: Partial<DatePipe> = {}
    const snackBar: Partial<MatSnackBar> = {}

    beforeAll(() => {
        component = new CommsComponent(
            dialog as MatDialog,
            configSvc as ConfigurationsService,
            commsService as CommsService,
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
