import * as request from 'request-promise';
import { from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ITrackingInfo, PackageTracker } from '../baseTracker';
import { handleError } from '../utilities';

const trackingBaseUrl = 'https://www.fedex.com/trackingCal/track';

export class Fedex extends PackageTracker {
  constructor(trackingNumber: string) {
    super(trackingNumber);
    this.carrierName = 'Fedex';
  }

  public isTrackingNumberFromCarrier(): Observable<boolean> {
    return this.getPackageInformationFromCarrier().pipe(
      map((response: any) => {
        /* This part is still fuzzy. We assume that a tracking number from fedex
         is valid if there is a keyStatusCD in the response*/
        response = JSON.parse(response);
        if (
          response.TrackPackagesResponse &&
          response.TrackPackagesResponse.successful &&
          response.TrackPackagesResponse.packageList &&
          response.TrackPackagesResponse.packageList.length !== 0 &&
          response.TrackPackagesResponse.packageList[0].keyStatusCD &&
          response.TrackPackagesResponse.packageList[0].keyStatusCD.length > 0
        ) {
          return true;
        } else {
          return false;
        }
      }),
      catchError(handleError(`isTrackingNumberFromCarrier Fedex`, false)),
    );
  }

  protected getPackageInformationFromCarrier(): Observable<any> {
    const data = {
      TrackPackagesRequest: {
        trackingInfoList: [
          {
            trackNumberInfo: {
              trackingCarrier: '',
              trackingNumber: `${this.trackingNumber}`,
              trackingQualifier: '',
            },
          },
        ],
      },
    };

    const options = {
      form: {
        action: 'trackpackages',
        data: JSON.stringify(data),
        format: 'json',
      },
      method: 'POST',
      uri: trackingBaseUrl,
    };

    // construct observable from promise
    return from(request(options));
  }

  /**
   * Converts Fedex response to ITrackingInfo interface
   * @param response
   */
  protected resolveCarrierResponseToITrackingInfo(response: any): ITrackingInfo {
    // response needs to be parsed
    response = JSON.parse(response);

    /**
     * Throw error if unable to handle package response
     */
    if (
      !response.TrackPackagesResponse ||
      !response.TrackPackagesResponse.packageList ||
      response.TrackPackagesResponse.packageList.length === 0
    ) {
      throw new Error(`Error when handling response from Fedex`);
    }

    // For the moment we only handle the first package of the list.
    // TODO Find better handling implementation
    const firstPackage = response.TrackPackagesResponse.packageList[0];
    const label = firstPackage.keyStatus;
    let percentage = 0;
    /* Fedex has 4 statuses */
    switch (label) {
      case 'Initiated':
        percentage = 25;
        break;
      case 'Picked up':
        percentage = 50;
        break;
      case 'In Transit':
        percentage = 75;
        break;
      case 'Delivered':
        percentage = 100;
        break;
      default:
        percentage = 0;
    }

    return {
      carrierName: this.carrierName,
      detailsLink: this.getDetailsLink(),
      statusLabel: label,
      statusPercentage: percentage,
    } as ITrackingInfo;
  }

  private getDetailsLink(): string {
    return `https://www.fedex.com/apps/fedextrack/?tracknumbers=${this.trackingNumber}`;
  }
}
