
import { ConfigurationsService } from '@sunbird-cb/utils'
import { DomSanitizer } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { HomeComponent } from './home.component'
import { of } from 'rxjs'

describe('HomeComponent', () => {
    let component: HomeComponent

    const configSvc: Partial<ConfigurationsService> = {}
    const domSanitizer: Partial<DomSanitizer> = {}
    const router: Partial<Router> = {
        events: of(),
    }

    beforeAll(() => {
        component = new HomeComponent(
            configSvc as ConfigurationsService,
            domSanitizer as DomSanitizer,
            router as Router
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
