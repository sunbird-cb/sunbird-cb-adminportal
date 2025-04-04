import '@angular/compiler'
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { TncAppResolverService } from '../../../../../../../../../src/app/services/tnc-app-resolver.service'
import { TncPublicResolverService } from '../../../../../../../../../src/app/services/tnc-public-resolver.service'
import { Globals } from '../../globals'
import { ConfigurationsService, LoggerService } from '@sunbird-cb/utils'
import { TncComponent } from './tnc.component'

describe('TncComponent', () => {
    let component: TncComponent

    const activatedRoute: Partial<ActivatedRoute> = {}
    const router: Partial<Router> = {}
    const http: Partial<HttpClient> = {}
    const loggerSvc: Partial<LoggerService> = {}
    const configSvc: Partial<ConfigurationsService> = {}
    const tncProtectedSvc: Partial<TncAppResolverService> = {}
    const tncPublicSvc: Partial<TncPublicResolverService> = {}
    const globals: Partial<Globals> = {}

    beforeAll(() => {
        component = new TncComponent(
            activatedRoute as ActivatedRoute,
            router as Router,
            http as HttpClient,
            loggerSvc as LoggerService,
            configSvc as ConfigurationsService,
            tncProtectedSvc as TncAppResolverService,
            tncPublicSvc as TncPublicResolverService,
            globals as Globals
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
