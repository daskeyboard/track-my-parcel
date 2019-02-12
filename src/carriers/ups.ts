import * as request from 'request-promise';
import { from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ITrackingInfo, PackageTracker } from '../baseTracker';
import { handleError } from '../utilities';

const trackingBaseUrl = 'https://www.ups.com/track/api/Track/GetStatus?loc=en_US';

export class UPS extends PackageTracker {
  constructor(trackingNumber: string) {
    super(trackingNumber);
    this.carrierName = 'UPS';
  }

  public isTrackingNumberFromCarrier(): Observable<boolean> {
    return this.getPackageInformationFromCarrier().pipe(
      map((response: any) => {
        if (
          response &&
          +response.statusCode === 200 &&
          response.trackDetails &&
          response.trackDetails.length > 0 &&
          +response.trackDetails[0].errorCode === 0
        ) {
          return true;
        } else {
          return false;
        }
      }),
      catchError(handleError(`isTrackingNumberFromCarrier UPS`, false)),
    );
  }

  protected getPackageInformationFromCarrier(): Observable<any> {
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
    return from(request(options));
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
      label = response.trackDetails[0].packageStatus;
      percentage = response.trackDetails[0].progressBarPercentage;
    }
    return {
      carrierName: this.carrierName,
      detailsLink: this.getDetailsLink(),
      statusLabel: label,
      statusPercentage: percentage,
    } as ITrackingInfo;
  }

  private getDetailsLink(): string {
    return `https://www.ups.com/track?loc=en_US&tracknum=${this.trackingNumber}&requester=WT/trackdetails`;
  }
}
