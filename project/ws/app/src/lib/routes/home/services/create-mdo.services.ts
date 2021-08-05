import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  GET_ALL_DEPARTMENTS: '/apis/protected/v8/portal/departmentType/',
  CREATE_DEPARTMENT: '/apis/proxies/v8/org/v1/create',
  UPDATE_DEPARTMENT: '/apis/proxies/v8/org/v1/update',
  ASSIGN_ADMIN_TO_CREATED_DEPARTMENT: '/apis/proxies/v8/user/private/v1/assign/role',
  GET_DEPARTMENT_BY_ID: '/apis/protected/v8/portal/deptAction/',
  MIGRATE_DEPARTMENT: '/apis/proxies/v8/user/private/v1/migrate',
}

@Injectable({
  providedIn: 'root',
})
export class CreateMDOService {
  constructor(private http: HttpClient) { }
  getAllSubDepartments(deptName: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ALL_DEPARTMENTS}${deptName}`)
  }
  createDepartment(deptData: any, deptType: string, depatment: string, loggedInUserId: string): Observable<any> {
    const departmentData = {
      request: {
        orgName: deptData.name,
        channel: deptData.name,
        isTenant: true,
        organisationType: depatment.toLowerCase(),
        organisationSubType: deptType.toLowerCase(),
        requestedBy: loggedInUserId,
      },
    }
    return this.http.post<any>(`${API_END_POINTS.CREATE_DEPARTMENT}`, departmentData)
  }
  updateDepartment(updateId: number, deptType: string, depatment: string, loggedInUserId: string): Observable<any> {
    const departmentData = {
      request: {
        // orgName: deptData.name,
        // channel: deptData.name,
        // isTenant: true,
        // organisationType: depatment.toLowerCase(),
        // organisationSubType: deptType.toLowerCase(),
        // requestedBy: loggedInUserId,
        organisationId: updateId,
        organisationType: depatment.toLowerCase(),
        organisationSubType: deptType.toLowerCase(),
        requestedBy: loggedInUserId,
      },
    }
    return this.http.patch<any>(`${API_END_POINTS.UPDATE_DEPARTMENT}`, departmentData)
  }
  assignAdminToDepartment(userId: string, deptId: string, deptRole: string): Observable<any> {
    const departmentData = {
      request: {
        userId,
        organisationId: deptId,
        roles: deptRole,
      },
    }
    return this.http.post<any>(`${API_END_POINTS.ASSIGN_ADMIN_TO_CREATED_DEPARTMENT}`, departmentData)
  }
  migrateDepartment(userId: string, deptId: string): Observable<any> {
    const departmentData = {
      request: {
        userId,
        rootOrgId: deptId,
        forceMigration: true,
        softDeleteOldOrg: true,
        notifyMigration: false,
      },
    }
    return this.http.patch<any>(`${API_END_POINTS.MIGRATE_DEPARTMENT}`, departmentData)
  }
}
