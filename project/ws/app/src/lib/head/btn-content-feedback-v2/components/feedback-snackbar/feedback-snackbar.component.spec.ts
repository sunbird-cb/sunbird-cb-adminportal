
import { IFeedbackSnackbarData } from '../../models/feedback.model'
import { FeedbackSnackbarComponent } from './feedback-snackbar.component'

describe('FeedbackSnackbarComponent', () => {
    let component: FeedbackSnackbarComponent

    const snackbarData: Partial<IFeedbackSnackbarData> = {}

    beforeAll(() => {
        component = new FeedbackSnackbarComponent(
            snackbarData as IFeedbackSnackbarData
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
