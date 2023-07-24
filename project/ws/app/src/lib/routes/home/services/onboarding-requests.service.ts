import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
// import { IRequest } from '../models/positions.model'

const API_END_POINTS = {
  // GET_POSITIONS: '/apis/proxies/v8/user/v1/positions',
  NEW_POSITION: '/apis/proxies/v8/masterData/v1/upsert',
  UPDATE_POSITION: '/apis/proxies/v8/workflow/position/update',
  SEARCH_POSITION: '/apis/proxies/v8/workflow/position/search',

  UPDATE_ORG: '/apis/proxies/v8/workflow/org/update',
  SEARCH_ORG: '/apis/proxies/v8/workflow/org/search',

  UPDATE_DOMAIN: '/apis/proxies/v8/workflow/domain/update',
  SEARCH_DOMAIN: '/apis/proxies/v8/workflow/domain/search',
}

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  constructor(private http: HttpClient) { }
  // position
  getPositionsList(req: any): Observable<any> {
    return this.http.post(API_END_POINTS.SEARCH_POSITION, req)
  }
  approveNewPosition(data: any) {
    return this.http.post(API_END_POINTS.UPDATE_POSITION, data)
  }
  addNewPosition(data: any) {
    return this.http.post(API_END_POINTS.NEW_POSITION, data)
  }

  // org
  getOrgsList(req: any): Observable<any> {
    return this.http.post(API_END_POINTS.SEARCH_ORG, req)
  }
  approveNewOrg(data: any) {
    return this.http.post(API_END_POINTS.UPDATE_ORG, data)
  }

  // email domain
  getDomainsList(req: any): Observable<any> {
    return this.http.post(API_END_POINTS.SEARCH_DOMAIN, req)
  }
  approveNewDomain(data: any) {
    return this.http.post(API_END_POINTS.UPDATE_DOMAIN, data)
  }
}
