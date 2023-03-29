import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  GET_POSITIONS: '/apis/proxies/v8/user/v1/positions',
}

@Injectable({
  providedIn: 'root',
})
export class PositionsService {
  constructor(private http: HttpClient) { }
  getPositionsList(): Observable<any> {
    return this.http.get(API_END_POINTS.GET_POSITIONS)
  }
}