import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigurationsService } from '@sunbird-cb/utils'

@Injectable({
  providedIn: 'root'
})
export class CommsService {

  constructor(private configSvc: ConfigurationsService,
    private http: HttpClient) { }

  getCommsContent() {
    return this.http.get<any>(`${this.configSvc.baseUrl}/feature/comms.json`)
  }

}
