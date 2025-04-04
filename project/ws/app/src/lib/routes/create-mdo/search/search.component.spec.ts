import { UsersService } from '../../../routes/home/services/users.service'
import { LoaderService } from '../../../routes/home/services/loader.service'
import { MatDialog } from '@angular/material/dialog'
import { SearchComponent } from './search.component'
import { of } from 'rxjs'

describe('SearchComponent', () => {
    let component: SearchComponent

    const dialog: Partial<MatDialog> = {}

    const usersSvc: Partial<UsersService> = {
        getAllValidUsers: jest.fn().mockReturnValue(of({
            users: ['user1', 'user2'],
        })),
    }

    const loadingService: Partial<LoaderService> = {
        changeLoaderState: jest.fn(),
    }

    beforeAll(() => {
        component = new SearchComponent(
            dialog as MatDialog,
            usersSvc as UsersService,
            loadingService as LoaderService
        )
    })

    beforeEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
    })

    it('should create an instance of component', () => {
        expect(component).toBeTruthy()
    })

    describe('hideFilter', () => {
        it('should call applyFilters when filter is applyFilter', () => {
            const spyApplyFilters = jest.spyOn(component, 'applyFilters')
            component.hideFilter({ filter: 'applyFilter' })
            expect(spyApplyFilters).toHaveBeenCalledWith({ filter: 'applyFilter' })
            expect(component.filterVisibilityFlag).toBe(false)
        })

        it('should call applyFilters when filter is clearFilter', () => {
            const spyApplyFilters = jest.spyOn(component, 'applyFilters')
            component.hideFilter({ filter: 'clearFilter' })
            expect(spyApplyFilters).toHaveBeenCalledWith({ filter: 'clearFilter' })
            expect(component.filterVisibilityFlag).toBe(false)
        })

        it('should not call applyFilters when filter is closeFilter', () => {
            const spyApplyFilters = jest.spyOn(component, 'applyFilters')
            component.hideFilter({ filter: 'closeFilter' })
            expect(spyApplyFilters).not.toHaveBeenCalled()
            expect(component.filterVisibilityFlag).toBe(false)
        })
    })

    describe('searchData', () => {
        it('should update searchText and call emitSearchRequest', () => {
            const spyEmitSearchRequest = jest.spyOn(component, 'emitSearchRequest')
            component.searchData({ target: { value: 'search query' } })
            expect(component.searchText).toBe('search query')
            expect(spyEmitSearchRequest).toHaveBeenCalled()
        })
    })

    describe('sortData', () => {
        it('should update sortOrder and call emitSearchRequest', () => {
            const spyEmitSearchRequest = jest.spyOn(component, 'emitSearchRequest')
            component.sortData('asc')
            expect(component.sortOrder).toBe('asc')
            expect(spyEmitSearchRequest).toHaveBeenCalled()
        })
    })

    describe('resetPageIndex', () => {
        it('should reset pageIndex and pageSize', () => {
            component.pageIndex = 5
            component.pageSize = 50
            component.resetPageIndex()
            expect(component.pageIndex).toBe(0)
            expect(component.pageSize).toBe(20)
        })
    })

    describe('approveAll', () => {
        it('should emit handleapproveAll event', () => {
            const spyEmit = jest.spyOn(component.handleapproveAll, 'emit')
            component.approveAll()
            expect(spyEmit).toHaveBeenCalled()
        })
    })

    describe('sort', () => {
        it('should have a sort method that does nothing', () => {
            expect(component.sort).toBeDefined()
            component.sort()
        })
    })

    describe('getContent', () => {
        it('should call changeLoaderState', () => {
            loadingService.changeLoaderState = jest.fn()
            usersSvc.getAllValidUsers = jest.fn(() => of({
                res: {
                    sampleKey: 'sampleValue',
                },
            }))
            component.getContent()
            expect(loadingService.changeLoaderState).toHaveBeenCalled()
            expect(usersSvc.getAllValidUsers).toHaveBeenCalled()
        })
    })

})
