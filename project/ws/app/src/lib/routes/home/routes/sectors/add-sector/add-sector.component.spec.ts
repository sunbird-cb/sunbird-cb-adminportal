
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { SectorsService } from '../sectors.service'
import { DomSanitizer } from '@angular/platform-browser'
import { AddSectorComponent } from './add-sector.component'

describe('AddSectorComponent', () => {
    let component: AddSectorComponent

    const dialog: Partial<MatDialog> = {}
    const router: Partial<Router> = {}
    const snackBar: Partial<MatSnackBar> = {}
    const sectorsService: Partial<SectorsService> = {}
    const activatedRoute: Partial<ActivatedRoute> = {}
    const sanitizer: Partial<DomSanitizer> = {}

    beforeAll(() => {
        component = new AddSectorComponent(
            dialog as MatDialog,
            router as Router,
            snackBar as MatSnackBar,
            sectorsService as SectorsService,
            activatedRoute as ActivatedRoute,
            sanitizer as DomSanitizer
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