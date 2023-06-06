import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

@Injectable()
export class RejectedRequestsResolve
  implements
  Resolve<any> {
  requestType: any
  url: any
  constructor(private http: HttpClient) { }
  resolve(): Observable<any> {
    const reqArray = window.location.pathname.split('requests/')
    this.requestType = reqArray[1]

    if (this.requestType === 'position') {
      this.url = '/apis/proxies/v8/workflow/position/search'
    } else if (this.requestType === 'organisation') {
      this.url = '/apis/proxies/v8/workflow/org/search'
    } else if (this.requestType === 'domain') {
      this.url = '/apis/proxies/v8/workflow/domain/search'
    }
    const reqbody = {
      serviceName: this.requestType,
      applicationStatus: 'REJECTED',
      limit: 1000,
      offset: 0,
      deptName: 'iGOT',
    }
    return this.http.post(this.url, reqbody).pipe(
      map((datanew: any) => ({
        data: datanew.result.data, error: null,
      })),
      catchError(error => of({ error, data: null })),
    )
  }
}
