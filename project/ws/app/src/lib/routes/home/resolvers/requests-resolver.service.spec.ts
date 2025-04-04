

import { HttpClient } from '@angular/common/http'
import { RequestsResolve } from './requests-resolver.service'


describe('RequestsResolve', () => {
    let component: RequestsResolve

    const http: Partial<HttpClient> = {}

    beforeAll(() => {
        component = new RequestsResolve(
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