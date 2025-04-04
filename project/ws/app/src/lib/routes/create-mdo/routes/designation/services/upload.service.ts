import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject, Observable } from 'rxjs'
import { finalize } from 'rxjs/operators'
import { HttpClient, HttpResponse } from '@angular/common/http'
import * as fileSaver from 'file-saver'
import { MatSnackBar } from '@angular/material/snack-bar'

const API_ENDPOINTS = {
  // bulkUpload: `/apis/proxies/v8/user/v1/bulkupload`,
  bulkUpload: `/apis/proxies/v8/user/v2/bulkupload`, // csv support
  downloadReport: `/apis/protected/v8/admin/userRegistration/bulkUploadReport`,
  getBulkUploadData: '/apis/proxies/v8/user/v1/bulkupload',
  getBulkApproval: '/apis/proxies/v8/workflow/admin/bulkupdate/getstatus',
  // bulkApprovalUpload: `/apis/proxies/v8/workflow/admin/transition/bulkupdate`,
  bulkApprovalUpload: '/apis/proxies/v8/workflow/admin/v2/bulkupdate/transition', // csv support

  // Bulk Upload Designation
  BULK_UPLOAD_SAMPLE_FILE: (frameworkId: string) =>
    `/apis/proxies/v8/designation/v1/orgMapping/sample/${frameworkId}`,
  BULK_UPLOAD_DESIGNATION: (frameworkId: string) =>
    `/apis/proxies/v8/designation/v1/orgMapping/bulkUpload/${frameworkId}`,
  GET_BULK_UPLOAD_DESIGNATION_DATA: (rootOrgId: string) =>
    `/apis/proxies/v8/designation/v1/orgMapping/bulkUpload/progress/details/${rootOrgId}`,
  GET_BULK_UPLOAD_DESIGNATION_STATUS: (filePath: string) =>
    `/apis/proxies/v8/designation/v1/orgMapping/download/${filePath}`,

  // Bulk Upload Competency Designation
  BULK_UPLOAD_COMPETENCY_SAMPLE_FILE: (frameworkId: string) =>
    `/apis/proxies/v8/organisation/v1/getCompetencyDesignationMappingFile/sample/${frameworkId}`,
  BULK_UPLOAD_COMPETENCY: (frameworkId: string) =>
    `/apis/proxies/v8/organisation/v1/competencyDesignationMappings/bulkUpload/${frameworkId}`,
  GET_BULK_UPLOAD_COMPETENCY_DATA: (rootOrgId: string) =>
    `/apis/proxies/v8/organisation/v1/competencyDesignationMappings/bulkUpload/progress/details/${rootOrgId}`,
  GET_BULK_UPLOAD_COMPETENCY_STATUS: (filePath: string) =>
    `/apis/proxies/v8/organisation/v1/competencyDesignationMappings/download/${filePath}`,

}

@Injectable()
export class FileService {
  // tslint:disable-next-line: prefer-array-literal
  private fileList: string[] = new Array<string>()
  private fileList$: Subject<string[]> = new Subject<string[]>()
  private displayLoader$: Subject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private http: HttpClient, private matSnackBar: MatSnackBar) {

  }

  public isLoading(): Observable<boolean> {
    return this.displayLoader$
  }

  public upload(_fileName: string, fileContent: FormData): Observable<any> {
    this.displayLoader$.next(true)
    return this.http.post<any>(API_ENDPOINTS.bulkUpload, fileContent)
      .pipe(finalize(() => this.displayLoader$.next(false)))
  }

  public download(filePath: string, downloadAsFileName: string): void {
    this.http.get(filePath, { responseType: 'blob' }).subscribe((res: any) => {
      fileSaver.saveAs(res, downloadAsFileName)
    })
  }

  public downloadWithDispositionName(filePath: string, downloadAsFileName?: string): void {
    this.displayLoader$.next(true)

    this.http.get(filePath, { responseType: 'blob', observe: 'response' })
      .pipe(finalize(() => this.displayLoader$.next(false)))
      .subscribe((res: HttpResponse<Blob>) => {
        if (res.body) {
          const contentDisposition = res.headers.get('Content-Disposition')
          const filename = downloadAsFileName || this.getFilenameFromContentDisposition(contentDisposition)
          fileSaver.saveAs(res.body, filename || 'sample.xlsx')
        }

      },         () => (this.matSnackBar.open('Could not download the file')
      ))
  }

  private getFilenameFromContentDisposition(contentDisposition: string | null): string | null {
    if (!contentDisposition) { return null }

    const matches = /filename="(.+?)"/.exec(contentDisposition)
    return matches ? matches[1] : null
  }

  public downloadReport(id: any, name: string) {
    return this.http.get(`${API_ENDPOINTS.downloadReport}/${id}`).subscribe(
      (response: any) => {
        const blobObj = new Blob([new Uint8Array(response.report.data)])
        fileSaver.saveAs(blobObj, `${name.split('.')[0]}-report.csv`)
        return response
      },
    )
  }

  public remove(fileName: any): void {
    this.http.delete('/files/${fileName}').subscribe(() => {
      this.fileList.splice(this.fileList.findIndex(name => name === fileName), 1)
      this.fileList$.next(this.fileList)
    })
  }

  public list(): Observable<string[]> {
    return this.fileList$
  }

  validateFile(name: String) {
    const allowedFormats = ['csv']
    const ext = name.substring(name.lastIndexOf('.') + 1).toLowerCase()
    if (allowedFormats.indexOf(ext) > -1) {
      return true
      // tslint:disable-next-line: no-else-after-return
    } else {
      return false
    }
  }

  validateExcelFile(type: string): boolean {
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]
    return allowedTypes.includes(type)
  }

  async getBulkUploadData() {
    return await this.http.get(`${API_ENDPOINTS.getBulkUploadData}`).toPromise()
  }

  public getBulkUploadDataV1(rootOrgId: any): Observable<any> {
    return this.http.get(`${API_ENDPOINTS.getBulkUploadData}/${rootOrgId}`)
  }

  public getBulkApprovalUploadDataV1(): Observable<any> {
    return this.http.get(`${API_ENDPOINTS.getBulkApproval}`)
  }

  public uploadApproval(_fileName: string, fileContent: FormData): Observable<any> {
    this.displayLoader$.next(true)
    return this.http.post<any>(API_ENDPOINTS.bulkApprovalUpload, fileContent)
      .pipe(finalize(() => this.displayLoader$.next(false)))
  }

  // Bulk Upload Designation
  public downloadBulkUploadSampleFile(frameworkId: string) {
    return API_ENDPOINTS.BULK_UPLOAD_SAMPLE_FILE(frameworkId)
  }

  public bulkUploadDesignation(_fileName: string, fileContent: FormData, frameworkId: string): Observable<any> {
    this.displayLoader$.next(true)
    return this.http.post<any>(API_ENDPOINTS.BULK_UPLOAD_DESIGNATION(frameworkId), fileContent)
      .pipe(finalize(() => this.displayLoader$.next(false)))
  }

  public getBulkDesignationUploadData(rootOrgId: string): Observable<any> {
    return this.http.get(`${API_ENDPOINTS.GET_BULK_UPLOAD_DESIGNATION_DATA(rootOrgId)}`)
  }

  public getBulkDesignationStatus(fileName: string) {
    return API_ENDPOINTS.GET_BULK_UPLOAD_DESIGNATION_STATUS(fileName)
  }

  // Bulk Upload Competency Designation
  public downloadBulkUploadCompetencySampleFile(frameworkId: string) {
    return API_ENDPOINTS.BULK_UPLOAD_COMPETENCY_SAMPLE_FILE(frameworkId)
  }

  public bulkUploadCompetency(_fileName: string, fileContent: FormData, frameworkId: string): Observable<any> {
    this.displayLoader$.next(true)
    return this.http.post<any>(API_ENDPOINTS.BULK_UPLOAD_COMPETENCY(frameworkId), fileContent)
      .pipe(finalize(() => this.displayLoader$.next(false)))
  }

  public getBulkCompetencyUploadData(rootOrgId: string): Observable<any> {
    return this.http.get(`${API_ENDPOINTS.GET_BULK_UPLOAD_COMPETENCY_DATA(rootOrgId)}`)
  }

  public getBulkCompetencyStatus(fileName: string) {
    return API_ENDPOINTS.GET_BULK_UPLOAD_COMPETENCY_STATUS(fileName)
  }

}
