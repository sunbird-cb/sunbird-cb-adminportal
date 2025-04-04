
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { ModerationService } from '../../services/moderation.service'
import { ModerationViewComponent } from './moderation.component'
import { of } from 'rxjs'

describe('ModerationViewComponent', () => {
    let component: ModerationViewComponent

    const dialog: Partial<MatDialog> = {}
    const route: Partial<ActivatedRoute> = {
        snapshot: {
            params: { tab: 'verified' },
            queryParams: of({ roleId: 'testRoleId' }),
            data: {
                configSvc: {
                    userProfile: {
                        userId: 'sampleId',
                    },
                },
            },
        } as any,
        queryParams: of({ roleId: 'testRoleId' }),
        data: of({}),
        params: of({}),
    }
    const configSvc: Partial<ConfigurationsService> = {}
    const moderationService: Partial<ModerationService> = {}
    const router: Partial<Router> = {}

    beforeAll(() => {
        component = new ModerationViewComponent(
            dialog as MatDialog,
            route as ActivatedRoute,
            configSvc as ConfigurationsService,
            moderationService as ModerationService,
            router as Router
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
