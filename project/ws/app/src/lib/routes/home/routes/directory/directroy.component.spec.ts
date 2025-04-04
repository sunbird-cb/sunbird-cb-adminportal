(window as any)['env'] = {
    name: 'test-environment',
    sitePath: '/test-site-path',
    karmYogiPath: '/test-karm-yogi-path',
    cbpPath: '/test-cbp-path',
}

import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils'
import { DirectoryService } from '../../services/directory.services'
import { DirectoryViewComponent } from './directroy.component'
import { of } from 'rxjs'

describe('DirectoryViewComponent', () => {
    let component: DirectoryViewComponent

    const dialog: Partial<MatDialog> = {}
    const route: Partial<ActivatedRoute> = {
        snapshot: {
            parent: {
                data: {
                    configService: {
                        unMappedUser: {
                            roles: ['PUBLIC, STATE_ADMIN'],
                        },
                    },
                },
            },
            params: of({ tab: 'verified' }),
            queryParams: of({ roleId: 'testRoleId' }),
        } as any,
        params: of({ tab: 'verified' }),
        queryParams: of({ roleId: 'testRoleId' }),
        data: of({}),
    }
    const configSvc: Partial<ConfigurationsService> = {}
    const directoryService: Partial<DirectoryService> = {}
    const router: Partial<Router> = {}
    const events: Partial<EventService> = {}

    beforeAll(() => {
        component = new DirectoryViewComponent(
            dialog as MatDialog,
            route as ActivatedRoute,
            configSvc as ConfigurationsService,
            directoryService as DirectoryService,
            router as Router,
            events as EventService
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
