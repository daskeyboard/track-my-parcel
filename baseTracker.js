
class TrackingINFO {
  constructor({
    statusLabel,
    statusPercentage
  }) {
    this.statusLabel = statusLabel,
      this.statusPercentage = statusPercentage
  }
}

/**
 * The base class to track packages
 */
class PackageTracker {
  constructor({
    trackingNumber
  }) {
    this.trackingNumber = trackingNumber;
  }

  async getPackageInformation() {
    return null;
  }
}

/**
 * Guess the carrier depending on the trackingNumber
 */
PackageTracker.guess = async function (trackingNumber) {
  return;
}

module.exports = {
  PackageTracker: PackageTracker
}