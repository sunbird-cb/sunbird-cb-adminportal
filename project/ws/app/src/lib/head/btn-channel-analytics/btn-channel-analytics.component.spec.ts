import '@angular/compiler'
import { BtnChannelAnalyticsComponent } from './btn-channel-analytics.component'

describe('BtnChannelAnalyticsComponent', () => {
    let component: BtnChannelAnalyticsComponent

    beforeAll(() => {
        component = new BtnChannelAnalyticsComponent(

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
