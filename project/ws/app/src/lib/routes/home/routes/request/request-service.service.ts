import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const API_END_POINTS = {
  GET_REQUEST_DATA: '/apis/proxies/v8/demand/content/search',
  GET_FILTER_ENTITY: 'apis/proxies/v8/competency/v4/search',
  // GET_FILTER_ENTITY_V2: 'apis/proxies/v8/searchBy/v2/competency',
  GET_FILTER_ENTITY_V2: 'apis/proxies/v8/framework/v1/read/kcmfinal_fw',
  GET_REQUEST_TYPE_LIST: '/apis/proxies/v8/org/v1/search',
  CREATE_DEMAND_REQUEST: '/apis/proxies/v8/demand/content/create',
  MARK_INVALID: '/apis/proxies/v8/demand/content/v1/update/status',
  GET_REQUEST_DATA_BYID: 'apis/proxies/v8/demand/content/read',
  GET_INTEREST_ORG_LIST: '/apis/proxies/v8/interest/v1/search',
  ASSIGN_TO_ORG: '/apis/proxies/v8/interest/v1/assign',
}

@Injectable({
  providedIn: 'root',
})
export class RequestServiceService {

  constructor(private http: HttpClient) { }

  getFilterEntity(filter: object): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_FILTER_ENTITY}`, filter).pipe(map(res => _.get(res, 'result.competency')))
  }
  getFilterEntityV2(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_FILTER_ENTITY_V2}`).pipe(map(res => _.get(res, 'result.framework.categories')))
  }

  getRequestTypeList(request: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_REQUEST_TYPE_LIST}`, request).pipe(map(res => _.get(res, 'result.response.content')))
  }

  createDemand(request: any) {
    return this.http.post<any>(`${API_END_POINTS.CREATE_DEMAND_REQUEST}`, request)
  }

  getRequestList(request: any) {
    return this.http.post<any>(`${API_END_POINTS.GET_REQUEST_DATA}`, request).pipe(map(res => _.get(res, 'result.result')))
  }

  markAsInvalid(request: any) {
    return this.http.post<any>(`${API_END_POINTS.MARK_INVALID}`, request)
  }

  getRequestDataById(demandId: any) {
    return this.http.get<any>(`${API_END_POINTS.GET_REQUEST_DATA_BYID}/${demandId}`).pipe(map(res => _.get(res, 'result.result')))
  }

  getOrgInterestList(request: any) {
    return this.http.post<any>(`${API_END_POINTS.GET_INTEREST_ORG_LIST}`, request).pipe(map(res => _.get(res, 'result.result')))
  }

  assignToOrg(request: any) {
    return this.http.put<any>(`${API_END_POINTS.ASSIGN_TO_ORG}`, request)
  }
}
