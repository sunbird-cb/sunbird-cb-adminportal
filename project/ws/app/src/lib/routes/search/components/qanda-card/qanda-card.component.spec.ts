import { QandaCardComponent } from './qanda-card.component'

describe('QandaCardComponent', () => {
    let component: QandaCardComponent

    beforeAll(() => {
        component = new QandaCardComponent(

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
