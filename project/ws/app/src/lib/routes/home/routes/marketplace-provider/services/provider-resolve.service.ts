import { Injectable } from '@angular/core'
import { MarketplaceService } from './marketplace.service'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { IResolveResponse } from '@sunbird-cb/utils'
// import { of } from 'rxjs'
// import { HttpErrorResponse } from '@angular/common/http'
import * as _ from 'lodash'
// import { catchError, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class ProviderResolveService implements Resolve<IResolveResponse<any>> {

  constructor(
    private marketPlaceSvc: MarketplaceService
  ) { }

  async resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Promise<IResolveResponse<any>> {
    const partnerId = _route.paramMap.get('id')
    if (partnerId) {
      try {
        const response = await this.marketPlaceSvc.getProviderDetails(partnerId).toPromise()
        return { data: response, error: null }
      } catch (error: any) {
        const errmsg = _.get(error, 'error.params.errMsg', 'Something went worng, please try again later')
        return { data: null, error: errmsg }
      }
    }
    return {
      data: null,
      error: null,
    }
  }
}
