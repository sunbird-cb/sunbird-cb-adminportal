

import { HttpClient } from '@angular/common/http'
import { RejectedRequestsResolve } from './rejectedrequests-reoslver.service'

describe('RejectedRequestsResolve', () => {
    let component: RejectedRequestsResolve

    const http: Partial<HttpClient> = {}

    beforeAll(() => {
        component = new RejectedRequestsResolve(
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