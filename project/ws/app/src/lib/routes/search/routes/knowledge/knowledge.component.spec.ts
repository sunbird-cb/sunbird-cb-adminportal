import '@angular/compiler'
import { SearchServService } from '../../services/search-serv.service'
import { Router, ActivatedRoute } from '@angular/router'
import { ValueService } from '@sunbird-cb/utils'
import { KnowledgeComponent } from './knowledge.component'

describe('KnowledgeComponent', () => {
    let component: KnowledgeComponent

    const activated: Partial<ActivatedRoute> = {}
    const router: Partial<Router> = {}
    const valueSvc: Partial<ValueService> = {}
    const searchServ: Partial<SearchServService> = {}

    beforeAll(() => {
        component = new KnowledgeComponent(
            activated as ActivatedRoute,
            router as Router,
            valueSvc as ValueService,
            searchServ as SearchServService
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
