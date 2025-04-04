(window as any)['env'] = {
    name: 'test-environment',
    sitePath: '/test-site-path',
    karmYogiPath: '/test-karm-yogi-path',
    cbpPath: '/test-cbp-path',
}

import { Router } from '@angular/router'
import { EventService } from '@sunbird-cb/utils'
import { UIDirectoryTableComponent } from './directory-table.component'

describe('UIDirectoryTableComponent', () => {
    let component: UIDirectoryTableComponent

    const router: Partial<Router> = {}
    const events: Partial<EventService> = {}

    beforeAll(() => {
        component = new UIDirectoryTableComponent(
            router as Router,
            events as EventService
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
