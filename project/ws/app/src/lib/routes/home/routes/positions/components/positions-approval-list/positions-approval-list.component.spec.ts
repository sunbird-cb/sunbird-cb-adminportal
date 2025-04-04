
import { ActivatedRoute, Router } from '@angular/router'
import { PositionsService } from '../../services/position.service'
import { PositionsApprovalListComponent } from './positions-approval-list.component'

describe('PositionsApprovalListComponent', () => {
    let component: PositionsApprovalListComponent

    const aRoute: Partial<ActivatedRoute> = {}
    const route: Partial<Router> = {}
    const positionsSvc: Partial<PositionsService> = {}

    beforeAll(() => {
        component = new PositionsApprovalListComponent(
            aRoute as ActivatedRoute,
            route as Router,
            positionsSvc as PositionsService
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
