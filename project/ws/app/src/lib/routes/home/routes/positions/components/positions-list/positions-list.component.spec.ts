
import { ActivatedRoute } from '@angular/router'
import { PositionsService } from '../../services/position.service'
import { PositionsListComponent } from './positions-list.component'

describe('PositionsListComponent', () => {
    let component: PositionsListComponent

    const aRoute: Partial<ActivatedRoute> = {}
    const positionsSvc: Partial<PositionsService> = {}

    beforeAll(() => {
        component = new PositionsListComponent(
            aRoute as ActivatedRoute,
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
