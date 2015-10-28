var test = require('tape');
var diff = require('../lib/diff-shrinkwrap');

test('diffs shrinkwraps with a dependency version change', function (t) {
  t.plan(1);

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
  };

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
  };

  var actual = diff(previousShrinkwrap, shrinkwrap);

  var expected = {
    added: [],
    removed: [],
    changed: [{
      name: 'request',
      path: [],
      source: 'npm',
      previousVersion: '2.59.1',
      version: '2.60.0'
    }]
  };

  t.deepEqual(actual, expected);
});

test('diffs shrinkwraps with a nested dependency version change', function (t) {
  t.plan(1);

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
  };

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
  };

  var actual = diff(previousShrinkwrap, shrinkwrap);

  var expected = {
    added: [],
    removed: [],
    changed: [{
      name: 'graceful-fs',
      path: ['request'],
      source: 'npm',
      previousVersion: '1.1.5',
      version: '1.1.6'
    }]
  };

  t.deepEqual(actual, expected);
});

test('diffs shrinkwraps with an added dependency', function (t) {
  t.plan(1);

  var previousShrinkwrap = {
    name: 'test-added',
    version: '0.0.0',
    dependencies: {
      request: {
        version: '2.60.0',
        resolved: 'https://registry.npmjs.org/request/-/request-2.60.0.tgz'
      }
    }
  };

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
  };

  var actual = diff(previousShrinkwrap, shrinkwrap);

  var expected = {
    added: [{
      name: 'graceful-fs',
      path: ['request'],
      source: 'npm',
      version: '1.1.6'
    }],
    removed: [],
    changed: []
  };

  t.deepEqual(actual, expected);
});

test('diffs shrinkwraps with a removed dependency', function (t) {
  t.plan(1);

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
  };

  var shrinkwrap = {
    name: 'test-added',
    version: '0.0.0',
    dependencies: {
      request: {
        version: '2.60.0',
        resolved: 'https://registry.npmjs.org/request/-/request-2.60.0.tgz'
      }
    }
  };

  var actual = diff(previousShrinkwrap, shrinkwrap);

  var expected = {
    added: [],
    removed: [{
      name: 'graceful-fs',
      path: ['request'],
      source: 'npm',
      previousVersion: '1.1.6'
    }],
    changed: []
  };

  t.deepEqual(actual, expected);
});
