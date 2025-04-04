import { InitResolver } from "./init-resolve.service"


describe('InitResolver', () => {
    let component: InitResolver



    beforeAll(() => {
        component = new InitResolver(

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