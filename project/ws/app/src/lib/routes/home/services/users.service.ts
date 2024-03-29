import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  GET_ALL_USERS: '/apis/protected/v8/portal/spv/mydepartment?allUsers=true',
  GET_ALL_DEPARTMENTS: '/apis/protected/v8/portal/spv/department',
  GET_MY_DEPARTMENT: '/apis/protected/v8/portal/spv/mydepartment?allUsers=true',
  CREATE_USER: '/apis/protected/v8/user/profileDetails/createUser',
  PROFILE_REGISTRY: 'apis/protected/v8/user/profileRegistry/getUserRegistryByUser/',
  CREATE_PROFILE_REGISTRY: 'apis/protected/v8/user/profileRegistry/createUserRegistryV2',
  ADD_USER_TO_DEPARTMENT: 'apis/protected/v8/portal/deptAction',
  WF_HISTORY_BY_APPID: 'apis/protected/v8/workflowhandler/historyByApplicationId/',
  SEARCH_USER: 'apis/protected/v8/user/autocomplete',
  USER_BDD: '/apis/protected/v8/portal/spv/deptAction/userrole',
  GET_ALL_KONG_USER: '/apis/proxies/v8/user/v1/search',
  GET_ALL_DEPARTMENTS_KONG: '/apis/proxies/v8/org/v1/read',
  NEW_USER_BLOCK_API: '/apis/proxies/v8/user/v1/block',
  NEW_USER_UN_BLOCK_API: '/apis/proxies/v8/user/v1/unblock',
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) { }
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ALL_USERS}`)
  }
  getAllKongUsers(depId: string): Observable<any> {
    const reqBody = {
      request: {
        filters: {
          rootOrgId: depId,
        },
      },
    }
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_KONG_USER}`, reqBody)
  }

  getAllDepartments(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ALL_DEPARTMENTS}`)
  }

  getMyDepartment(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_MY_DEPARTMENT}`)
  }

  createUser(req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.CREATE_USER, req)
  }

  getUserById(userid: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.PROFILE_REGISTRY + userid)
  }

  createUserById(id: any, req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.CREATE_PROFILE_REGISTRY}/${id}`, req)
  }

  addUserToDepartment(req: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.USER_BDD}`, req)
  }

  getWfHistoryByAppId(appid: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.WF_HISTORY_BY_APPID + appid)
  }

  onSearchUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.SEARCH_USER}/${email}`)
  }
  blockUser(user: object): Observable<any> {
    return this.http.patch<any>(`${API_END_POINTS.USER_BDD}/`, user)
  }
  deActiveUser(user: object): Observable<any> {
    return this.http.patch<any>(`${API_END_POINTS.USER_BDD}/`, user)
  }
  deleteUser(user: object): Observable<any> {
    return this.http.patch<any>(`${API_END_POINTS.USER_BDD}/`, user)
  }
  getAllDepartmentsKong(organaizationId: string): Observable<any> {
    const orgId = {
      request: {
        organisationId: organaizationId,
      },
    }
    return this.http.post<any>(`${API_END_POINTS.GET_ALL_DEPARTMENTS_KONG}`, orgId)
  }
  newBlockUserKong(loggedInUser: string, userId: string): Observable<any> {
    const org = {
      request: {
        userId,
        requestedBy: loggedInUser,
      },
    }
    return this.http.post<any>(`${API_END_POINTS.NEW_USER_BLOCK_API}`, org)
  }
  newUnBlockUserKong(loggedInUser: string, userId: string): Observable<any> {
    const org = {
      request: {
        userId,
        requestedBy: loggedInUser,
      },
    }
    return this.http.post<any>(`${API_END_POINTS.NEW_USER_UN_BLOCK_API}`, org)
  }
}
