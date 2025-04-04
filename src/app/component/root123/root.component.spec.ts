import { ChangeDetectorRef } from '@angular/core'
import { Router } from '@angular/router'
import { BtnPageBackService } from '@sunbird-cb/collection'
import { ConfigurationsService, ValueService } from '@sunbird-cb/utils'
import { MobileAppsService } from '../../services/mobile-apps.service'
import { RootService } from './root.service'
import { RootComponent } from './root.component'

describe('RootComponent', () => {
    let component: RootComponent

    const router: Partial<Router> = {}
    const configSvc: Partial<ConfigurationsService> = {}
    const valueSvc: Partial<ValueService> = {}
    const mobileAppsSvc: Partial<MobileAppsService> = {
        init: jest.fn(),
    }
    const rootSvc: Partial<RootService> = {}
    const btnBackSvc: Partial<BtnPageBackService> = {}
    const changeDetector: Partial<ChangeDetectorRef> = {}

    beforeAll(() => {
        component = new RootComponent(
            router as Router,
            configSvc as ConfigurationsService,
            valueSvc as ValueService,
            mobileAppsSvc as MobileAppsService,
            rootSvc as RootService,
            btnBackSvc as BtnPageBackService,
            changeDetector as ChangeDetectorRef
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
