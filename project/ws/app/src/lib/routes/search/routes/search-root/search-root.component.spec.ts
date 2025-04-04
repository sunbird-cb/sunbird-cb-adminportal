import { Router, ActivatedRoute } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { SearchRootComponent } from './search-root.component'

describe('SearchRootComponent', () => {
    let component: SearchRootComponent

    const router: Partial<Router> = {}
    const activated: Partial<ActivatedRoute> = {}
    const configSvc: Partial<ConfigurationsService> = {}

    beforeAll(() => {
        component = new SearchRootComponent(
            router as Router,
            activated as ActivatedRoute,
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
