import { Router } from '@angular/router'
import { PeopleComponent } from './people.component'

describe('PeopleComponent', () => {
    let component: PeopleComponent

    const router: Partial<Router> = {}

    beforeAll(() => {
        component = new PeopleComponent(
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
