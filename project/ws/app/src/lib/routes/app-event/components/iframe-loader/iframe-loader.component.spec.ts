
import { DomSanitizer } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { EventService } from '../../services/event.service'
import { IframeLoaderComponent } from './iframe-loader.component'

describe('IframeLoaderComponent', () => {
    let component: IframeLoaderComponent

    const domSanitizer: Partial<DomSanitizer> = {}
    const activatedRoute: Partial<ActivatedRoute> = {}
    const appEventSvc: Partial<EventService> = {}

    beforeAll(() => {
        component = new IframeLoaderComponent(
            domSanitizer as DomSanitizer,
            activatedRoute as ActivatedRoute,
            appEventSvc as EventService
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
