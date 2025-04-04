
import { HttpClient } from '@angular/common/http'
import { ApprovedRequestsResolve } from './approvedrequests-resolver.service'


describe('ApprovedRequestsResolve', () => {
    let component: ApprovedRequestsResolve

    const http: Partial<HttpClient> = {}

    beforeAll(() => {
        component = new ApprovedRequestsResolve(
            http as HttpClient
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