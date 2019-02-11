import { Observable, of } from "rxjs";
import { ITrackingInfo, PackageTracker } from "../baseTracker";

export class UPS extends PackageTracker {

  public getPackageInformation(): Observable<ITrackingInfo> {
    return of({} as ITrackingInfo)
  }
}

