function createResolver (resolvers = []) {
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
