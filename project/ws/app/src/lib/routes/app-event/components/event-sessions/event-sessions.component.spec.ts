
import { ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { EventService } from '../../services/event.service'
import { EventSessionsComponent } from './event-sessions.component'

describe('EventSessionsComponent', () => {
    let component: EventSessionsComponent

    const activatedRoute: Partial<ActivatedRoute> = {}
    const appEventSvc: Partial<EventService> = {}
    const changeDetector: Partial<ChangeDetectorRef> = {}

    beforeAll(() => {
        component = new EventSessionsComponent(
            activatedRoute as ActivatedRoute,
            appEventSvc as EventService,
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
