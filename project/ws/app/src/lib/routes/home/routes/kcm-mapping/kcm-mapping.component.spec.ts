
import { ActivatedRoute } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { KCMMappingComponent } from './kcm-mapping.component'

describe('KCMMappingComponent', () => {
    let component: KCMMappingComponent

    const activateRoute: Partial<ActivatedRoute> = {}
    const dialog: Partial<MatDialog> = {}

    beforeAll(() => {
        component = new KCMMappingComponent(
            activateRoute as ActivatedRoute,
            dialog as MatDialog
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
