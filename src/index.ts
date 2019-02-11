import { ITrackingInfo } from './baseTracker';
import { UPS } from './carriers/ups';


export const Track = (trackingNumber: string, callback: (infos: ITrackingInfo, err: any) => void): void => {
  const upsTracker = new UPS(trackingNumber);
  upsTracker.getPackageInformation().subscribe((infos: ITrackingInfo) => {
    callback(infos, null);
  }, (err) => {
    callback({} as ITrackingInfo, err);
  });
};
