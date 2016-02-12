function buildNpmResolver () {
  return function npmResolver (previous, current) {
    return Promise.reject(new Error('not implemented'))
  }
}

module.exports = buildNpmResolver
