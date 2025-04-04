import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MarketplaceService } from '../../services/marketplace.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import * as _ from 'lodash'
import { HttpErrorResponse } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router'
import { JsonEditorOptions } from 'ang-jsoneditor'

@Component({
  selector: 'ws-app-via-api',
  templateUrl: './via-api.component.html',
  styleUrls: ['./via-api.component.scss'],
})
export class ViaApiComponent implements OnInit, OnChanges {
  //#region (global varialbles)
  //#region (view chaild, input and output)
  @Input() providerDetails?: any
  @Input() viaApiTabIndex = 0
  @Input() tabIndex = -1

  @Output() loadProviderDetails = new EventEmitter<Boolean>()
  //#endregion

  servicesFormGroup!: FormGroup
  viaApiFormGroup!: FormGroup
  headersFormGroup!: FormGroup
  paramsFormGroup!: FormGroup
  bodyFormGroup!: FormGroup
  apiTypesList: any[] = []
  delayTabLoad = true

  //#region (transformation variables)
  transforamtionForm!: FormGroup
  editorOptions = new JsonEditorOptions()
  transformationsUpdated = false
  providerConfiguration: any
  configured = false
  //#endregion
  //#endregion

  constructor(
    private formBuilder: FormBuilder,
    private marketPlaceSvc: MarketplaceService,
    private snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute
  ) {
    this.getRoutesData()
    // this.initializaTion()
  }

  getRoutesData() {
    this.activateRoute.data.subscribe(data => {
      if (data.pageData.data) {
        this.providerConfiguration = data.pageData.data
      }
      this.initializaTion()
    })
  }

  initializaTion() {
    this.servicesFormGroup = this.formBuilder.group({
      serviceName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/)]),
      serviceCode: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/)]),
      serviceDescription: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_$/:\[\] ' !]*$/)]),
      strictCache: new FormControl(false),
      strictCacheTimeInMinutes: new FormControl()
    })

    this.viaApiFormGroup = this.formBuilder.group({
      apiType: new FormControl('', [Validators.required]),
      apiUrl: new FormControl('', Validators.required),
    })

    this.paramsFormGroup = this.formBuilder.group({
      tableListFormArray: this.formBuilder.array([]),
    })

    this.headersFormGroup = this.formBuilder.group({
      tableListFormArray: this.formBuilder.array([]),
    })

    this.bodyFormGroup = this.formBuilder.group({
      tableListFormArray: this.formBuilder.array([]),
      bodyType: new FormControl('urlencoded'),
      rawData: new FormControl(''),
    })

    this.apiTypesList = [
      {
        type: 'Get',
        value: 'GET',
      },
      {
        type: 'Post',
        value: 'POST',
      },
    ]

    this.editorOptions.mode = 'text'
    this.editorOptions.mainMenuBar = false
    this.editorOptions.navigationBar = false
    this.editorOptions.statusBar = false
    this.editorOptions.enableSort = false
    this.editorOptions.enableTransform = false

    this.transforamtionForm = this.formBuilder.group({
      transformContent: new FormControl({}, Validators.required)
    })

    // this.transforamtionForm = this.formBuilder.group({})
    // let trasformationJson: any = {}
    // trasformationJson = _.get(this.providerConfiguration, 'transformContentViaApi[0].spec')

    // if (trasformationJson) {
    //   Object.entries(trasformationJson).forEach(([key, path]) => {
    //     const transFormContentKeysAndControl: {
    //       lable: string,
    //       controlName: string,
    //       path: string
    //     } = {
    //       lable: key,
    //       controlName: key.replace(' ', ''),
    //       path: path as string,
    //     }
    //     this.transforamtionForm.addControl(key.replace(' ', ''), new FormControl('', Validators.required))
    //     this.transFormContentKeysAndControls.push(transFormContentKeysAndControl)
    //   })
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.viaApiTabIndex && changes.viaApiTabIndex.currentValue === this.tabIndex) {
      this.delayTabLoad = false
    }
    if (changes.providerDetails && changes.providerDetails.previousValue === undefined) {
      this.getCoursesConfiguration()
    }
  }

  getCoursesConfiguration() {
    const contentApisId = _.get(this.providerDetails, 'serviceRegistryDetails.contentApisId', null)
    if (contentApisId) {
      this.marketPlaceSvc.getConfiguraionDetails(contentApisId).subscribe((responce: any) => {
        this.patchFormData(responce)
      })
    } else {
      const transformContent = _.get(this.providerConfiguration, 'transformContentViaApi')
      this.transforamtionForm.controls.transformContent.patchValue(transformContent)
    }
  }

  patchFormData(configurationDetails: any) {
    const urlSplit = _.get(configurationDetails, 'url').split('?byProgramIds=F3F_2DjnR0Wxf9g45zdFsg')
    const headerMap = _.get(configurationDetails, 'requestPayload.headerMap')
    const urlMap = _.get(configurationDetails, 'requestPayload.urlMap')
    const requestMap = _.get(configurationDetails, 'requestPayload.requestMap')
    this.servicesFormGroup.setValue({
      serviceName: _.get(configurationDetails, 'serviceName'),
      serviceCode: _.get(configurationDetails, 'serviceCode'),
      serviceDescription: _.get(configurationDetails, 'serviceDescription'),
      strictCache: _.get(configurationDetails, 'requestPayload.strictCache', false),
      strictCacheTimeInMinutes: _.get(configurationDetails, 'requestPayload.strictCacheTimeInMinutes', 0)
    })
    this.servicesFormGroup.controls.serviceCode.disable()
    this.viaApiFormGroup.setValue({
      apiType: _.get(configurationDetails, 'requestMethod'),
      apiUrl: urlSplit[0],
    })

    if (headerMap) {
      this.pushObjectToFormArray(this.headersFormGroup.controls.tableListFormArray as FormArray, headerMap)
    }

    if (urlMap) {
      this.pushObjectToFormArray(this.paramsFormGroup.controls.tableListFormArray as FormArray, urlMap)
    }

    if (requestMap) {
      if (configurationDetails.isFormData) {
        this.bodyFormGroup.controls.bodyType.patchValue('urlencoded')
        this.pushObjectToFormArray(this.bodyFormGroup.controls.tableListFormArray as FormArray, requestMap)
      } else {
        this.bodyFormGroup.controls.bodyType.patchValue('raw')
        this.bodyFormGroup.controls.rawData.patchValue(requestMap)
      }
    }

    const transformContent = _.get(configurationDetails, 'transformContentViaApi', _.get(this.providerConfiguration, 'transformContentViaApi'))
    this.transforamtionForm.controls.transformContent.patchValue(transformContent)

  }

  pushObjectToFormArray(formArray: FormArray, object: any) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const formGroup = this.formBuilder.group({
          key: new FormControl(key),
          value: new FormControl(object[key]),
        })
        formArray.insert(formArray.length - 1, formGroup)
      }
    }
  }

  ngOnInit(): void {
    // this.getCoursesConfiguration()
  }

  getControlValidation(controlName: string, validator: string): Boolean {
    const control = this.servicesFormGroup.get(controlName)
    if (control && control.errors && control.errors[validator]) {
      return true
    }
    return false
  }

  getTextLength(controlName: string) {
    return _.get(this.servicesFormGroup.get(controlName), 'value.length', 0)
  }

  onToggleChange() {
    if (this.servicesFormGroup.controls.strictCache.value) {
      this.servicesFormGroup.controls.strictCacheTimeInMinutes.setValidators([Validators.required])
    } else {
      this.servicesFormGroup.controls.strictCacheTimeInMinutes.clearValidators()
    }
    this.servicesFormGroup.controls.strictCacheTimeInMinutes.updateValueAndValidity()
  }

  configure() {
    this.configured = true
    if (this.servicesFormGroup.valid && this.viaApiFormGroup.valid && this.transformationsUpdated) {
      // if (this.servicesFormGroup.valid && this.viaApiFormGroup.valid) {
      const formBody: any = this.generatCoursesConfiguration()
      if (_.get(this.providerDetails, 'serviceRegistryDetails.contentApisId', null)) {
        formBody['id'] = _.get(this.providerDetails, 'serviceRegistryDetails.contentApisId')
        this.marketPlaceSvc.updateConfiguration(formBody).subscribe({
          next: responce => {
            if (responce) {
              const message = 'Courses get api configuration updated successfully'
              this.showSnackBar(message)
            }
          },
          error: (error: HttpErrorResponse) => {
            const errmsg = _.get(error, 'message', 'Some thing went wrong please try again')
            this.showSnackBar(errmsg)
          },
        })
      } else {
        this.marketPlaceSvc.createConfiguration(formBody).subscribe({
          next: (responce: any) => {
            if (responce) {
              if (this.providerDetails['serviceRegistryDetails']) {
                this.providerDetails['serviceRegistryDetails']['contentApisId'] = responce.id
              } else {
                this.providerDetails['serviceRegistryDetails'] = {
                  contentApisId: responce.id,
                }
              }
              this.updateProviderDetails()
            }
          },
          error: (error: HttpErrorResponse) => {
            const errmsg = _.get(error, 'message', 'Some thing went wrong please try again')
            this.showSnackBar(errmsg)
          },
        })
      }
    } else {
      this.servicesFormGroup.markAllAsTouched()
      this.viaApiFormGroup.markAllAsTouched()
      this.transforamtionForm.markAllAsTouched()
      if (!this.transformationsUpdated) {
        const message = 'Please update transform content'
        this.showSnackBar(message)
      }
    }
  }

  generatCoursesConfiguration() {
    const serviceDetails = this.servicesFormGroup.value
    serviceDetails['serviceCode'] = this.servicesFormGroup.controls.serviceCode.value.toUpperCase()
    const params = this.getParamsAndUrl()
    const isFormData = this.bodyFormGroup.value.tableListFormArray[0].key ? true : false
    const formBody = {
      isFormData,
      requestMethod: this.viaApiFormGroup.controls.apiType.value,
      url: params.url,
      serviceCode: serviceDetails.serviceCode,
      serviceName: serviceDetails.serviceName,
      serviceDescription: serviceDetails.serviceDescription,
      operationType: 'PEER_TO_PEER',
      urlPlaceholder: params.urlPlaceholder,
      isActive: true,
      isSecureHeader: true,
      urlSegment: null,
      hostAddress: null,
      partnerCode: _.get(this.providerDetails, 'data.partnerCode'),
      requestPayload: {
        requestMap: isFormData ? this.generateObjectFromForm(this.bodyFormGroup.value.tableListFormArray) : this.bodyFormGroup.value.rawData,
        headerMap: this.generateObjectFromForm(this.headersFormGroup.value.tableListFormArray),
        urlMap: this.generateObjectFromForm(this.paramsFormGroup.value.tableListFormArray, true),
        strictCache: serviceDetails.strictCache,
        strictCacheTimeInMinutes: serviceDetails.strictCacheTimeInMinutes
      },
    }
    return formBody
  }

  getParamsAndUrl() {
    const parmsAndUrl = {
      url: `${this.viaApiFormGroup.controls.apiUrl.value}?byProgramIds=F3F_2DjnR0Wxf9g45zdFsg`,
      urlPlaceholder: '',
    }
    const params = this.paramsFormGroup.value.tableListFormArray
    if (params && params[0].key) {
      params.forEach((element: any) => {
        if (element.key) {
          parmsAndUrl.url = `${parmsAndUrl.url}&${element['key']}={${element['key']}}`
          parmsAndUrl.urlPlaceholder =
            `${parmsAndUrl.urlPlaceholder}${parmsAndUrl.urlPlaceholder.length === 0 ? '{' : ',{'}${element['key']}}`
        }
      })
    }
    return parmsAndUrl
  }

  generateObjectFromForm(form: any, isParams = false) {
    const generatedObject: any = {}
    if (form && form[0] && form[0].key) {
      form.forEach((element: any) => {
        if (element.key) {
          generatedObject[element.key] = isParams ? `{${element.key}}` : element.value
        }
      })
    }
    return generatedObject
  }

  upDateTransforamtionDetails() {
    this.providerDetails['data']['isActive'] = true
    const hasTransformationAlready = this.providerDetails['transformContentViaApi'] ? true : false
    this.transforamtionForm.markAllAsTouched()
    if (this.transforamtionForm.valid) {
      // const trasformContentSpec: any = {}
      // const specValues = this.transforamtionForm.controls.transformContent.value
      // this.transFormContentKeysAndControls.forEach((transFormContent: any) => {
      //   trasformContentSpec[specValues[transFormContent.controlName]] = transFormContent.path
      // })

      // if (hasTransformationAlready) {
      //   this.providerDetails['transformContentViaApi'][0]['spec'] = trasformContentSpec
      // } else {
      //   const transformContentViaApi = this.providerConfiguration.transformContentViaApi
      //   transformContentViaApi[0]['spec'] = trasformContentSpec
      //   this.providerDetails['transformContentViaApi'] = transformContentViaApi
      // }
      this.providerDetails['transformContentViaApi'] = this.transforamtionForm.controls.transformContent.value
      this.marketPlaceSvc.updateProvider(this.providerDetails).subscribe({
        next: (responce: any) => {
          if (responce) {
            setTimeout(() => {
              let successMsg = 'Saved Successfully'
              successMsg = hasTransformationAlready ? 'Transform Content updated successfully.' : 'Transform Content saved successfully.'
              this.showSnackBar(successMsg)
              this.transformationsUpdated = true
              this.loadProviderDetails.emit(true)
            }, 1000)
          }
        },
        error: (error: HttpErrorResponse) => {
          const errmsg = _.get(error, 'error.params.errMsg', 'Something went worng, please try again later')
          this.showSnackBar(errmsg)
        },
      })

    } else {
      const message = 'Please provide all mandatory fields'
      this.showSnackBar(message)
    }
  }

  updateProviderDetails() {
    this.marketPlaceSvc.updateProvider(this.providerDetails).subscribe({
      next: (responce: any) => {
        if (responce) {
          setTimeout(() => {
            const successMsg = 'Courses get api configured successfully'
            this.showSnackBar(successMsg)
            this.loadProviderDetails.emit(true)
          }, 1000)
        }
      },
      error: (error: HttpErrorResponse) => {
        const errmsg = _.get(error, 'error.params.errMsg', 'Something went worng, please try again later')
        this.showSnackBar(errmsg)
      },
    })
  }

  showSnackBar(message: string) {
    this.snackBar.open(message)
  }

}
