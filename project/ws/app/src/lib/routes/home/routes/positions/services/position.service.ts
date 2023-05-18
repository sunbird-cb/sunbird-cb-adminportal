import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { IRequest } from '../models/positions.model'

const API_END_POINTS = {
  GET_POSITIONS: '/apis/proxies/v8/user/v1/positions',
  NEW_POSITION: '/apis/proxies/v8/masterData/v1/upsert',
}

@Injectable({
  providedIn: 'root',
})
export class PositionsService {
  constructor(private http: HttpClient) { }
  getPositionsList(): Observable<any> {
    return this.http.get(API_END_POINTS.GET_POSITIONS)
  }
  createNewPosition(data: {
    request: IRequest
  }) {
    return this.http.post(API_END_POINTS.NEW_POSITION, data)
  }
}
