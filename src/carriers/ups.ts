import * as request from 'request-promise';
import { from, Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { ITrackingInfo, PackageTracker } from "../baseTracker";

const trackingBaseUrl = 'https://www.ups.com/track/api/Track/GetStatus?loc=en_US';

export class UPS extends PackageTracker {

  public getPackageInformation(): Observable<ITrackingInfo> {
    const options = {
      body: {
        Locale: 'en_US',
        TrackingNumber: [
          `${this.trackingNumber}`
        ]
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
      },
      json: true,
      method: 'POST',
      uri: trackingBaseUrl
    }

    // construct observable from promise
    const observable = from(request(options));

    // Pipe into the observable to transform the 
    return observable.pipe(
      map((response: any) => {
        return this.handleUPSResponse(response);
      }));
  }

  /**
   * Convert UPS response to ITrackingInfo model
   * @param response
   */
  private handleUPSResponse(response: any): ITrackingInfo {
    let label = '';
    let percentage = 0;
    if (response.trackDetails && response.trackDetails.length > 0) {
      label = response.trackDetails[0].packageStatus;
      percentage = response.trackDetails[0].progressBarPercentage;
    }
    return {
      statusLabel: label,
      statusPercentage: percentage
    } as ITrackingInfo;
  }
}

