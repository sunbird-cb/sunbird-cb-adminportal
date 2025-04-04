
import { ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { RequestsService } from '../../services/onboarding-requests.service'
import { OnboardingRequestsComponent } from './onboarding-requests.component'

describe('OnboardingRequestsComponent', () => {
    let component: OnboardingRequestsComponent

    const route: Partial<Router> = {}
    const activatedRoute: Partial<ActivatedRoute> = {}
    const requestService: Partial<RequestsService> = {}
    const cdr: Partial<ChangeDetectorRef> = {}

    beforeAll(() => {
        component = new OnboardingRequestsComponent(
            route as Router,
            activatedRoute as ActivatedRoute,
            requestService as RequestsService,
            cdr as ChangeDetectorRef
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
