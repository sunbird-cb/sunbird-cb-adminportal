import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { SearchServService } from '../../services/search-serv.service'
import { FilterDisplayComponent } from './filter-display.component'

describe('FilterDisplayComponent', () => {
    let component: FilterDisplayComponent

    const activated: Partial<ActivatedRoute> = {}
    const router: Partial<Router> = {}
    const searchServ: Partial<SearchServService> = {}
    const configSvc: Partial<ConfigurationsService> = {}

    beforeAll(() => {
        component = new FilterDisplayComponent(
            activated as ActivatedRoute,
            router as Router,
            searchServ as SearchServService,
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
