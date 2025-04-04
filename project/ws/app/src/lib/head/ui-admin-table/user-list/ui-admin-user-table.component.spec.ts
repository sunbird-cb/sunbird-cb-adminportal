(window as any)['env'] = {
    name: 'test-environment',
    sitePath: '/test-site-path',
    karmYogiPath: '/test-karm-yogi-path',
    cbpPath: '/test-cbp-path',
}

import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router, ActivatedRoute } from '@angular/router'
import { CreateMDOService as MDO2 } from '../../../routes/home/services/create-mdo.services'
import { EventService } from '@sunbird-cb/utils'
import { UIAdminUserTableComponent } from './ui-admin-user-table.component'
import { of } from 'rxjs'

describe('UIAdminUserTableComponent', () => {
    let component: UIAdminUserTableComponent

    const router: Partial<Router> = {}
    const dialog: Partial<MatDialog> = {}
    const activatedRoute: Partial<ActivatedRoute> = {
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
    }
    const createMDOService2: Partial<MDO2> = {}
    const events: Partial<EventService> = {}
    const snackBar: Partial<MatSnackBar> = {}

    beforeAll(() => {
        component = new UIAdminUserTableComponent(
            router as Router,
            dialog as MatDialog,
            activatedRoute as ActivatedRoute,
            createMDOService2 as MDO2,
            events as EventService,
            snackBar as MatSnackBar
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
