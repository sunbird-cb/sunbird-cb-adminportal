import { Router } from '@angular/router'
import { ConfigurationsService, UserPreferenceService } from '@sunbird-cb/utils'
import { LangSelectComponent } from './lang-select.component'

describe('LangSelectComponent', () => {
    let component: LangSelectComponent

    const configSvc: Partial<ConfigurationsService> = {}
    const router: Partial<Router> = {}
    const userPrefSvc: Partial<UserPreferenceService> = {}

    beforeAll(() => {
        component = new LangSelectComponent(
            configSvc as ConfigurationsService,
            router as Router,
            userPrefSvc as UserPreferenceService
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
