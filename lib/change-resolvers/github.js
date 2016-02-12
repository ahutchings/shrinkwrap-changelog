var url = require('url')
var fetch = require('node-fetch')

function buildGithubResolver () {
  return function githubResolver (previous, current) {
    var currentUrl = url.parse(current.resolved)

    if (currentUrl.hostname !== 'github.com') {
      return Promise.reject(new Error('Resolved URL is not hosted by GitHub'))
    }

    var pathParts = currentUrl.pathname.split('/')
    var owner = pathParts[1]
    var repo = pathParts[2].split('.')[0]

    var requestUrl = 'https://api.github.com/repos/' +
      owner +
      '/' +
      repo +
      '/compare/' +
      previous.version +
      '...' +
      current.version

    return fetch(requestUrl)
      .then((response) => response.json())
      .then((json) => formatGitHubResponse(json))
  }
}

module.exports = buildGithubResolver

function formatGitHubResponse (json) {
  return json.commits.map((commit) => {
    return {
      timestamp: new Date(commit.commit.committer.date),
      author: `${commit.commit.committer.name} <${commit.commit.committer.email}>`,
      message: commit.commit.message
    }
  })
}
