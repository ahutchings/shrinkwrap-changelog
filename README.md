# shrinkwrap-changelog

[![build status](https://github.com/ahutchings/shrinkwrap-changelog/actions/workflows/workflow.yml/badge.svg)](https://github.com/ahutchings/shrinkwrap-changelog/actions/workflows/workflow.yml)

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
