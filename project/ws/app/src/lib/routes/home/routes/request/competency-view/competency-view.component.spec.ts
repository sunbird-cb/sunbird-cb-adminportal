import { MatDialogRef } from '@angular/material/dialog'
import { DomSanitizer } from '@angular/platform-browser'
import { CompetencyViewComponent } from './competency-view.component'

describe('CompetencyViewComponent', () => {
    let component: CompetencyViewComponent

    const dialogRef: Partial<MatDialogRef<CompetencyViewComponent>> = {
        close: jest.fn(),
    }
    const sanitized: Partial<DomSanitizer> = {
        bypassSecurityTrustHtml: jest.fn(html => html),  // Mocking bypassSecurityTrustHtml
    }

    const dData = {
        id: 1,
        selectedLevelId: 2,
        children: [
            { id: 1, description: 'Level 1 • Test 1' },
            { id: 2, description: 'Level 2 • Test 2' },
        ],
    }

    beforeAll(() => {
        component = new CompetencyViewComponent(
            dialogRef as MatDialogRef<CompetencyViewComponent>,
            sanitized as DomSanitizer,
            dData as any
        )
    })

    beforeEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
    })

    it('should create an instance of the component', () => {
        expect(component).toBeTruthy()
    })

    describe('ngOnInit', () => {
        it('should select the correct level based on selectedLevelId', () => {
            component.ngOnInit()
            expect(component.levelSelected.id).toBe(2)
        })

        it('should select the first child if no selectedLevelId is present', () => {
            const noSelectedLevelData = {
                ...dData,
                selectedLevelId: null,
            }
            component = new CompetencyViewComponent(
                dialogRef as MatDialogRef<CompetencyViewComponent>,
                sanitized as DomSanitizer,
                noSelectedLevelData as any
            )
            component.ngOnInit()
            expect(component.levelSelected.id).toBe(1)
        })
    })

    describe('add', () => {
        it('should close the dialog with the correct ADD action', () => {
            component.levelSelected = dData.children[1]
            component.add()
            expect(dialogRef.close).toHaveBeenCalledWith({
                id: 1,
                action: 'ADD',
                childId: 2,
            })
        })

        it('should close the dialog with empty childId if no level is selected', () => {
            component.levelSelected = {}
            component.add()
            expect(dialogRef.close).toHaveBeenCalledWith({
                id: 1,
                action: 'ADD',
                childId: '',
            })
        })
    })

    describe('remove', () => {
        it('should close the dialog with the correct DELETE action', () => {
            component.remove()
            expect(dialogRef.close).toHaveBeenCalledWith({
                id: 1,
                action: 'DELETE',
            })
        })

        it('should close the dialog with dData as id if dData.id is not present', () => {
            const noIdData = {
                ...dData,
                id: null,
            }
            component = new CompetencyViewComponent(
                dialogRef as MatDialogRef<CompetencyViewComponent>,
                sanitized as DomSanitizer,
                noIdData as any
            )
            component.remove()
            expect(dialogRef.close).toHaveBeenCalledWith({
                id: noIdData,
                action: 'DELETE',
            })
        })
    })

})
