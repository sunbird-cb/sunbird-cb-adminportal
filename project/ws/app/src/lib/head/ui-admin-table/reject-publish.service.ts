import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
// import { Observable } from 'rxjs'

const API_END_POINTS = {
  GET_CATEGORIES: '/moderatoradmin/profanity/type/text',
  MODERATE_DATA: '/moderatoradmin/feedback/persist/text/moderated',

}

// const DEPARTMENT_NAME = 'igot'

@Injectable({
  providedIn: 'root',
})
export class RejectPublishService {
  constructor(private http: HttpClient) { }

  publishData(data: any) {
    return this.http.post(API_END_POINTS.MODERATE_DATA, data)
    // return this.http.post<any>(`${API_END_POINTS.MODERATE_DATA}`, data)

  }

  getCategories(): Observable<any> {
    return this.http.get(API_END_POINTS.GET_CATEGORIES)
    // return this.http.get<any>(`${API_END_POINTS.GET_CATEGORIES}`)
  }

}
