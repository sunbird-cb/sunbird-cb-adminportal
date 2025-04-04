import { FormBuilder } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { SectorsService } from '../sectors.service'
import { DomSanitizer } from '@angular/platform-browser'
import { MatSnackBar } from '@angular/material/snack-bar'
import { EditSectorComponent } from './edit-sector.component'

describe('EditSectorComponent', () => {
    let component: EditSectorComponent

    const dialog: Partial<MatDialog> = {}
    const configSvc: Partial<ConfigurationsService> = {}
    const router: Partial<Router> = {}
    const formBuilder: Partial<FormBuilder> = {
        group: jest.fn(),
        array: jest.fn(),
    }
    const sectorsService: Partial<SectorsService> = {}
    const sanitizer: Partial<DomSanitizer> = {}
    const activatedRoute: Partial<ActivatedRoute> = {}
    const snackBar: Partial<MatSnackBar> = {}

    beforeAll(() => {
        component = new EditSectorComponent(
            dialog as MatDialog,
            configSvc as ConfigurationsService,
            router as Router,
            formBuilder as FormBuilder,
            sectorsService as SectorsService,
            sanitizer as DomSanitizer,
            activatedRoute as ActivatedRoute,
            snackBar as MatSnackBar
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
