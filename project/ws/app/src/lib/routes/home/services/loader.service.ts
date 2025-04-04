import { BehaviorSubject } from 'rxjs'
import { Injectable } from '@angular/core'

@Injectable()
export class LoaderService {
  changeLoad = new BehaviorSubject<boolean>(false)

  private doubleBack = new BehaviorSubject(false)
  currentState = this.doubleBack.asObservable()
  $currentState = this.changeLoad.asObservable()
  changeLoadState(state: boolean) {
    this.doubleBack.next(state)
  }
  changeLoaderState(state: boolean) {
    this.changeLoad.next(state)
  }

}
