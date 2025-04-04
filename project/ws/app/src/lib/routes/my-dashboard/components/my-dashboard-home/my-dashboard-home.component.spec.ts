import { Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { MyDashboardHomeComponent } from './my-dashboard-home.component'

describe('MyDashboardHomeComponent', () => {
    let component: MyDashboardHomeComponent

    const router: Partial<Router> = {}
    const configSvc: Partial<ConfigurationsService> = {}

    beforeAll(() => {
        component = new MyDashboardHomeComponent(
            router as Router,
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
