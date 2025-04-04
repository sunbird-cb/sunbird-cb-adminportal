import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute, Router } from '@angular/router'
import { RequestsService } from '../../services/onboarding-requests.service'
import { RequestsApprovalComponent } from './requests-approval.component'
import { of } from 'rxjs'

describe('RequestsApprovalComponent', () => {
    let component: RequestsApprovalComponent

    const snackBar: Partial<MatSnackBar> = {}
    const route: Partial<Router> = {
        url: 'new',
    }
    const activatedRoute: Partial<ActivatedRoute> = {
        snapshot: {
            parent: {
                data: {
                    configService: {
                        unMappedUser: {
                            firstName: 'sample',
                        },
                    },
                },
            },
            params: of({ tab: 'verified' }),
            queryParams: of({ roleId: 'testRoleId' }),
        } as any,
        params: of({ tab: 'verified' }),
        queryParams: of({ roleId: 'testRoleId' }),
    }
    const requestService: Partial<RequestsService> = {}
    const dialogue: Partial<MatDialog> = {}

    beforeAll(() => {
        component = new RequestsApprovalComponent(
            snackBar as MatSnackBar,
            route as Router,
            activatedRoute as ActivatedRoute,
            requestService as RequestsService,
            dialogue as MatDialog
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
