import '@angular/compiler'
import { SearchApiService } from '../../apis/search-api.service'
import { Router, ActivatedRoute } from '@angular/router'
import { SearchServService } from '../../services/search-serv.service'
import { ValueService } from '@sunbird-cb/utils'
import { SocialComponent } from './social.component'

describe('SocialComponent', () => {
    let component: SocialComponent

    const activated: Partial<ActivatedRoute> = {}
    const router: Partial<Router> = {}
    const authSvc: Partial<SearchApiService> = {}
    const valueSvc: Partial<ValueService> = {}
    const searchSrv: Partial<SearchServService> = {}

    beforeAll(() => {
        component = new SocialComponent(
            activated as ActivatedRoute,
            router as Router,
            authSvc as SearchApiService,
            valueSvc as ValueService,
            searchSrv as SearchServService
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
