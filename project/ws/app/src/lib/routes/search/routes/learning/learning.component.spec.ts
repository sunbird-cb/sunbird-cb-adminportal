import '@angular/compiler'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService, ValueService, UtilityService } from '@sunbird-cb/utils'
import { SearchServService } from '../../services/search-serv.service'
import { LearningComponent } from './learning.component'

describe('LearningComponent', () => {
    let component: LearningComponent

    const activated: Partial<ActivatedRoute> = {}
    const router: Partial<Router> = {}
    const valueSvc: Partial<ValueService> = {}
    const searchServ: Partial<SearchServService> = {
        getLanguageSearchIndex: jest.fn(),
    }
    const configSvc: Partial<ConfigurationsService> = {}
    const utilitySvc: Partial<UtilityService> = {}

    beforeAll(() => {
        component = new LearningComponent(
            activated as ActivatedRoute,
            router as Router,
            valueSvc as ValueService,
            searchServ as SearchServService,
            configSvc as ConfigurationsService,
            utilitySvc as UtilityService
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
