import { Pipe, PipeTransform } from '@angular/core'
import { environment } from '../../../../../../../../src/environments/environment'
// import { environment } from '../../../../../../../../src/environments/environment'

@Pipe({
  name: 'publicGcpUrl',
})
export class PublicGcpUrlPipe implements PipeTransform {
  transform(url: string): any {
    const urlParts = url.split('/content').pop()
    if (urlParts && urlParts.length && urlParts.length > 0) {
      const replacementUrlPart = `${environment.contentHost}/assets/public/content${urlParts}`
      return replacementUrlPart
    }

  }
}
