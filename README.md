# shrinkwrap-changelog

[![build status](https://img.shields.io/travis/ahutchings/shrinkwrap-changelog/master.svg?style=flat-square)](https://travis-ci.org/ahutchings/shrinkwrap-changelog)


## API Usage

```javascript
var stashResolver = require('shrinkwrap-changelog/lib/change-resolvers/stashResolver')

var generateChangelog = require('shrinkwrap-changelog')({
  changeResolvers: [
    stashResolver({
      hostname: 'stash.mycompany.com'
    })
  ]
})

var changelog = generateChangelog(previousShrinkwrap, currentShrinkwrap)

console.log(changelog)
```
