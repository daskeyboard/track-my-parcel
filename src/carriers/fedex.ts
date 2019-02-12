import * as request from 'request-promise';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITrackingInfo, PackageTracker } from '../baseTracker';

const trackingBaseUrl = 'https://www.fedex.com/trackingCal/track';

export class Fedex extends PackageTracker {

  public getPackageInformationFromCarrier(): Observable<any> {
    const data = {
      "TrackPackagesRequest": {
        "trackingInfoList": [
          {
            "trackNumberInfo": {
              "trackingCarrier": "",
              "trackingNumber": "785378216031",
              "trackingQualifier": ""
            }
          }
        ]
      }
    }

    const options = {
      form: {
        action: 'trackpackages',
        data: JSON.stringify(data),
        format: 'json'
      },
      method: 'POST',
      uri: trackingBaseUrl,
    }

    // construct observable from promise
    const observable = from(request(options));

    return observable.pipe(
      map((response: any) => {
        return this.resolveCarrierResponseToITrackingInfo(response);
      })
    )
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
    if (!response.TrackPackagesResponse
      || !response.TrackPackagesResponse.packageList
      || response.TrackPackagesResponse.packageList.length === 0) {
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
        throw new Error(`Fedex status not recognized`);
    }

    return {
      statusLabel: label,
      statusPercentage: percentage
    }
  }
}