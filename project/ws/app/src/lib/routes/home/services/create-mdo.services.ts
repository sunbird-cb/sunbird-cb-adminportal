import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'

const API_END_POINTS = {
  GET_ALL_DEPARTMENTS: '/apis/protected/v8/portal/departmentType/',
  CREATE_DEPARTMENT: '/apis/proxies/v8/org/v1/create',
  UPDATE_DEPARTMENT: '/apis/proxies/v8/org/v1/update',
  ASSIGN_ADMIN_TO_CREATED_DEPARTMENT: '/apis/proxies/v8/user/private/v1/assign/role',
  GET_DEPARTMENT_BY_ID: '/apis/protected/v8/portal/deptAction/',
  MIGRATE_DEPARTMENT: '/apis/proxies/v8/user/private/v1/migrate',
  GET_ALL_STATES: '/apis/public/v8/org/v1/list',
  GET_DEPARTMENTS_OF_STATE: '/apis/public/v8/org/v1/list',
  GET_ORGS_OF_DEPT: '/apis/public/v8/org/v1/list',
  CREATE_STATE_OR_MINISTRY: '/apis/proxies/v8/org/ext/v1/create',
  UPDATE_STATE_OR_MINISTRY: '/apis/proxies/v8/org/ext/v1/update',
}

@Injectable({
  providedIn: 'root',
})
export class CreateMDOService {
  searchedUserdata = new BehaviorSubject<any>({ "filteredData": [] })
  adminButton = new BehaviorSubject<any>(false)
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
  updateDepartment(updateId: number, deptType: string, depatment: string, loggedInUserId: string, deptvalue: any): Observable<any> {
    const departmentData = {
      request: {
        orgName: deptvalue.name,
        channel: deptvalue.name,
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
  migrateDepartment(userId: string, deptName: string): Observable<any> {
    const departmentData = {
      request: {
        userId,
        channel: deptName,
        forceMigration: true,
        softDeleteOldOrg: true,
        notifyMigration: false,
      },
    }
    return this.http.patch<any>(`${API_END_POINTS.MIGRATE_DEPARTMENT}`, departmentData)
  }

  getStatesOrMinisteries(type: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ALL_STATES}/${type}`)
  }
  getDeparmentsOfState(stateId: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_DEPARTMENTS_OF_STATE}/${stateId}`)
  }
  getOrgsOfDepartment(deptId: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ORGS_OF_DEPT}/${deptId}`)
  }
  createStateOrMinistry(req: any): Observable<any> {
    const request = {
      request: req,
    }
    return this.http.post<any>(`${API_END_POINTS.CREATE_STATE_OR_MINISTRY}`, request)
  }
  updateStateOrMinistry(req: any): Observable<any> {
    const request = {
      request: req,
    }
    return this.http.post<any>(`${API_END_POINTS.UPDATE_STATE_OR_MINISTRY}`, request)
  }
}
