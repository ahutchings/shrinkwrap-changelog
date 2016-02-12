# shrinkwrap-changelog

[![build status](https://img.shields.io/travis/ahutchings/shrinkwrap-changelog/master.svg?style=flat-square)](https://travis-ci.org/ahutchings/shrinkwrap-changelog)


## API Usage

```
var generateChangelog = require('shrinkwrap-changelog')({
  changeResolvers: [
    function (previous, current) {
      return Promise.reject()
    }
  ]
})

var changelog = generateChangelog(previousShrinkwrap, currentShrinkwrap)

console.log(changelog)
```
