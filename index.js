var fs = require('fs')
var diff = require('./lib/diff-shrinkwrap')
var resolve = require('./lib/resolve-changes')
var format = require('./lib/format-changes')

function getLastTag () {
  `git describe --abbrev=0 --tags`
}

var previousTag = getLastTag()
var previousShrinkwrap = getShrinkwrapContent(previousTag)
var currentShrinkwrap = fs.readFile('npm-shrinkwrap.json')

function getShrinkwrapContent (revision) {
  `git show ${revision}:npm-shrinkwrap.json`
}

var changes = diff(previousShrinkwrap, currentShrinkwrap).changes

var changelog = changes.map(resolve).map(format)

process.stdout.write(changelog)
