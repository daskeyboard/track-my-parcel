import { Observable } from 'rxjs';

export interface ITrackingInfo {
  statusLabel: string;
  statusPercentage: number;
}

/**
 * The base class to track packages
 */
export abstract class PackageTracker {
  public trackingNumber: string;
  constructor(trackingNumber: string) {
    this.trackingNumber = trackingNumber;
  }

  /**
   * Given a tracking number,
   * Will get tracking information
   * @param trackingNumber
   */
  public abstract getPackageInformationFromCarrier(): Observable<ITrackingInfo>;

  /**
   * Convert response from carrier to an ITrackingInfo
   * @param response
   */
  protected abstract resolveCarrierResponseToITrackingInfo(response: any): ITrackingInfo;
}

/**
 * Guess the carrier depending on the trackingNumber
 */
// PackageTracker.guess = async function (trackingNumber) {
//   return;
// };
