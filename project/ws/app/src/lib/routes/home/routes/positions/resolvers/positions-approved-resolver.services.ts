import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { IResolveResponse } from '@sunbird-cb/utils'
import { IPosition } from '../models/positions.model'
import { PositionsService } from '../services/position.service'

@Injectable()
export class PositionsApprovedResolve
  implements
  Resolve<Observable<IResolveResponse<IPosition[]>> | IResolveResponse<IPosition[]>> {
  constructor(private positionsSvc: PositionsService) { }
  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<IPosition[]>> {
    const reqbody = {
      serviceName: 'position',
      applicationStatus: 'APPROVED',
      limit: 1000,
      offset: 0,
      deptName: 'iGOT',
    }
    return this.positionsSvc.getPositionsList(reqbody).pipe(
      map(data => ({
        data: data.result.data, error: null,
      })),
      catchError(error => of({ error, data: null })),
    )
  }
}
