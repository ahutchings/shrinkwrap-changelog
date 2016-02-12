function buildGithubResolver () {
  return function githubResolver (previous, current) {
    return Promise.reject(new Error('not implemented'))
  }
}

module.exports = buildGithubResolver
