import { Component, OnInit } from '@angular/core'
import { environment } from '../../../../../../../../../src/environments/environment'
import { ActivatedRoute } from '@angular/router'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { DemoVideoPopupComponent } from '../../components/demo-video-popup/demo-video-popup.component'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-kcm-mapping',
  templateUrl: './kcm-mapping.component.html',
  styleUrls: ['./kcm-mapping.component.scss'],
})
export class KCMMappingComponent implements OnInit {
  environmentVal: any
  taxonomyConfig: any
  showTopSection = false
  kcmConfig: any
  videoLink = ''
  constructor(
    private activateRoute: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.environmentVal = environment
    this.environmentVal.frameworkName = environment.KCMframeworkName
    // this.environmentVal.url = `https://localhost:3000`
    this.activateRoute.data.subscribe(data => {
      this.kcmConfig = data.pageData.data
      this.kcmConfig.defaultKCMConfig[0].frameworkId = environment.KCMframeworkName
      this.taxonomyConfig = [...this.kcmConfig.defaultKCMConfig, ...this.kcmConfig.frameworkConfig]
      this.videoLink = _.get(this.kcmConfig, 'topsection.guideVideo.url')
    })
  }

  callResizeEvent(_event: any) {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    },         100)
  }

  openVideoPopup() {
    const url = `${environment.karmYogiPath}${this.videoLink}`
    this.dialog.open(DemoVideoPopupComponent, {
      data: {
        videoLink: url,
      },
      disableClose: true,
      width: '50%',
      height: '60%',
      panelClass: 'overflow-visable',
    })
  }

}
