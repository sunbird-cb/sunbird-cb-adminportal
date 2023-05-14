import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
// import { IRequest } from '../models/positions.model'

const API_END_POINTS = {
  GET_POSITIONS: '/apis/proxies/v8/user/v1/positions',
  // NEW_POSITION: '/apis/proxies/v8/masterData/v1/upsert',
  UPDATE_POSITION: '/apis/proxies/v8/workflow/position/update',
  SEARCH_POSITION: '/apis/proxies/v8/workflow/position/search',
}

@Injectable({
  providedIn: 'root',
})
export class PositionsService {
  constructor(private http: HttpClient) { }
  getPositionsList(req: any): Observable<any> {
    return this.http.post(API_END_POINTS.SEARCH_POSITION, req)
  }
  approveNewPosition(data: any) {
    return this.http.post(API_END_POINTS.UPDATE_POSITION, data)
  }
}
