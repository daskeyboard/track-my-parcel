#### 1.0.5 (2019-02-13)

##### New Features

* **Infos:**  Added carrier name in package tracking infos ([9b391892](https://github.com/daskeyboard/track-my-parcel/commit/9b391892bd9f6c7b904d2001ebc4532e460c0c9f))
* **Guess:**  Added feature to guess carrier depending on tracking number ([29d7ba04](https://github.com/daskeyboard/track-my-parcel/commit/29d7ba049d3d1f7a616ffad6417ac5c43a3a7d7c))
* **Carriers:**  Added fedex more to come ([629159bb](https://github.com/daskeyboard/track-my-parcel/commit/629159bb616c3ff24d1d941258cf27e8d74305c3))

##### Bug Fixes

* **UPS:**
  *  Handle OutForDelivery case by adding a percentage of 90 for the progress bar ([9f12269c](https://github.com/daskeyboard/track-my-parcel/commit/9f12269c79856ed4ff2fbb881e7fc3a51b68fe73))
  *  fixed the method isTrackingNumberFromCarrier ([897845e0](https://github.com/daskeyboard/track-my-parcel/commit/897845e014ece45fc90bc002d788b0aa8a073b24))
  *  throw erros when unable to handle UPS response ([f74c1f65](https://github.com/daskeyboard/track-my-parcel/commit/f74c1f65fe3dad470a350efb65141d8a2e93dfed))

##### Refactors

* **Package Base Class:**  add method track that calls getPackageInfo and resolve the carrier response ([bba46e14](https://github.com/daskeyboard/track-my-parcel/commit/bba46e1436c53c97bec5a3624240592faab1fa83))

