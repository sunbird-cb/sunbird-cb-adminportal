import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
// import { KeycloakService } from 'keycloak-angular'
// import { NSSearch } from '@sunbird-cb/collection'
// import { map } from 'rxjs/operators'
const SLAG_V8 = '/apis/proxies/v8'
const API_END_POINTS = {
  SURVEY_LIST: `${SLAG_V8}/template/api/v1/survey/getSolutions`,
}
@Injectable({
  providedIn: 'root',
})
export class SurveyApiService {
  constructor(private http: HttpClient) { }
  getSurveyResults(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.SURVEY_LIST, request)
  }
}
