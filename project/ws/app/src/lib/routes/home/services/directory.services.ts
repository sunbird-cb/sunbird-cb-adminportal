import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  GET_ALL_DEPARTMENTS: '/apis/protected/v8/portal/spv/department',
  GET_ALL_DEPARTMENT_KONG: '/apis/proxies/v8/org/v1/search',
  GET_DEPARTMENT_TITLE: 'apis/proxies/v8/data/v1/system/settings/get/orgTypeList',
  GET_DEPARTMENT_SUB_TITLE: 'apis/proxies/v8/data/v1/system/settings/get/orgTypeConfig',
}

@Injectable({
  providedIn: 'root',
})
export class DirectoryService {
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

}
