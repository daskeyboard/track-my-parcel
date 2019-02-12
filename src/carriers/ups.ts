import * as request from 'request-promise';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITrackingInfo, PackageTracker } from '../baseTracker';

const trackingBaseUrl = 'https://www.ups.com/track/api/Track/GetStatus?loc=en_US';
const STATUS_TYPES = ['D', 'P', 'M', 'I'];

export class UPS extends PackageTracker {
  public getPackageInformationFromCarrier(): Observable<ITrackingInfo> {
    const options = {
      body: {
        Locale: 'en_US',
        TrackingNumber: [`${this.trackingNumber}`],
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
      },
      json: true,
      method: 'POST',
      uri: trackingBaseUrl,
    };

    // construct observable from promise
    const observable = from(request(options));

    // Pipe into the observable to transform the
    return observable.pipe(
      map((response: any) => {
        return this.resolveCarrierResponseToITrackingInfo(response);
      }),
    );
  }

  /**
   * Convert UPS response to ITrackingInfo interface
   * @param response
   */
  protected resolveCarrierResponseToITrackingInfo(response: any): ITrackingInfo {
    let label = '';
    let percentage = 0;
    if (!response.trackDetails) {
      throw new Error(`Error when handling response from UPS`);
    }
    if (response.trackDetails.length > 0) {
      if (!STATUS_TYPES.includes(response.packageStatusType)) {
        throw new Error(`Status type not recognized for UPS`);
      }
      label = response.trackDetails[0].packageStatus;
      percentage = response.trackDetails[0].progressBarPercentage;
    }
    return {
      statusLabel: label,
      statusPercentage: percentage,
    } as ITrackingInfo;
  }
}
