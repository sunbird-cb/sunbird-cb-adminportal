
import { DirectoryService } from '../../services/directory.services'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute, Router } from '@angular/router'
import { CreateMDOService } from '../../services/create-mdo.services'
import { EventService, ValueService } from '@sunbird-cb/utils'
import { CreateMdoComponent } from './create-mdo.component'
import { of } from 'rxjs'

describe('CreateMdoComponent', () => {
    let component: CreateMdoComponent

    const dialog: Partial<MatDialog> = {}
    const snackBar: Partial<MatSnackBar> = {}
    const createMdoService: Partial<CreateMDOService> = {}
    const router: Partial<Router> = {}
    const directoryService: Partial<DirectoryService> = {}
    const valueSvc: Partial<ValueService> = {
        isLtMedium$: of(true),
    }
    const activatedRoute: Partial<ActivatedRoute> = {
        snapshot: {
            parent: {
                data: {
                    configSvc: {
                        userProfile: {
                            userId: 'sampleId',
                        },
                        unMappedUser: {
                            roles: ['PUBLIC', 'STATE_ADMIN'],
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

    const events: Partial<EventService> = {}

    beforeAll(() => {
        component = new CreateMdoComponent(
            dialog as MatDialog,
            snackBar as MatSnackBar,
            createMdoService as CreateMDOService,
            router as Router,
            directoryService as DirectoryService,
            valueSvc as ValueService,
            activatedRoute as ActivatedRoute,
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
