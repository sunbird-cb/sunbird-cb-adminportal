
import { ConfigurationsService } from '@sunbird-cb/utils'
import { NotificationApiService } from '../../services/notification-api.service'
import { NotificationService } from '../../services/notification.service'
import { Router } from '@angular/router'
import { HomeComponent } from './home.component'

describe('HomeComponent', () => {
    let component: HomeComponent

    const configSvc: Partial<ConfigurationsService> = {}
    const notificationApi: Partial<NotificationApiService> = {}
    const notificationSvc: Partial<NotificationService> = {}
    const router: Partial<Router> = {}

    beforeAll(() => {
        component = new HomeComponent(
            configSvc as ConfigurationsService,
            notificationApi as NotificationApiService,
            notificationSvc as NotificationService,
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
