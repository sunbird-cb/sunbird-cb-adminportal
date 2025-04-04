
import { Router } from '@angular/router'
import { PositionsHomeComponent } from './positions-home.component'

describe('PositionsHomeComponent', () => {
    let component: PositionsHomeComponent

    const route: Partial<Router> = {}

    beforeAll(() => {
        component = new PositionsHomeComponent(
            route as Router
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
