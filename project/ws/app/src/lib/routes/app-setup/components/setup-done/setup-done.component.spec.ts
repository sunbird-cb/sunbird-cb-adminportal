import '@angular/compiler'
import { DomSanitizer } from '@angular/platform-browser'
import { MatDialog } from '@angular/material/dialog'
import { Router, ActivatedRoute } from '@angular/router'
import { Globals } from '../../globals'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { SetupDoneComponent } from './setup-done.component'

describe('SetupDoneComponent', () => {
    let component: SetupDoneComponent

    const configSvc: Partial<ConfigurationsService> = {}
    const route: Partial<ActivatedRoute> = {}
    const domSanitizer: Partial<DomSanitizer> = {}
    const matDialog: Partial<MatDialog> = {}
    const router: Partial<Router> = {}
    const globals: Partial<Globals> = {}

    beforeAll(() => {
        component = new SetupDoneComponent(
            configSvc as ConfigurationsService,
            route as ActivatedRoute,
            domSanitizer as DomSanitizer,
            matDialog as MatDialog,
            router as Router,
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
