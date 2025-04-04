import { TncRendererComponent } from './tnc-renderer.component'

describe('TncRendererComponent', () => {
    let component: TncRendererComponent

    beforeAll(() => {
        component = new TncRendererComponent(

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
