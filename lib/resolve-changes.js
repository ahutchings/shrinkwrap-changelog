var githubResolver = require('./change-resolvers/github')
var npmResolver = require('./change-resolvers/npm')

function createResolver (customResolvers = []) {
  var resolvers = customResolvers.concat([
    npmResolver,
    githubResolver
  ])

  return function resolver (previous, current) {
    var result = Promise.resolve()

    resolvers.forEach((resolver) => {
      result.catch(() => {
        return resolver(previous, current)
      })
    })

    return result.catch(() => {
      return []
    })
  }
}

module.exports = createResolver
