import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router'
import { EMPTY, Observable } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { AuthKeycloakService, IResolveResponse } from '@sunbird-cb/utils'
import { NSProfileDataV2 } from '../../home/models/profile-v2.model'
import { ProfileV2Service } from '../services/home.servive'

@Injectable()
export class DepartmentResolve
   {
  constructor(private profileService: ProfileV2Service, private router: Router, private authSvc: AuthKeycloakService) { }

  async resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Promise<Observable<IResolveResponse<NSProfileDataV2.IProfile>>> {

    // (await this.profileSer.checkValidLogin()).subscribe(whole => {
    //   let temArr = []
    //   temArr = whole.result.response.roles
    //   if (!(temArr.toString().indexOf('SPV_ADMIN') > -1 && whole.result.response.rootOrg.isSpv)) {
    //     this.router.navigate(['error-access-forbidden'])
    //     this.authSvc.logout()
    //     return EMPTY
    //   }
    // })

    return this.profileService.checkValidLogin().pipe(
      map((data => ({
        data,
        error: null,
      }))),
      catchError(() => {
        this.router.navigate(['error-access-forbidden'])
        this.authSvc.force_logout()
        return EMPTY
      }))

  }
}
