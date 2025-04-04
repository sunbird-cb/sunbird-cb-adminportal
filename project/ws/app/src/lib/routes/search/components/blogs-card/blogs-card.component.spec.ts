import { BlogsCardComponent } from './blogs-card.component'

describe('BlogsCardComponent', () => {
    let component: BlogsCardComponent

    beforeAll(() => {
        component = new BlogsCardComponent(

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
