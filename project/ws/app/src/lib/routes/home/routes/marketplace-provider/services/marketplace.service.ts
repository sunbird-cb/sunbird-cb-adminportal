import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  CREATE_CONTENTPARTNER: `/apis/proxies/v8/contentpartner/v1/create`,
  UPDATE_CONTENTPARTNER: `/apis/proxies/v8/contentpartner/v1/update`,
  UPLOAD_THUMBNAIL: `apis/proxies/v8/storage/v1/uploadCiosIcon`,
  UPLOAD_CIOS_CONTRACT: `/apis/proxies/v8/storage/v1/uploadCiosContract`,
  GET_PROVIDERS_LIST: `/apis/proxies/v8/contentpartner/v1/search`,
  DELETE_PROVIDER: `/apis/proxies/v8/contentpartner/v1/delete/`,
  GET_PROVIDER_DETAILS: (id: string) => `/apis/proxies/v8/contentpartner/v1/read/${id}`,
  UPLOAD_CONTENT: `/apis/proxies/v8/ciosIntegration/v1/loadContentFromExcel/`,
  UPLOAD_PROGRES: `/apis/proxies/v8/ciosIntegration/v1/loadContentProgressFromExcel/`,
  GET_FILES_LIST: `/apis/proxies/v8/ciosIntegration/v1/file/info/`,
  // GET_CONTENT_LIST: `/apis/proxies/v8/ciosIntegration/v1/readAllContentFromDb`,
  GET_CONTENT_LIST: `apis/proxies/v8/ciosIntegration/v1/search/content`,
  DELETE_NOT_PULISHED_COURSES: 'apis/proxies/v8/ciosIntegration/v1/deleteContent',
  DOWNLOAD_LOG: (gcpfileName: string) => `/apis/proxies/v8/storage/v1/downloadCiosLogs/${gcpfileName}`,
  CREATE_CONFIGURATION: `apis/proxies/v8/serviceregistry/config/create`,
  UPDATE_CONFIGURATION: `apis/proxies/v8/serviceregistry/config/update`,
  GET_CONFIGURATION: (configurationId: string) => `apis/proxies/v8/serviceregistry/config/read/${configurationId}`,
}

@Injectable({
  providedIn: 'root',
})
export class MarketplaceService {

  constructor(
    private http: HttpClient,
  ) { }

  createProvider(formBody: any) {
    return this.http.post(`${API_END_POINTS.CREATE_CONTENTPARTNER}`, formBody)
  }

  updateProvider(formBody: any) {
    return this.http.post(`${API_END_POINTS.UPDATE_CONTENTPARTNER}`, formBody)
  }

  uploadThumbNail(
    icon: any
  ): Observable<any> {
    const file = icon.get('content') as File
    const fileName = file.name
    const newFormData = new FormData()
    newFormData.append('file', file, fileName)
    const url = `${API_END_POINTS.UPLOAD_THUMBNAIL}`
    return this.http.post<any>(
      url,
      newFormData
    )
  }

  uploadCIOSContract(
    data: any
  ): Observable<any> {
    const file = data.get('content') as File
    const fileName = file.name
    const newFormData = new FormData()
    newFormData.append('file', file, fileName)
    const url = `${API_END_POINTS.UPLOAD_CIOS_CONTRACT}`
    return this.http.post<any>(
      url,
      newFormData
    )
  }

  getProvidersList(formBody: any) {
    return this.http.post(`${API_END_POINTS.GET_PROVIDERS_LIST}`, formBody)
  }

  deleteProvider(providerId: string) {
    return this.http.delete(`${API_END_POINTS.DELETE_PROVIDER}${providerId}`)
  }

  getProviderDetails(id: string) {
    return this.http.get(API_END_POINTS.GET_PROVIDER_DETAILS(id))
  }

  getContentList(providerId: any) {
    return this.http.get(`${API_END_POINTS.GET_FILES_LIST}${providerId}`)
  }

  uploadContent(
    data: any,
    partnerCode: string,
    partnerId: string
  ): Observable<any> {
    const file = data.get('content') as File
    const fileName = file.name
    const newFormData = new FormData()
    newFormData.append('file', file, fileName)
    const url = `${API_END_POINTS.UPLOAD_CONTENT}${partnerCode}/${partnerId}`
    return this.http.post<any>(
      url,
      newFormData
    )
  }

  uploadProgress(
    data: any,
    partnerCode: string
  ): Observable<any> {
    const file = data.get('content') as File
    const newFormData = new FormData()
    newFormData.append('file', file)
    const url = `${API_END_POINTS.UPLOAD_PROGRES}${partnerCode}`
    return this.http.post<any>(
      url,
      newFormData
    )
  }

  getCoursesList(formBody: any) {
    return this.http.post<any>(`${API_END_POINTS.GET_CONTENT_LIST}`, formBody)
  }

  // deleteCourse(courseId: string) {
  //   return this.http.delete(`${API_END_POINTS.DELETE_COURSE}${courseId}`)
  // }

  deleteUnPublishedCourses(formBody: any) {
    return this.http.post<any>(`${API_END_POINTS.DELETE_NOT_PULISHED_COURSES}`, formBody, { responseType: 'text' as 'json' })
  }

  downloadLogs(gcpfileName: string) {
    return this.http.get<any>(API_END_POINTS.DOWNLOAD_LOG(gcpfileName), { responseType: 'blob' as 'json' })
  }

  //#region (via api)
  createConfiguration(formBody: any) {
    return this.http.post(`${API_END_POINTS.CREATE_CONFIGURATION}`, formBody)
  }

  updateConfiguration(formBody: any) {
    return this.http.post(`${API_END_POINTS.UPDATE_CONFIGURATION}`, formBody)
  }

  getConfiguraionDetails(configurationId: string) {
    return this.http.get(`${API_END_POINTS.GET_CONFIGURATION(configurationId)}`)
  }
  //#endregion
}
