import { AppButtonComponent } from './app-button.component'

describe('AppButtonComponent', () => {
    let component: AppButtonComponent

    beforeAll(() => {
        component = new AppButtonComponent(

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
