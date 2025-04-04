import { ActivatedRoute, Router } from '@angular/router'
import { EventService } from '../../services/event.service'
import { MatDialog } from '@angular/material/dialog'
import { ValueService } from '@sunbird-cb/utils'
import { ProfileDetailComponent } from './profile-detail.component'

describe('ProfileDetailComponent', () => {
    let component: ProfileDetailComponent

    const activatedRoute: Partial<ActivatedRoute> = {}
    const appEventSvc: Partial<EventService> = {}
    const dialog: Partial<MatDialog> = {}
    const valSvc: Partial<ValueService> = {}
    const router: Partial<Router> = {
        getCurrentNavigation: jest.fn(),
    }

    beforeAll(() => {
        component = new ProfileDetailComponent(
            activatedRoute as ActivatedRoute,
            appEventSvc as EventService,
            dialog as MatDialog,
            valSvc as ValueService,
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
