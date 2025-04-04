import { MatDialog } from '@angular/material/dialog'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { SectorsService } from './sectors.service'
import { SectorsComponent } from './sectors.component'

describe('SectorsComponent', () => {
    let component: SectorsComponent

    const dialog: Partial<MatDialog> = {}
    const configSvc: Partial<ConfigurationsService> = {}
    const sectorsService: Partial<SectorsService> = {}

    beforeAll(() => {
        component = new SectorsComponent(
            dialog as MatDialog,
            configSvc as ConfigurationsService,
            sectorsService as SectorsService
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
