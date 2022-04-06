import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  GET_ALL_DEPARTMENTS: '/apis/protected/v8/portal/spv/department',
  GET_ALL_DEPARTMENT_KONG: '/apis/proxies/v8/org/v1/search',
  GET_DEPARTMENT_TITLE: 'apis/proxies/v8/data/v1/system/settings/get/orgTypeList',
  GET_DEPARTMENT_SUB_TITLE: 'apis/proxies/v8/data/v1/system/settings/get/orgTypeConfig',
  // FETCH_FEEDBACK: 'moderatoradmin/feedback/text/fetch',
  FETCH_FEEDBACK: 'https://spv.igot-dev.in/moderatoradmin/feedback/text/fetch',
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

    return this.http.post(API_END_POINTS.FETCH_FEEDBACK, {


      page: {
        number: 0,
        size: 10000,
      },
      moderated: false,
      sort: {
        field: 'timestamp',
        order: 'desc',

      },




    })
    // return this.http.post<any>(`${API_END_POINTS.FETCH_FEEDBACK}`, {
    //   page: 1,
    //   size: 10,
    //   moderated: false,
    // })
  }

  getModeratedData() {
    return this.http.post(API_END_POINTS.FETCH_FEEDBACK, {


      page: {
        number: 0,
        size: 10000,
      },
      moderated: true,
      sort: {
        field: 'timestamp',
        order: 'desc',
      },


    })

    // return this.http.post<any>(`${API_END_POINTS.FETCH_FEEDBACK}`, {
    //   page: 1,
    //   size: 10,
    //   moderated: true,
    // })
  }

}
