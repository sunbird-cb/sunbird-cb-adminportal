
import { MatDialogRef } from '@angular/material/dialog'
import { DomSanitizer } from '@angular/platform-browser'
import { SolutionSurveyUploadComponent } from './solution-survey-upload.component'

describe('SolutionSurveyUploadComponent', () => {
    let component: SolutionSurveyUploadComponent

    const dialogRef: Partial<MatDialogRef<SolutionSurveyUploadComponent>> = {}
    const dialogData: any = {}
    const domSanitizer: Partial<DomSanitizer> = {}

    beforeAll(() => {
        component = new SolutionSurveyUploadComponent(
            dialogRef as MatDialogRef<SolutionSurveyUploadComponent>,
            dialogData as undefined,
            domSanitizer as DomSanitizer
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
