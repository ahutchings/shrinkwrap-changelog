var url = require('url')
var fetch = require('node-fetch')

function buildPathnameAndQuery (options) {
  var pathname = '/rest/api/1.0/projects/' +
    options.projectkey +
    '/repos/' +
    options.repositoryslug +
    '/commits'

  var query = {
    from: options.from,
    to: options.to
  }

  return {
    pathname: pathname,
    query: query
  }
}

function buildStashResolver (options) {
  var hostname = options.hostname

  return function stashResolver (previous, current) {
    var previousUrl = url.parse(previous.resolved)
    var currentUrl = url.parse(current.resolved)

    if (currentUrl.hostname !== hostname) {
      return Promise.reject(new Error('Resolver hostname does not match the resolved URL hostname'))
    }

    var pathParts = currentUrl.pathname.split('/')
    var projectkey = pathParts[1]
    var repositoryslug = pathParts[2].split('.')[0]

    var pathnameAndQuery = buildPathnameAndQuery({
      projectkey: projectkey,
      repositoryslug: repositoryslug,
      from: previousUrl.hash.slice(1),
      to: currentUrl.hash.slice(1)
    })
    var requestUrl = url.format({
      protocol: 'https',
      hostname: hostname,
      pathname: pathnameAndQuery.pathname,
      query: pathnameAndQuery.query
    })

    return fetch(requestUrl)
      .then((response) => response.json())
      .then((json) => formatStashResponse(json))
  }
}

function formatStashResponse (stashResponse) {
  return stashResponse.values.map((value) => {
    return {
      timestamp: new Date(value.authorTimestamp),
      author: value.author.name + ' <' + value.author.emailAddress + '>',
      message: value.message
    }
  })
}

module.exports = buildStashResolver
