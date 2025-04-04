import { ActivatedRoute } from '@angular/router'
import { ValueService } from '@sunbird-cb/utils'
import { AppGalleryComponent } from './app-gallery.component'

describe('AppGalleryComponent', () => {
    let component: AppGalleryComponent

    const activatedRoute: Partial<ActivatedRoute> = {}
    const valSvc: Partial<ValueService> = {}

    beforeAll(() => {
        component = new AppGalleryComponent(
            activatedRoute as ActivatedRoute,
            valSvc as ValueService
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
