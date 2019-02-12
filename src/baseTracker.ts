import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  public track(): Observable<ITrackingInfo> {
    // Pipe into the observable to transform the
    return this.getPackageInformationFromCarrier().pipe(
      map((response: any) => {
        return this.resolveCarrierResponseToITrackingInfo(response);
      })
    );
  }

  /**
   * Given a tracking number,
   * Will get tracking information
   * requires:
   * ----------
   * @param trackingNumber
   * ensure:
   * -------
   * An observable that resolves with the carrier server response
   */
  protected abstract getPackageInformationFromCarrier(): Observable<any>;

  /**
   * Convert response from carrier to an ITrackingInfo
   * @param response
   */
  protected abstract resolveCarrierResponseToITrackingInfo(response: any): ITrackingInfo;
}
