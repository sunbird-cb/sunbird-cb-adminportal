
import { MatDialogRef } from '@angular/material/dialog'
import { EventsService } from '../services/events.service'
import { HttpClient } from '@angular/common/http'
import { ProfileV2UtillService } from '../services/home-utill.service'
import { ParticipantsComponent } from './participants.component'

describe('ParticipantsComponent', () => {
    let component: ParticipantsComponent

    const eventSrc: Partial<EventsService> = {}
    const http: Partial<HttpClient> = {}
    const profileUtilSvc: Partial<ProfileV2UtillService> = {}
    const dialogRef: Partial<MatDialogRef<ParticipantsComponent>> = {}
    const data: any = {}

    beforeAll(() => {
        component = new ParticipantsComponent(
            eventSrc as EventsService,
            http as HttpClient,
            profileUtilSvc as ProfileV2UtillService,
            dialogRef as MatDialogRef<ParticipantsComponent>,
            data as undefined
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
