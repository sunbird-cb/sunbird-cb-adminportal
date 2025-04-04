import { NotificationEventComponent } from './notification-event.component'

describe('NotificationEventComponent', () => {
    let component: NotificationEventComponent

    beforeAll(() => {
        component = new NotificationEventComponent(

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
