import { ActivatedRoute } from '@angular/router'
import { ValueService, ConfigurationsService } from '@sunbird-cb/utils'
import { FaqHomeComponent } from './faq-home.component'
import { of } from 'rxjs'

describe('FaqHomeComponent', () => {
    let component: FaqHomeComponent

    const route: Partial<ActivatedRoute> = {}
    const valueSvc: Partial<ValueService> = {
        isLtMedium$: of(true),
    }
    const configSvc: Partial<ConfigurationsService> = {}

    beforeAll(() => {
        component = new FaqHomeComponent(
            route as ActivatedRoute,
            valueSvc as ValueService,
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
