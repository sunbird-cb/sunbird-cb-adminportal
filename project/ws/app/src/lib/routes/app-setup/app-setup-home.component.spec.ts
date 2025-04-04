
import { MatDialog } from '@angular/material/dialog'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { AppSetupHomeComponent } from './app-setup-home.component'

describe('AppSetupHomeComponent', () => {
    let component: AppSetupHomeComponent

    const configSvc: Partial<ConfigurationsService> = {}
    const matDialog: Partial<MatDialog> = {}

    beforeAll(() => {
        component = new AppSetupHomeComponent(
            configSvc as ConfigurationsService,
            matDialog as MatDialog
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
