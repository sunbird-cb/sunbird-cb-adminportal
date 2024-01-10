import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigurationsService } from '@sunbird-cb/utils'

@Injectable({
  providedIn: 'root'
})
export class AcbpReportsService {

  ACBP_REPORTS = '/apis/proxies/v8/storage/v1/spvReportInfo'

  constructor(private configSvc: ConfigurationsService,
    private http: HttpClient) { }

  getAcbpContent() {
    return this.http.get<any>(`${this.configSvc.baseUrl}/feature/acbp-reports.json`)
  }

  getAcbpReportContnet(rdate: any) {
    return this.http.get<any>(`${this.ACBP_REPORTS}/${rdate}`)
  }

}
