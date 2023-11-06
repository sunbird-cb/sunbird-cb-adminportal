import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

const PROTECTED_SLAG_V8 = '/apis/protected/v8'

const API_END_POINTS = {
  USER_BADGE: (wid: string) => `${PROTECTED_SLAG_V8}/user/badge/for/${wid}`,
  USER_BADGE_RECENT: `${PROTECTED_SLAG_V8}/user/badge/notification`,
  USER_BADGES_UPDATE: `${PROTECTED_SLAG_V8}/user/badge/update`,
}

export namespace NSProfileDataV2 {
  export interface IBadgeResponse {
    canEarn: IBadge[]
    closeToEarning: IBadge[]
    earned: IBadgeRecent[]
    lastUpdatedDate: string
    recent: IBadgeRecent[]
    totalPoints: [
      {
        collaborative_points: number
        learning_points: number
      }
    ]
  }

  export interface IBadge {
    Description: string
    BadgeName: string
    BadgeImagePath: string
    badge_group: string
    badge_id: string
    badge_name: string
    badge_order: string
    badge_type: 'O' | 'R'
    hover_text: string
    how_to_earn: string
    image: string
    is_new: number
    progress: number
    received_count: number
    threshold: number
  }

  export interface IBadgeRecent extends IBadge {
    first_received_date: string
    last_received_date: string
    message: string
    image: string
  }

  export interface IUserNotification {
    image: string
    badge_group: string
    is_new: number
    received_count: number
    badge_id: string
    how_to_earn: string
    progress: number
    threshold: number
    badge_type: string
    badge_name: string
    last_received_date: string
    first_received_date: string
    hover_text: string
    message: string
  }

  export interface IUserTotalPoints {
    learning_points: number
    collaborative_points: number
  }

  export interface IUserNotifications {
    totalPoints: IUserTotalPoints[]
    recent_badge: IUserNotification
  }

}

@Injectable({
  providedIn: 'root',
})
export class ProfileV2UtillService {
  constructor(private http: HttpClient) { }
  fetchBadges(wid: string): Observable<NSProfileDataV2.IBadgeResponse> {
    return this.http.get<NSProfileDataV2.IBadgeResponse>(`${API_END_POINTS.USER_BADGE(wid)}`)
  }

  reCalculateBadges(): Observable<any> {
    return this.http.post(`${API_END_POINTS.USER_BADGES_UPDATE}`, {})
  }

  fetchRecentBadge(): Observable<NSProfileDataV2.IUserNotifications> {
    return this.http
      .get<any>(API_END_POINTS.USER_BADGE_RECENT)
      .pipe(map(notifications => notifications))
  }

  emailTransform(value: string): any {
    // return value.split('.').join('[dot]').replace('@', '[at]')
    if (value !== undefined) {
      return value.replace(/\./g, '[dot]').replace('@', '[at]')
    }

  }

}
