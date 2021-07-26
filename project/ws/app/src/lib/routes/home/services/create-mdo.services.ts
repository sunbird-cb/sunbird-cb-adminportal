import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { EMPTY, Observable } from 'rxjs'

const API_END_POINTS = {
  GET_ALL_DEPARTMENTS: '/apis/protected/v8/portal/departmentType/',
  CREATE_DEPARTMENT: '/apis/proxies/v8/org/v1/create',
  UPDATE_DEPARTMENT: '/apis/protected/v8/portal/spv/department',
  ASSIGN_ADMIN_TO_CREATED_DEPARTMENT: '/apis/protected/v8/portal/spv/deptAction/',
  GET_DEPARTMENT_BY_ID: '/apis/protected/v8/portal/deptAction/',
}

const DEPARTMENT_NAME = 'igot'

@Injectable({
  providedIn: 'root',
})
export class CreateMDOService {
  constructor(private http: HttpClient) { }
  getAllSubDepartments(deptName: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ALL_DEPARTMENTS}${deptName}`)
  }
  createDepartment(deptData: any, deptType: string, deptSubType: string): Observable<any> {
    if (deptType) {
      const departmentData = {
        request: {
          orgName: deptData.name,
          channel: deptData.name,
          isTenant: true,
          organisationType: 'cbp',
          organisationSubType: deptType,
          requestedBy: '1238b2e6-8ac1-4462-b36a-19a9b48a7e94',
        },
      }
      return this.http.post<any>(`${API_END_POINTS.CREATE_DEPARTMENT}`, departmentData)
    }
    if (deptSubType) {
      const departmentData = {
        request: {
          orgName: deptData.name,
          channel: deptData.name,
          isTenant: true,
          organisationType: 'mdo',
          organisationSubType: deptSubType,
          requestedBy: '1238b2e6-8ac1-4462-b36a-19a9b48a7e94',
        },
      }
      return this.http.post<any>(`${API_END_POINTS.CREATE_DEPARTMENT}`, departmentData)
    }
    return EMPTY
  }
  updateDepartment(deptData: any, updateId: number): Observable<any> {
    const departmentData = {
      id: updateId,
      rootOrg: DEPARTMENT_NAME,
      deptName: deptData.name,
      deptTypeIds: '',
      description: '',
      headquarters: deptData.head,
      logo: deptData.fileUpload,
    }
    return this.http.patch<any>(`${API_END_POINTS.UPDATE_DEPARTMENT}`, departmentData)
  }
  assignAdminToDepartment(userId: string, deptId: string, deptRole: string): Observable<any> {
    const departmentData = {
      userId,
      deptId,
      roles: [deptRole],
      isActive: true,
      isBlocked: false,
    }
    return this.http.post<any>(`${API_END_POINTS.ASSIGN_ADMIN_TO_CREATED_DEPARTMENT}/userrole`, departmentData)
  }
}
