
import { FormBuilder } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { DomSanitizer } from '@angular/platform-browser'
import { SectorsService } from '../sectors/sectors.service'
import { AddThumbnailComponent } from './add-thumbnail.component'

describe('AddThumbnailComponent', () => {
    let component: AddThumbnailComponent

    const sectotsService: Partial<SectorsService> = {}
    const dialogRef: Partial<MatDialogRef<AddThumbnailComponent>> = {}
    const sanitizer: Partial<DomSanitizer> = {}
    const formBuilder: Partial<FormBuilder> = {}
    const data: any = {}

    beforeAll(() => {
        component = new AddThumbnailComponent(
            sectotsService as SectorsService,
            dialogRef as MatDialogRef<AddThumbnailComponent>,
            sanitizer as DomSanitizer,
            formBuilder as FormBuilder,
            data as undefined
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
