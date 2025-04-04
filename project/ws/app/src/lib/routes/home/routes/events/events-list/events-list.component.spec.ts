
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils'
import { EventsService } from '../services/events.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { EventsListComponent } from './events-list.component'
import { of } from 'rxjs'

describe('EventsListComponent', () => {
    let component: EventsListComponent

    const dialog: Partial<MatDialog> = {}
    const activeRoute: Partial<ActivatedRoute> = {
        snapshot: {
            params: { tab: 'verified' },
            queryParams: of({ roleId: 'testRoleId' }),
            data: {
                configService: {
                    userProfile: {
                        userId: 'sampleId',
                        rootOrgId: 'rootId',
                        departmentName: 'department',
                    },
                },
            },
        } as any,
        queryParams: of({ roleId: 'testRoleId' }),
    }
    const configSvc: Partial<ConfigurationsService> = {}
    const router: Partial<Router> = {}
    const events: Partial<EventService> = {}
    const eventSvc: Partial<EventsService> = {}
    const dialogue: Partial<MatDialog> = {}
    const snackBar: Partial<MatSnackBar> = {}

    beforeAll(() => {
        component = new EventsListComponent(
            dialog as MatDialog,
            activeRoute as ActivatedRoute,
            configSvc as ConfigurationsService,
            router as Router,
            events as EventService,
            eventSvc as EventsService,
            dialogue as MatDialog,
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
