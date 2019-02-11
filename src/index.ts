import { ITrackingInfo } from "./baseTracker";
import { UPS } from "./carriers/ups";

// import { UPS } from "./carriers/ups";

// // const { UPS } = require('./carriers/ups');

// // const options = {
// //   trackingNumber: '12345'
// // }
// // // const ups = new UPS(options);
// // console.log(options)
// const upsTracker = new UPS('1ZXA13670390302611');

// upsTracker.getPackageInformation().subscribe(result => {
//   console.log('result', result);
// }, (err) => {
//   console.log('sldkfj', err);
// })

export const Track = (trackingNumber: string, callback: (infos: ITrackingInfo) => void): void => {
  const upsTracker = new UPS(trackingNumber).getPackageInformation().subscribe(
    (infos: ITrackingInfo) => {
      callback(infos);
    });

}
