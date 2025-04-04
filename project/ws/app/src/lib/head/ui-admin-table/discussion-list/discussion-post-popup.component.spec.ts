
import { MatDialogRef } from '@angular/material/dialog'
import { FormBuilder } from '@angular/forms'
import { DialogTextProfanityComponent } from './discussion-post-popup.component'
import { IDialogData } from './discussion-post.component'

describe('DialogTextProfanityComponent', () => {
    let component: DialogTextProfanityComponent

    const fb: Partial<FormBuilder> = {}
    const dialogRef: Partial<MatDialogRef<DialogTextProfanityComponent>> = {}
    const data: Partial<IDialogData> = {}

    beforeAll(() => {
        component = new DialogTextProfanityComponent(
            fb as FormBuilder,
            dialogRef as MatDialogRef<DialogTextProfanityComponent>,
            data as IDialogData
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
