const { UPS } = require('./carriers/ups');

const options = {
  trackingNumber: '12345'
}
const ups = new UPS(options);
console.log(ups)