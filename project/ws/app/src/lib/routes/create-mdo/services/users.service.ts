import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  USERS: '/apis/protected/v8/user/roles/getUsersV2',
  ALL_USERS_BY_DEPARTMENT: '/apis/protected/v8/portal/spv/department',
  GET_ALL_KONG_USER: '/apis/proxies/v8/user/v1/search',
  SEARCH_USER_TABLE: '/apis/proxies/v8/user/v1/search',
  SEND_OTP: '/apis/proxies/v8/otp/v1/generate',
  RESEND_OTP: '/apis/proxies/v8/otp/v1/generate',
  VERIFY_OTP: '/apis/proxies/v8/otp/v1/verify',
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) { }
  getUsers(role: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.USERS}/${role}/`)
  }
  getUsersByDepartment(userId: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.ALL_USERS_BY_DEPARTMENT}/${userId}/?allUsers=true`)
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

  searchUserByenter(value: string, rootOrgId: string) {
    const reqBody = {
      request: {
        query: value,
        filters: {
          rootOrgId,
        },
      },
    }

    return this.http.post<any>(`${API_END_POINTS.SEARCH_USER_TABLE}`, reqBody)
  }


  sendOtp(value: any, type: string): Observable<any> {
    const reqObj = {
      request: {
        type: `${type}`,
        key: `${value}`,
      },
    }
    return this.http.post(API_END_POINTS.SEND_OTP, reqObj)
  }
  resendOtp(value: any, type: string) {
    const reqObj = {
      request: {
        type: `${type}`,
        key: `${value}`,
      },
    }
    return this.http.post(API_END_POINTS.RESEND_OTP, reqObj)

  }
  verifyOTP(otp: number, value: any, type: string) {
    const reqObj = {
      request: {
        otp,
        type: `${type}`,
        key: `${value}`,
      },
    }
    return this.http.post(API_END_POINTS.VERIFY_OTP, reqObj)

  }

}
