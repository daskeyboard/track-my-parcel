
# track-package

Module to track packages from different carriers using only a tracking number.
No account needed.

# Usage

```shell
npm install track-my-parcel
```

or 

```
yarn add track-my-parcel
```

```javascript
const tracker = require('track-my-parcel');

tracker.Track('SOME-TRACKING-NUMBER', (infos,err) => {
  if(err){
    console.error(err);
    return;
  }
  console.log('GOT INFOS', infos);
});
```

# Many thanks to

Carl-Johan Kihl for [showing the way](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c) on how to build and publish an NPM Typescript package
