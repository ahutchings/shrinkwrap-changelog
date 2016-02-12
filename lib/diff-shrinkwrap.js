var url = require('url')
var npa = require('npm-package-arg')

module.exports = function (previousShrinkwrap, shrinkwrap) {
  var added = []
  var removed = []
  var changed = []

  diff(shrinkwrap.name, [], previousShrinkwrap, shrinkwrap)

  return {
    added: added,
    removed: removed,
    changed: changed
  }

  function diff (name, path, previous, current) {
    var isRoot = path.length === 0

    if (!isRoot && hasChanged(previous, current)) {
      change(name, path, previous, current)
    }

    var nextPath = path.concat(name)

    Object.keys(getDependencies(previous))
      .forEach(function (name) {
        if (hasDependency(current, name)) {
          diff(
            name,
            nextPath,
            getDependency(previous, name),
            getDependency(current, name)
          )
        } else {
          remove(
            name,
            nextPath,
            getDependency(previous, name)
          )
        }
      })

    Object.keys(getDependencies(current))
      .filter(function (name) {
        return !getDependency(previous, name)
      })
      .forEach(function (name) {
        add(
          name,
          nextPath,
          getDependency(current, name)
        )
      })
  }

  function add (name, path, current) {
    added.push({
      name: name,
      path: path.slice(1),
      current: getDependencyDetails(current)
    })
  }

  function remove (name, path, previous) {
    removed.push({
      name: name,
      path: path.slice(1),
      previous: getDependencyDetails(previous)
    })
  }

  function change (name, path, previous, current) {
    changed.push({
      name: name,
      path: path.slice(1),
      current: getDependencyDetails(current),
      previous: getDependencyDetails(previous)
    })
  }
}

function hasChanged (previous, current) {
  if (previous.resolved === current.resolved) return false

  if (isGitPackage(previous) && isGitPackage(current)) {
    return getHash(previous.resolved) !== getHash(current.resolved)
  }

  return true
}

function isGitPackage (pkg) {
  var packageType = npa(pkg.resolved).type
  return packageType === 'git' || packageType === 'hosted'
}

function getHash (urlStr) {
  return url.parse(urlStr).hash.slice(1)
}

function hasDependency (pkg, name) {
  return !!getDependency(pkg, name)
}

function getDependency (pkg, name) {
  return getDependencies(pkg)[name]
}

function getDependencies (pkg) {
  return pkg.dependencies || {}
}

function getDependencyDetails (dependency) {
  var isGit = isGitPackage(dependency)
  var version = isGit ? getHash(dependency.resolved) : dependency.version

  return {
    version: version,
    from: dependency.from,
    resolved: dependency.resolved
  }
}
