(window as any)['env'] = {
    name: 'test-environment',
    sitePath: '/test-site-path',
    karmYogiPath: '/test-karm-yogi-path',
    cbpPath: '/test-cbp-path',
}
import { MatDialog } from '@angular/material/dialog'
import { HelpCenterGuideComponent } from './help-center-guide.component'


describe('HelpCenterGuideComponent', () => {
    let component: HelpCenterGuideComponent
    const dialog: Partial<MatDialog> = {}

    beforeAll(() => {
        component = new HelpCenterGuideComponent(
            dialog as MatDialog
        )
    })

    beforeEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
    })

    it('should create a instance of component', () => {
        expect(component).toBeTruthy()
    })

    describe('ngOnInit', () => {
        it('calling ngOnInit', () => {
            component.ngOnInit()
        })
    })

    describe('openVideoPopup', () => {
        it('calling openVideoPopup', () => {
            component.openVideoPopup()
        })
    })

    describe('callResizeEvent', () => {
        it('calling callResizeEvent', () => {
            component.callResizeEvent('')
        })
    })

})
