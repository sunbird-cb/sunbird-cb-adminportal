import { ActivatedRoute, Router } from '@angular/router'
import { of } from 'rxjs'
import { EmailDomainsComponent } from './email-domains.component'
import { RequestsService } from '../../services/onboarding-requests.service'
import { PageEvent } from '@angular/material/paginator'

describe('EmailDomainsComponent', () => {
    let component: EmailDomainsComponent

    const routerMock: Partial<Router> = {
        navigate: jest.fn(),
    }
    const activatedRouteMock: Partial<ActivatedRoute> = {
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
    }

    const requestServiceMock: Partial<RequestsService> = {
        getDomainsList: jest.fn().mockReturnValue(of({
            result: {
                count: 'sampleCount',
                data: 'sampledata',
            },
        })),
    }

    beforeAll(() => {
        component = new EmailDomainsComponent(
            routerMock as Router,
            activatedRouteMock as ActivatedRoute,
            requestServiceMock as RequestsService
        )
    })

    beforeEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
    })

    it('should create an instance of the component', () => {
        expect(component).toBeTruthy()
    })

    it('should call getPendingList if no data in activatedRoute on ngOnInit', () => {
        component.getPendingList = jest.fn()
        component.ngOnInit()
        expect(component.getPendingList).toHaveBeenCalled()
    })

    it('should format data correctly in formatData method', () => {
        const resData = [
            {
                wfInfo: [
                    {
                        updateFieldValues: JSON.stringify([{ toValue: { domain: 'test.com' }, firstName: 'Test' }]),
                        createdOn: '2022-01-01',
                        lastUpdatedOn: '2022-02-01',
                    },
                ],
            },
        ]
        component.formatData(resData, 'pending')
        expect(component.data.length).toBeGreaterThan(0)
        expect(component.data[0].domain).toBe('test.com')
    })

    it('should filter data correctly', () => {
        component.getPendingList = jest.fn()
        component.getApprovedList = jest.fn()
        component.getRejectedList = jest.fn()

        component.filter('pending')
        expect(component.getPendingList).toHaveBeenCalled()

        component.filter('approved')
        expect(component.getApprovedList).toHaveBeenCalled()

        component.filter('rejected')
        expect(component.getRejectedList).toHaveBeenCalled()
    })

    it('should handle pagination change and load the correct data', () => {
        const pageEvent: PageEvent = { pageIndex: 1, pageSize: 10, length: 100 }
        component.getPendingList = jest.fn()
        component.getApprovedList = jest.fn()
        component.getRejectedList = jest.fn()

        // act
        component.onPaginateChange(pageEvent)

        // assert
        expect(component.pageIndex).toBe(1)
        expect(component.limit).toBe(10)
        expect(component.currentOffset).toBe(1)

        component.currentFilter = 'pending'
        component.onPaginateChange(pageEvent)
        expect(component.getPendingList).toHaveBeenCalled()

        component.currentFilter = 'approved'
        component.onPaginateChange(pageEvent)
        expect(component.getApprovedList).toHaveBeenCalled()

        component.currentFilter = 'rejected'
        component.onPaginateChange(pageEvent)
        expect(component.getRejectedList).toHaveBeenCalled()
    })

    it('should navigate correctly on actionsClick', () => {
        const event = { action: 'edit', row: {} }
        component.actionsClick(event)
        expect(routerMock.navigate).toHaveBeenCalledWith(['requests-approval'], { relativeTo: activatedRouteMock.parent, state: event })
    })
})
