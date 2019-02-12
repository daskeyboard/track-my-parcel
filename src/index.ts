import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITrackingInfo, PackageTracker } from './baseTracker';
import { Fedex } from './carriers/fedex';
import { UPS } from './carriers/ups';

/**
 * Guesses the Carrier depending on the tracking number
 * Returns an observable that will resolve with the corresponding carrier
 * or an error
 * @param trackingNumber
 */
const GuessCarrier = (trackingNumber: string): Observable<PackageTracker> => {
  // create all the available trackers
  const upsTracker = new UPS(trackingNumber);
  const fedexTracker = new Fedex(trackingNumber);
  // group them in an array
  const trackers = [upsTracker, fedexTracker];
  // create array of observable from the trackers array
  const trackerObservables = trackers.map(tracker => {
    return tracker.isTrackingNumberFromCarrier();
  });

  return forkJoin(trackerObservables).pipe(
    map((result: boolean[]) => {
      const firstMatchingTrackerIndex = result.indexOf(true);
      if (firstMatchingTrackerIndex !== -1) {
        return trackers[firstMatchingTrackerIndex];
      }
      throw new Error('No carrier found for this tracking number');
    }),
  );
};

export const Track = (trackingNumber: string, callback: (infos: ITrackingInfo, err: any) => void): void => {
  GuessCarrier(trackingNumber).subscribe(
    (carrier: PackageTracker) => {
      carrier.track().subscribe(
        infos => {
          callback(infos, null);
        },
        err => {
          callback({} as ITrackingInfo, err);
        },
      );
    },
    err => {
      callback({} as ITrackingInfo, err);
    },
  );
};
