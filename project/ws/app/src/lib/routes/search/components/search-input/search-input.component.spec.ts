import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { SearchServService } from '../../services/search-serv.service'
import { SearchInputComponent } from './search-input.component'
import { of } from 'rxjs'

describe('SearchInputComponent', () => {
    let component: SearchInputComponent

    const activated: Partial<ActivatedRoute> = {
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
        } as any,
        params: of({ tab: 'verified' }),
        queryParams: of({ roleId: 'testRoleId' }),
    }
    const router: Partial<Router> = {}
    const searchServSvc: Partial<SearchServService> = {
        getLanguageSearchIndex: jest.fn(),
    }
    const configSvc: Partial<ConfigurationsService> = {}
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
                searchPageData: {
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

    beforeAll(() => {
        component = new SearchInputComponent(
            activated as ActivatedRoute,
            router as Router,
            searchServSvc as SearchServService,
            configSvc as ConfigurationsService,
            route as ActivatedRoute
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
