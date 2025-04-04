import { ActivatedRoute } from '@angular/router'
import { ValueService } from '@sunbird-cb/utils'
import { HomeComponent } from './home.component'
import { of } from 'rxjs'

describe('HomeComponent', () => {
    let component: HomeComponent

    const valueSvc: Partial<ValueService> = {
        isLtMedium$: of(true),
    }
    const route: Partial<ActivatedRoute> = {}

    beforeAll(() => {
        component = new HomeComponent(
            valueSvc as ValueService,
            route as ActivatedRoute
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
