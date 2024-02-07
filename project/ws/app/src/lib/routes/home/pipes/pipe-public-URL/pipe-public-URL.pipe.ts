import { Pipe, PipeTransform } from '@angular/core'
import { environment } from 'src/environments/environment'

@Pipe({
  name: 'pipePublicURL',
})
export class PipePublicURL implements PipeTransform {

  // transform(value: string): any {
  //   const mainUrl = value && value.split('/content').pop() || ''
  //   const finalURL = `${environment.contentHost}/${environment.contentBucket}/content${mainUrl}`
  //   return value ? finalURL : ''
  // }

  transform(value: string): any {
    if (value.includes('Events_default')) {
      const mainUrl = value && value.split('/content').pop() || ''
      const finalURL = `${environment.contentHost}${mainUrl}`
      return value ? finalURL : ''

    }
    else {
      const mainUrl = value && value.split('/content').pop() || ''
      const finalURL = `${environment.contentHost}/${environment.contentBucket}/content${mainUrl}`
      return value ? finalURL : ''
    }

  }

}
