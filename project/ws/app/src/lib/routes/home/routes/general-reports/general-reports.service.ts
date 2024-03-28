import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigurationsService } from '@sunbird-cb/utils'

@Injectable({
  providedIn: 'root',
})
export class GeneralReportsService {

  GENERAL_REPORTS = '/apis/proxies/v8/storage/v1/spvReportInfo'

  constructor(private configSvc: ConfigurationsService,
    private http: HttpClient) { }

  getContent() {
    return this.http.get<any>(`${this.configSvc.baseUrl}/feature/general-reports.json`)
  }

  getReportContnet(rdate: any) {
    return this.http.get<any>(`${this.GENERAL_REPORTS}/${rdate}`)
  }

}
