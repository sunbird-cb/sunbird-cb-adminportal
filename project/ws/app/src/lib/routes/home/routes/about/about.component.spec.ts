
import { AboutComponent } from './about.component'

describe('AboutComponent', () => {
    let component: AboutComponent

    beforeAll(() => {
        component = new AboutComponent(

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
