
import { HttpClient } from '@angular/common/http'
import { ApprovedlistResolve } from './positionlist-resolver.service'

describe('ApprovedlistResolve', () => {
    let component: ApprovedlistResolve

    const http: Partial<HttpClient> = {}

    beforeAll(() => {
        component = new ApprovedlistResolve(
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