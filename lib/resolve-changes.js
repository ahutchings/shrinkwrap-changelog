var githubResolver = require('./change-resolvers/github')()

function createResolver (customResolvers = []) {
  var resolvers = customResolvers.concat([
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
