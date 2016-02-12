var test = require('tape')
var proxyquire = require('proxyquire')
var response = require('./fixtures/github-response')

test('returns a rejected promise if the resolved URL is not hosted by GitHub', function (t) {
  t.plan(1)

  var buildGithubResolver = require('../lib/change-resolvers/github')

  var previous = {
    version: '1.0.0',
    from: 'git://bitbucket.org/myproject/myrepository.git',
    resolved: 'git://bitbucket.org/myproject/myrepository.git#b0e7b9ad9d74e3338943c80fec64e3e72c088660'
  }

  var current = {
    version: '1.0.0',
    from: 'git://bitbucket.org/myproject/myrepository.git',
    resolved: 'git://bitbucket.org/myproject/myrepository.git#e647c363347589feaeca1fbb5de4d2efccea9d68'
  }

  var resolver = buildGithubResolver({
    username: 'my_username',
    password: 'my_token'
  })

  resolver(previous, current)
    .then((results) => {
      t.end(new Error('Resolver should not have run'))
    })
    .catch((error) => {
      t.equal('Resolved URL is not hosted by GitHub', error.message)
      t.end()
    })
})

test('builds GitHub request url and Authorization header', function (t) {
  t.plan(2)

  var jsonPromise = Promise.resolve({commits: []})

  var responsePromise = Promise.resolve({
    json: function () {
      return jsonPromise
    }
  })

  var requestedUrl
  var requestedOptions
  var fetchStub = function (requestUrl, options) {
    requestedUrl = requestUrl
    requestedOptions = options
    return responsePromise
  }

  var buildGithubResolver = proxyquire('../lib/change-resolvers/github', {
    'node-fetch': fetchStub
  })

  var previous = {
    version: 'b0e7b9ad9d74e3338943c80fec64e3e72c088660',
    from: 'git://github.com/myproject/myrepository.git',
    resolved: 'git://github.com/myproject/myrepository.git#b0e7b9ad9d74e3338943c80fec64e3e72c088660'
  }

  var current = {
    version: 'e647c363347589feaeca1fbb5de4d2efccea9d68',
    from: 'git://github.com/myproject/myrepository.git',
    resolved: 'git://github.com/myproject/myrepository.git#e647c363347589feaeca1fbb5de4d2efccea9d68'
  }

  var resolver = buildGithubResolver({
    username: 'my_username',
    password: 'my_token'
  })

  resolver(previous, current)
    .then(() => {
      var expectedUrl = 'https://api.github.com/repos/myproject/myrepository/compare/b0e7b9ad9d74e3338943c80fec64e3e72c088660...e647c363347589feaeca1fbb5de4d2efccea9d68'
      t.equal(requestedUrl, expectedUrl)
      t.deepEqual(requestedOptions, {
        headers: {
          Authorization: 'Basic bXlfdXNlcm5hbWU6bXlfdG9rZW4='
        }
      })
    })
    .catch(t.end)
})

test('resolves changes for a GitHub package', function (t) {
  t.plan(1)

  var jsonPromise = Promise.resolve(response)

  var responsePromise = Promise.resolve({
    json: function () {
      return jsonPromise
    }
  })

  var fetchStub = function () {
    return responsePromise
  }

  var buildGithubResolver = proxyquire('../lib/change-resolvers/github', {
    'node-fetch': fetchStub
  })

  var previous = {
    version: 'b0e7b9ad9d74e3338943c80fec64e3e72c088660',
    from: 'git://github.com/myproject/myrepository.git',
    resolved: 'git://github.com/myproject/myrepository.git#b0e7b9ad9d74e3338943c80fec64e3e72c088660'
  }

  var current = {
    version: 'e647c363347589feaeca1fbb5de4d2efccea9d68',
    from: 'git://github.com/myproject/myrepository.git',
    resolved: 'git://github.com/myproject/myrepository.git#e647c363347589feaeca1fbb5de4d2efccea9d68'
  }

  var resolver = buildGithubResolver({
    username: 'my_username',
    password: 'my_token'
  })

  var expected = [{
    timestamp: new Date('2016-02-12T17:24:16Z'),
    author: 'Andrew Hutchings <andrew.hutchings@gmail.com>',
    message: 'Set language for the code snippet in the README'
  }, {
    timestamp: new Date('2016-02-12T17:25:06Z'),
    author: 'Andrew Hutchings <andrew.hutchings@gmail.com>',
    message: 'Use HTTPS'
  }, {
    timestamp: new Date('2016-02-12T18:07:38Z'),
    author: 'Andrew Hutchings <andrew.hutchings@gmail.com>',
    message: 'Use correct URL for Stash'
  }, {
    timestamp: new Date('2016-02-12T19:10:45Z'),
    author: 'Andrew Hutchings <andrew.hutchings@gmail.com>',
    message: 'Drop npm change resolver'
  }]

  resolver(previous, current).then((actual) => {
    t.deepEqual(actual, expected)
    t.end()
  }).catch((error) => {
    t.end(error)
  })
})
