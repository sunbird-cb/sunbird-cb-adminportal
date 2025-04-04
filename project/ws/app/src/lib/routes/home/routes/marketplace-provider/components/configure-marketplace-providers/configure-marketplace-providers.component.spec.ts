
import { ActivatedRoute } from '@angular/router'
import { ConfigureMarketplaceProvidersComponent } from './configure-marketplace-providers.component'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MarketplaceService } from '../../services/marketplace.service'
import { of } from 'rxjs'

describe('ConfigureMarketplaceProvidersComponent', () => {
    let component: ConfigureMarketplaceProvidersComponent

    const activateRoute: Partial<ActivatedRoute> = {
        data: of(
            {
                providerDetails: {
                    data: {
                        result: {
                            id: '2'
                        }
                    }
                }
            }
        )
    }
    const snackBar: Partial<MatSnackBar> = {}
    const marketPlaceSvc: Partial<MarketplaceService> = {
        getProviderDetails: jest.fn(() => of({
            result: {
                id: '2'
            }
        }))
    }

    beforeAll(() => {
        component = new ConfigureMarketplaceProvidersComponent(
            activateRoute as ActivatedRoute,
            snackBar as MatSnackBar,
            marketPlaceSvc as MarketplaceService
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
        it('should call getRoutesData()', () => {
            // arrange
            const getRoutesDataSpy = jest.spyOn(component, 'getRoutesData')

            // act
            component.ngOnInit()
            //assert
            expect(getRoutesDataSpy).toHaveBeenCalled()
        })
    })

    describe('getProviderDetails', () => {
        it('should call getProviderDetails and set providerDetails', () => {
            const event = true

            component.getProviderDetails(event)
        })
    })

})
