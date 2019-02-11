const packageTracker = require('../baseTracker');

class UPS extends packageTracker.PackageTracker {
  constructor(options) {
    super(options);
    this.trackingBaseUrl = 'https://www.ups.com/track/api/Track/GetStatus?loc=en_US';
  }
  async getPackageInformation() {

  }
}

module.exports = {
  UPS: UPS
}