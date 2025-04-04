
import { MatDialogRef } from '@angular/material/dialog'
import { DomSanitizer } from '@angular/platform-browser'
import { DemoVideoPopupComponent } from './demo-video-popup.component'

describe('DemoVideoPopupComponent', () => {
    let component: DemoVideoPopupComponent

    const dialogRef: Partial<MatDialogRef<DemoVideoPopupComponent>> = {}
    const dialogData: any = {}
    const domSanitizer: Partial<DomSanitizer> = {}

    beforeAll(() => {
        component = new DemoVideoPopupComponent(
            dialogRef as MatDialogRef<DemoVideoPopupComponent>,
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
