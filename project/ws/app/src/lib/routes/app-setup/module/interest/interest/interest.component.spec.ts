import '@angular/compiler'
import { ActivatedRoute, Router } from '@angular/router'
import { WidgetContentService, BtnPlaylistService } from '@sunbird-cb/collection'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { MatSnackBar } from '@angular/material/snack-bar'
import { InterestComponent } from './interest.component'

describe('InterestComponent', () => {
    let component: InterestComponent

    const activateRoute: Partial<ActivatedRoute> = {}
    const contentSvc: Partial<WidgetContentService> = {}
    const playlistSvc: Partial<BtnPlaylistService> = {}
    const configSvc: Partial<ConfigurationsService> = {}
    const router: Partial<Router> = {}
    const snackbar: Partial<MatSnackBar> = {}

    beforeAll(() => {
        component = new InterestComponent(
            activateRoute as ActivatedRoute,
            contentSvc as WidgetContentService,
            playlistSvc as BtnPlaylistService,
            configSvc as ConfigurationsService,
            router as Router,
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
