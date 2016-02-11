var test = require('tape')
var diff = require('../lib/diff-shrinkwrap')

test('diffs shrinkwraps with a dependency version change', function (t) {
  t.plan(1)

  var previousShrinkwrap = {
    name: 'test-shallow-change',
    version: '0.0.0',
    dependencies: {
      request: {
        version: '2.59.1',
        from: 'request@2.59.1',
        resolved: 'https://registry.npmjs.org/request/-/request-2.59.1.tgz'
      }
    }
  }

  var shrinkwrap = {
    name: 'test-shallow-change',
    version: '0.0.0',
    dependencies: {
      request: {
        version: '2.60.0',
        from: 'request@2.60.0',
        resolved: 'https://registry.npmjs.org/request/-/request-2.60.0.tgz'
      }
    }
  }

  var actual = diff(previousShrinkwrap, shrinkwrap)

  var expected = {
    added: [],
    removed: [],
    changed: [{
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
      }
    }]
  }

  t.deepEqual(actual, expected)
})

test('diffs shrinkwraps with a nested dependency version change', function (t) {
  t.plan(1)

  var previousShrinkwrap = {
    name: 'test-nested-change',
    version: '0.0.0',
    dependencies: {
      request: {
        version: '2.60.0',
        resolved: 'https://registry.npmjs.org/request/-/request-2.60.0.tgz',
        dependencies: {
          'graceful-fs': {
            version: '1.1.5',
            resolved: 'https://registry.npmjs.org/graceful-fs/-/graceful-fs-1.1.5.tgz'
          }
        }
      }
    }
  }

  var shrinkwrap = {
    name: 'test-nested-change',
    version: '0.0.0',
    dependencies: {
      request: {
        version: '2.60.0',
        resolved: 'https://registry.npmjs.org/request/-/request-2.60.0.tgz',
        dependencies: {
          'graceful-fs': {
            version: '1.1.6',
            resolved: 'https://registry.npmjs.org/graceful-fs/-/graceful-fs-1.1.6.tgz'
          }
        }
      }
    }
  }

  var actual = diff(previousShrinkwrap, shrinkwrap)

  var expected = {
    added: [],
    removed: [],
    changed: [{
      name: 'graceful-fs',
      path: ['request'],
      current: {
        version: '1.1.6',
        from: void 0,
        resolved: 'https://registry.npmjs.org/graceful-fs/-/graceful-fs-1.1.6.tgz'
      },
      previous: {
        version: '1.1.5',
        from: void 0,
        resolved: 'https://registry.npmjs.org/graceful-fs/-/graceful-fs-1.1.5.tgz'
      }
    }]
  }

  t.deepEqual(actual, expected)
})

test('diffs shrinkwraps with an added dependency', function (t) {
  t.plan(1)

  var previousShrinkwrap = {
    name: 'test-added',
    version: '0.0.0',
    dependencies: {
      request: {
        version: '2.60.0',
        resolved: 'https://registry.npmjs.org/request/-/request-2.60.0.tgz'
      }
    }
  }

  var shrinkwrap = {
    name: 'test-added',
    version: '0.0.0',
    dependencies: {
      request: {
        version: '2.60.0',
        resolved: 'https://registry.npmjs.org/request/-/request-2.60.0.tgz',
        dependencies: {
          'graceful-fs': {
            version: '1.1.6',
            resolved: 'https://registry.npmjs.org/graceful-fs/-/graceful-fs-1.1.6.tgz'
          }
        }
      }
    }
  }

  var actual = diff(previousShrinkwrap, shrinkwrap)

  var expected = {
    added: [{
      name: 'graceful-fs',
      path: ['request'],
      current: {
        version: '1.1.6',
        from: void 0,
        resolved: 'https://registry.npmjs.org/graceful-fs/-/graceful-fs-1.1.6.tgz'
      }
    }],
    removed: [],
    changed: []
  }

  t.deepEqual(actual, expected)
})

test('diffs shrinkwraps with a removed dependency', function (t) {
  t.plan(1)

  var previousShrinkwrap = {
    name: 'test-added',
    version: '0.0.0',
    dependencies: {
      request: {
        version: '2.60.0',
        resolved: 'https://registry.npmjs.org/request/-/request-2.60.0.tgz',
        dependencies: {
          'graceful-fs': {
            version: '1.1.6',
            resolved: 'https://registry.npmjs.org/graceful-fs/-/graceful-fs-1.1.6.tgz'
          }
        }
      }
    }
  }

  var shrinkwrap = {
    name: 'test-added',
    version: '0.0.0',
    dependencies: {
      request: {
        version: '2.60.0',
        resolved: 'https://registry.npmjs.org/request/-/request-2.60.0.tgz'
      }
    }
  }

  var actual = diff(previousShrinkwrap, shrinkwrap)

  var expected = {
    added: [],
    removed: [{
      name: 'graceful-fs',
      path: ['request'],
      previous: {
        version: '1.1.6',
        from: void 0,
        resolved: 'https://registry.npmjs.org/graceful-fs/-/graceful-fs-1.1.6.tgz'
      }
    }],
    changed: []
  }

  t.deepEqual(actual, expected)
})

test('diffs shrinkwraps with git dependencies that have differing "resolved" values but the same version', function (t) {
  t.plan(1)

  var previousShrinkwrap = {
    name: 'git-resolved',
    version: '0.0.0',
    dependencies: {
      'repository': {
        'version': '1.0.0',
        'from': 'git://github.com/username/repository.git',
        'resolved': 'git://github.com/username/repository.git#b0e7b9ad9d74e3338943c80fec64e3e72c088660'
      }
    }
  }

  var shrinkwrap = {
    name: 'git-resolved',
    version: '0.0.0',
    dependencies: {
      'repository': {
        'version': '1.0.0',
        'from': 'git://github.com/username/repository.git',
        'resolved': 'git://github.com/username/repository.git#e647c363347589feaeca1fbb5de4d2efccea9d68'
      }
    }
  }

  var actual = diff(previousShrinkwrap, shrinkwrap)

  var expected = {
    added: [],
    removed: [],
    changed: [{
      name: 'repository',
      path: [],
      previous: {
        version: '1.0.0',
        from: 'git://github.com/username/repository.git',
        resolved: 'git://github.com/username/repository.git#b0e7b9ad9d74e3338943c80fec64e3e72c088660'
      },
      current: {
        version: '1.0.0',
        from: 'git://github.com/username/repository.git',
        resolved: 'git://github.com/username/repository.git#e647c363347589feaeca1fbb5de4d2efccea9d68'
      }
    }]
  }

  t.deepEqual(actual, expected)
})

test('diffs shrinkwraps with git dependencies that have differing URLs but not differing revisions', function (t) {
  t.plan(1)

  var previousShrinkwrap = {
    name: 'git-resolved',
    version: '0.0.0',
    dependencies: {
      'repository': {
        'version': '1.0.0',
        'from': 'git://github.com/username/repository.git',
        'resolved': 'git://github.com/username/repository.git#b0e7b9ad9d74e3338943c80fec64e3e72c088660'
      }
    }
  }

  var shrinkwrap = {
    name: 'git-resolved',
    version: '0.0.0',
    dependencies: {
      'repository': {
        'version': '1.0.0',
        'from': 'git://bitbucket.org/username/repository.git',
        'resolved': 'git://bitbucket.org/username/repository.git#b0e7b9ad9d74e3338943c80fec64e3e72c088660'
      }
    }
  }

  var actual = diff(previousShrinkwrap, shrinkwrap)

  var expected = {
    added: [],
    removed: [],
    changed: []
  }

  t.deepEqual(actual, expected)
})
