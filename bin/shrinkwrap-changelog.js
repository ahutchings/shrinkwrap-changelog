var fs = require('fs')
var Promise = require('bluebird')
var exec = require('child-process-promise').exec
var generateChangelog = require('../')()
var readFileAsync = Promise.promisify(fs.readFile)

Promise.all([
  getPreviousShrinkwrap(),
  getCurrentShrinkwrap()
]).then(function (previousShrinkwrap, currentShrinkwrap) {
  process.stdout.write(generateChangelog(
    previousShrinkwrap,
    currentShrinkwrap
  ))
})

function getPreviousShrinkwrap () {
  return getLastTag().then(getShrinkwrapContent)
}

function getCurrentShrinkwrap () {
  return readFileAsync('npm-shrinkwrap.json')
}

function getLastTag () {
  return exec('git describe --abbrev=0 --tags')
}

function getShrinkwrapContent (revision) {
  return exec('git show ' + revision + ':npm-shrinkwrap.json')
}
