(window as any)['env'] = {
    name: 'test-environment',
    sitePath: '/test-site-path',
    karmYogiPath: '/test-karm-yogi-path',
    cbpPath: '/test-cbp-path',
}

import { CreateMDOService } from './../../services/create-mdo.services'
import { UsersService } from '../../services/users.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute, Router } from '@angular/router'
import { DirectoryService } from '../../services/directory.services'
import { EventService } from '@sunbird-cb/utils'
import { ProfileV2UtillService } from '../../services/home-utill.service'
import { CreateUserComponent } from './create-user.component'
import { of } from 'rxjs'

describe('CreateUserComponent', () => {
    let component: CreateUserComponent

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
    }
    const router: Partial<Router> = {
        getCurrentNavigation: jest.fn(),
    }
    const snackBar: Partial<MatSnackBar> = {}
    const directoryService: Partial<DirectoryService> = {}
    const createMDOService: Partial<CreateMDOService> = {}
    const profileUtilSvc: Partial<ProfileV2UtillService> = {}
    const usersSvc: Partial<UsersService> = {}
    const events: Partial<EventService> = {}

    beforeAll(() => {
        component = new CreateUserComponent(
            route as ActivatedRoute,
            router as Router,
            snackBar as MatSnackBar,
            directoryService as DirectoryService,
            createMDOService as CreateMDOService,
            profileUtilSvc as ProfileV2UtillService,
            usersSvc as UsersService,
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
