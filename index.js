var diff = require('./lib/diff-shrinkwrap')
var createResolver = require('./lib/resolve-changes')
var format = require('./lib/format-changes')

function createChangelogGenerator (options = {}) {
  var resolve = createResolver(options.customResolvers)

  return function generateChangelog (previousShrinkwrap, currentShrinkwrap) {
    var changes = diff(previousShrinkwrap, currentShrinkwrap).changes
    return changes.map(resolve).map(format).join('\n')
  }
}

module.exports = createChangelogGenerator
