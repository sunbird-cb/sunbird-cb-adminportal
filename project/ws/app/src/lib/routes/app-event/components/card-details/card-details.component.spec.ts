
import { ChangeDetectorRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { CardDetailsComponent } from './card-details.component'

describe('CardDetailsComponent', () => {
    let component: CardDetailsComponent

    const changeDetector: Partial<ChangeDetectorRef> = {}
    const route: Partial<ActivatedRoute> = {}
    const router: Partial<Router> = {}

    beforeAll(() => {
        component = new CardDetailsComponent(
            changeDetector as ChangeDetectorRef,
            route as ActivatedRoute,
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
