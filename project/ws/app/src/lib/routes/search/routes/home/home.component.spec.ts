import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { SearchServService } from '../../services/search-serv.service'
import { HomeComponent } from './home.component'
import { of } from 'rxjs'

describe('HomeComponent', () => {
    let component: HomeComponent

    const configSvc: Partial<ConfigurationsService> = {}
    const router: Partial<Router> = {}
    const route: Partial<ActivatedRoute> = {
        snapshot: {
            parent: {
                data: {
                    configSvc: {
                        userProfile: {
                            userId: 'sampleId',
                        },
                        unMappedUser: {
                            roles: ['PUBLIC', 'STATE_ADMIN'],
                        },
                    },
                },
            },
            params: of({ tab: 'verified' }),
            queryParams: of({ roleId: 'testRoleId' }),
            data: {
                pageData: {
                    data: {
                        search: {
                            isAutoCompleteAllowed: true,
                        },
                    },
                },
            },
        } as any,
        params: of({ tab: 'verified' }),
        queryParams: of({ roleId: 'testRoleId' }),
    }
    const searchSvc: Partial<SearchServService> = {
        getLanguageSearchIndex: jest.fn(),
    }

    beforeAll(() => {
        component = new HomeComponent(
            configSvc as ConfigurationsService,
            router as Router,
            route as ActivatedRoute,
            searchSvc as SearchServService
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
