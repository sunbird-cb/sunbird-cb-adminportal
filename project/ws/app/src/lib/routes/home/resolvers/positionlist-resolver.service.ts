import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

@Injectable()
export class ApprovedlistResolve
  implements
  Resolve<any> {
  requestType: any
  url: any
  constructor(private http: HttpClient) { }
  resolve(): Observable<any> {
    this.url = '/apis/proxies/v8/user/v1/positions'
    return this.http.get(this.url).pipe(
      map((datanew: any) => ({
        data: datanew.responseData, error: null,
      })),
      catchError(error => of({ error, data: null })),
    )
  }
}
