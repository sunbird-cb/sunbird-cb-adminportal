
import { MatDialogRef } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { FeedbackService } from '../../services/feedback.service'
import { BtnContentFeedbackDialogV2Component } from './btn-content-feedback-dialog-v2.component'

describe('BtnContentFeedbackDialogV2Component', () => {
    let component: BtnContentFeedbackDialogV2Component

    const content: any = {}
    const dialogRef: Partial<MatDialogRef<BtnContentFeedbackDialogV2Component>> = {}
    const feedbackApi: Partial<FeedbackService> = {}
    const snackbar: Partial<MatSnackBar> = {}

    beforeAll(() => {
        component = new BtnContentFeedbackDialogV2Component(
            content as any,
            dialogRef as MatDialogRef<BtnContentFeedbackDialogV2Component>,
            feedbackApi as FeedbackService,
            snackbar as MatSnackBar
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
