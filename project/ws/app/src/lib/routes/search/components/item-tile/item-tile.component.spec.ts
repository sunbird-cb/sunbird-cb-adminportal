import { ActivatedRoute, Router } from '@angular/router'
import { ItemTileComponent } from './item-tile.component'

describe('ItemTileComponent', () => {
    let component: ItemTileComponent

    const activated: Partial<ActivatedRoute> = {}
    const route: Partial<Router> = {}

    beforeAll(() => {
        component = new ItemTileComponent(
            activated as ActivatedRoute,
            route as Router
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
