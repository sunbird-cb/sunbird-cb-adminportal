import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

@Injectable()
export class RejectedRequestsResolve
   {
  requestType: any
  url: any
  pageLimit = 1000
  constructor(private http: HttpClient) { }
  resolve(): any {
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
      applicationStatus: 'REJECTED',
      limit: this.pageLimit,
      offset: 0,
      deptName: 'iGOT',
    }
    setTimeout(() => {
      return this.http.post(this.url, reqbody).pipe(
        map((datanew: any) => ({
          data: this.requestType === 'domain' ? datanew.result : datanew.result.data, error: null,
        })),
        catchError(error => of({ error, data: null })),
      )
    },         1000)

  }
}
