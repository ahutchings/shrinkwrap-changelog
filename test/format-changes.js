var test = require('tape')
var format = require('../lib/format-changes')

test('formats changes when there are no commits', function (t) {
  t.plan(1)

  var changes = {
    name: 'request',
    path: [],
    current: {
      version: '2.60.0',
      from: 'request@2.60.0',
      resolved: 'https://registry.npmjs.org/request/-/request-2.60.0.tgz'
    },
    previous: {
      version: '2.59.1',
      from: 'request@2.59.1',
      resolved: 'https://registry.npmjs.org/request/-/request-2.59.1.tgz'
    },
    commits: []
  }

  var expected = 'request\n2.59.1...2.60.0'
  var actual = format(changes)

  t.equal(actual, expected)
})

test('formats changes when there are commits', function (t) {
  t.plan(1)

  var changes = {
    name: 'request',
    path: [],
    current: {
      version: '2.60.0',
      from: 'request@2.60.0',
      resolved: 'https://registry.npmjs.org/request/-/request-2.60.0.tgz'
    },
    previous: {
      version: '2.59.1',
      from: 'request@2.59.1',
      resolved: 'https://registry.npmjs.org/request/-/request-2.59.1.tgz'
    },
    commits: [{
      timestamp: new Date(1455303600000),
      author: 'Andrew Hutchings <andrew.hutchings@gmail.com>',
      message: 'This is my commit message'
    }, {
      timestamp: new Date(1455303700000),
      author: 'Andrew Hutchings <andrew.hutchings@gmail.com>',
      message: 'This is my newer commit message'
    }]
  }

  var expected = 'request\n' +
    '2.59.1...2.60.0\n' +
    '\n' +
    '* This is my commit message (Andrew Hutchings <andrew.hutchings@gmail.com>)\n' +
    '* This is my newer commit message (Andrew Hutchings <andrew.hutchings@gmail.com>)'
  var actual = format(changes)

  t.equal(actual, expected)
})
