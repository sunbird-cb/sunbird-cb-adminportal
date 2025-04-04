import '@angular/compiler'
import { MatDialog } from '@angular/material/dialog'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { BtnContentFeedbackV2Component } from './btn-content-feedback-v2.component'

describe('BtnContentFeedbackV2Component', () => {
    let component: BtnContentFeedbackV2Component

    const dialog: Partial<MatDialog> = {}
    const configSvc: Partial<ConfigurationsService> = {}

    beforeAll(() => {
        component = new BtnContentFeedbackV2Component(
            dialog as MatDialog,
            configSvc as ConfigurationsService
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
