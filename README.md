# shrinkwrap-changelog

[![build status](https://img.shields.io/travis/ahutchings/shrinkwrap-changelog/master.svg?style=flat-square)](https://travis-ci.org/ahutchings/shrinkwrap-changelog)


## API Usage

```javascript
var githubResolver = require('shrinkwrap-changelog/lib/change-resolvers/github')
var stashResolver = require('shrinkwrap-changelog/lib/change-resolvers/stash')

var generateChangelog = require('shrinkwrap-changelog')({
  changeResolvers: [
    githubResolver({
      username: 'your_github_username',
      password: 'your_github_password_or_personal_access_token'
    }),
    stashResolver({
      hostname: 'stash.mycompany.com'
    })
  ]
})

var changelog = generateChangelog(previousShrinkwrap, currentShrinkwrap)

console.log(changelog)
```
