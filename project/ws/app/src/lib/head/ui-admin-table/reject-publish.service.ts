import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
// import { Observable } from 'rxjs'

// const API_END_POINTS = {
//   GET_CATEGORIES: '/moderatoradmin/profanity/type/text',
//   MODERATE_DATA: '/moderatoradmin/feedback/persist/text/moderated',

// }

// const DEPARTMENT_NAME = 'igot'

@Injectable({
  providedIn: 'root',
})
export class RejectPublishService {
  constructor(private http: HttpClient) { }

  publishData(data: any) {
    const url = 'https://spv.igot-dev.in/moderatoradmin/feedback/persist/text/moderated'
    // const url = 'http://52.173.240.27:4000/feedback/persist/text/moderated'
    return this.http.post(url, data)
    // return this.http.post<any>(`${API_END_POINTS.MODERATE_DATA}`, data)

  }

  getCategories(): Observable<any> {
    const url = 'https://spv.igot-dev.in/moderatoradmin/profanity/type/text'
    return this.http.get(url)
    // return this.http.get<any>(`${API_END_POINTS.GET_CATEGORIES}`)
  }

}
