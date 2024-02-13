import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
// import { IResolveResponse } from '@sunbird-cb/utils'
// import { RequestsService } from '../services/onboarding-requests.service'

@Injectable()
export class ApprovedRequestsResolve
  implements
  Resolve<any> {
  requestType: any
  url: any
  pageLimit = 1000
  constructor(private http: HttpClient) { }
  resolve(): Observable<any> {
    const reqArray = window.location.pathname.split('requests/')
    this.requestType = reqArray[1]
    if (this.requestType === 'designation') {
      this.requestType = 'position'
    }

    if (this.requestType === 'position') {
      this.url = '/apis/proxies/v8/workflow/position/search'
    } else if (this.requestType === 'organisation') {
      this.url = '/apis/proxies/v8/workflow/org/search'
    } else if (this.requestType === 'domain') {
      this.url = '/apis/proxies/v8/workflow/domain/search'
      this.pageLimit = 20
    }
    const reqbody = {
      serviceName: this.requestType,
      applicationStatus: 'APPROVED',
      limit: this.pageLimit,
      offset: 0,
      deptName: 'iGOT',
    }
    return this.http.post(this.url, reqbody).pipe(
      map((datanew: any) => ({
        data: this.requestType === 'domain' ? datanew.result : datanew.result, error: null,
      })),
      catchError(error => of({ error, data: null })),
    )
  }
}
