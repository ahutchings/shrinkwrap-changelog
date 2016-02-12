var test = require('tape')
var proxyquire = require('proxyquire')
var response = require('./fixtures/commits')

test('returns a rejected promise if the configured hostname does not match the resolved hostname', function (t) {
  t.plan(1)

  var buildStashResolver = require('../lib/change-resolvers/stash')

  var previous = {
    version: '1.0.0',
    from: 'git://stash.mycompany.com/myproject/myrepository.git',
    resolved: 'git://stash.mycompany.com/myproject/myrepository.git#b0e7b9ad9d74e3338943c80fec64e3e72c088660'
  }

  var current = {
    version: '1.0.0',
    from: 'git://stash.mycompany.com/myproject/myrepository.git',
    resolved: 'git://stash.mycompany.com/myproject/myrepository.git#e647c363347589feaeca1fbb5de4d2efccea9d68'
  }

  var resolver = buildStashResolver({hostname: 'stash.someothercompany.net'})

  resolver(previous, current)
    .then((results) => {
      t.end(new Error('Resolver should not have run'))
    })
    .catch((error) => {
      t.equal('Resolver hostname does not match the resolved URL hostname', error.message)
      t.end()
    })
})

test('builds stash request url', function (t) {
  t.plan(1)

  var jsonPromise = Promise.resolve({values: []})

  var responsePromise = Promise.resolve({
    json: function () {
      return jsonPromise
    }
  })

  var requestedUrl
  var fetchStub = function (requestUrl) {
    requestedUrl = requestUrl
    return responsePromise
  }

  var buildStashResolver = proxyquire('../lib/change-resolvers/stash', {
    'node-fetch': fetchStub
  })

  var previous = {
    version: '1.0.0',
    from: 'git://stash.mycompany.com/myproject/myrepository.git',
    resolved: 'git://stash.mycompany.com/myproject/myrepository.git#b0e7b9ad9d74e3338943c80fec64e3e72c088660'
  }

  var current = {
    version: '1.0.0',
    from: 'git://stash.mycompany.com/myproject/myrepository.git',
    resolved: 'git://stash.mycompany.com/myproject/myrepository.git#e647c363347589feaeca1fbb5de4d2efccea9d68'
  }

  var resolver = buildStashResolver({hostname: 'stash.mycompany.com'})

  resolver(previous, current)

  var expectedUrl = 'https://stash.mycompany.com/rest/api/1.0/projects/myproject/repos/myrepository/compare/commits?from=b0e7b9ad9d74e3338943c80fec64e3e72c088660&to=e647c363347589feaeca1fbb5de4d2efccea9d68'
  t.equal(requestedUrl, expectedUrl)
})

test('resolves changes for a stash package', function (t) {
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

  var buildStashResolver = proxyquire('../lib/change-resolvers/stash', {
    'node-fetch': fetchStub
  })

  var previous = {
    version: '1.0.0',
    from: 'git://stash.mycompany.com/myproject/myrepository.git',
    resolved: 'git://stash.mycompany.com/myproject/myrepository.git#b0e7b9ad9d74e3338943c80fec64e3e72c088660'
  }

  var current = {
    version: '1.0.0',
    from: 'git://stash.mycompany.com/myproject/myrepository.git',
    resolved: 'git://stash.mycompany.com/myproject/myrepository.git#e647c363347589feaeca1fbb5de4d2efccea9d68'
  }

  var resolver = buildStashResolver({hostname: 'stash.mycompany.com'})

  var expected = [{
    timestamp: new Date(1442553509156),
    author: 'Andrew <andrew@mycompany.com>',
    message: 'More work on feature 1'
  }, {
    timestamp: new Date(1442553509157),
    author: 'Tyler <tyler@mycompany.com>',
    message: 'Tyler\'s work on feature 1'
  }]

  resolver(previous, current).then((actual) => {
    t.deepEqual(actual, expected)
    t.end()
  }).catch((error) => {
    t.end(error)
  })
})
