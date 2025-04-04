
import { ChangeDetectorRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { EventBannerComponent } from './event-banner.component'

describe('EventBannerComponent', () => {
    let component: EventBannerComponent

    const router: Partial<Router> = {}
    const route: Partial<ActivatedRoute> = {}
    const changeDetector: Partial<ChangeDetectorRef> = {}

    beforeAll(() => {
        component = new EventBannerComponent(
            router as Router,
            route as ActivatedRoute,
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
