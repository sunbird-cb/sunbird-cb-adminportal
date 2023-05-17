import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { IResolveResponse } from '@sunbird-cb/utils'
import { RequestsService } from '../services/onboarding-requests.service'

@Injectable()
export class ApprovedRequestsResolve
  implements
  Resolve<Observable<IResolveResponse<[]>> | IResolveResponse<[]>> {
  requestType: any
  constructor(private requestService: RequestsService) {
    const reqArray = window.location.pathname.split('requests/')
    this.requestType = reqArray[1]
    console.log('***this.requestType======================', this.requestType)
  }
  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<[]>> {
    const reqbody = {
      serviceName: this.requestType,
      applicationStatus: 'APPROVED',
      limit: 1000,
      offset: 0,
      deptName: 'iGOT',
    }
    if (this.requestType === 'position') {
      return this.requestService.getPositionsList(reqbody).pipe(
        map((datanew: any) => ({
          data: datanew.result.data, error: null,
        })),
        catchError(error => of({ error, data: null })),
      )
    }
    if (this.requestType === 'organisation') {
      return this.requestService.getOrgsList(reqbody).pipe(
        map((datanew: any) => ({
          data: datanew.result.data, error: null,
        })),
        catchError(error => of({ error, data: null })),
      )
    }
    if (this.requestType === 'domain') {
      return this.requestService.getDomainsList(reqbody).pipe(
        map((datanew: any) => ({
          data: datanew.result.data, error: null,
        })),
        catchError(error => of({ error, data: null })),
      )
    }
  }
}
