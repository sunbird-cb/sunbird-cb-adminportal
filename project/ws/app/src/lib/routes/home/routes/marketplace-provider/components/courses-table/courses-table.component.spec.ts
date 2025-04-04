import { CoursesTableComponent } from './courses-table.component'

describe('CoursesTableComponent', () => {
    let component: CoursesTableComponent

    beforeAll(() => {
        component = new CoursesTableComponent(

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
