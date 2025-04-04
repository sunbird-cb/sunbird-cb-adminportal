import { Router } from '@angular/router'
import { SectorListViewComponent } from './sector-list-view.component'

describe('SectorListViewComponent', () => {
    let component: SectorListViewComponent

    const router: Partial<Router> = {}

    beforeAll(() => {
        component = new SectorListViewComponent(
            router as Router
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
