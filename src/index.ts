import { ITrackingInfo } from './baseTracker';
import { Fedex } from './carriers/fedex';
import { UPS } from './carriers/ups';

export const Track = (trackingNumber: string, callback: (infos: ITrackingInfo, err: any) => void): void => {
  const upsTracker = new UPS(trackingNumber);
  upsTracker.track().subscribe(
    (infos: ITrackingInfo) => {
      callback(infos, null);
    },
    err => {
      callback({} as ITrackingInfo, err);
    },
  );
};

// const fedexTracker = new Fedex('785378216031');
// fedexTracker.track().subscribe((infos) => {
//   console.log(infos);
// }, err => {
//   console.error(err);
// });
