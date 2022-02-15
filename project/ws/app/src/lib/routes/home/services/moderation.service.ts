import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  GET_ALL_DEPARTMENTS: '/apis/protected/v8/portal/spv/department',
  GET_ALL_DEPARTMENT_KONG: '/apis/proxies/v8/org/v1/search',
  GET_DEPARTMENT_TITLE: 'apis/proxies/v8/data/v1/system/settings/get/orgTypeList',
  GET_DEPARTMENT_SUB_TITLE: 'apis/proxies/v8/data/v1/system/settings/get/orgTypeConfig',
  FETCH_FEEDBACK: 'moderatoradmin/feedback/text/fetch',
}

@Injectable({
  providedIn: 'root',
})
export class ModerationService {
  constructor(private http: HttpClient) { }
  getAllDepartments(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ALL_DEPARTMENTS}`)
  }
  getAllDepartmentsKong(): Observable<any> {
    const req = {
      request: {
        filters: {
          isTenant: true,
        },
        sortBy: {
          orgName: 'asc',
        },
        limit: 1000,
      },
    }
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_DEPARTMENT_KONG}`, req)
  }
  getDepartmentTitles(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_DEPARTMENT_TITLE}`)
  }
  getDepartmentSubTitles(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_DEPARTMENT_SUB_TITLE}`)
  }

  getData() {
    const url = 'https://spv.igot-dev.in/moderatoradmin/feedback/text/fetch'
    // const url = 'http://52.173.240.27:4000/feedback/text/fetch'
    // let data = this.http.post(url, {
    //   "page" :1,
    //   "size" : 10,

    // });
    // console.log(data[payload])
    return this.http.post(url, {
      page: 1,
      size: 10,
      moderated: false,

    })
    // return this.http.post<any>(`${API_END_POINTS.FETCH_FEEDBACK}`, {
    //   page: 1,
    //   size: 10,
    //   moderated: false,
    // })
  }

  getModeratedData() {
    const url = 'https://spv.igot-dev.in/moderatoradmin/feedback/text/fetch'
    return this.http.post(url, {
      page: 1,
      size: 10,
      moderated: true,
    })
    // console.log(data[payload])

    // return this.http.post<any>(`${API_END_POINTS.FETCH_FEEDBACK}`, {
    //   page: 1,
    //   size: 10,
    //   moderated: true,
    // })
  }

}
