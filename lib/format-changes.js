// Input object structure:
// {
//   name: 'request',
//   path: [],
//   current: {
//     version: '2.60.0',
//     from: 'request@2.60.0',
//     resolved: 'https://registry.npmjs.org/request/-/request-2.60.0.tgz'
//   },
//   previous: {
//     version: '2.59.1',
//     from: 'request@2.59.1',
//     resolved: 'https://registry.npmjs.org/request/-/request-2.59.1.tgz'
//   },
//   commits: [{
//     timestamp: new Date(),
//     author: 'Andrew Hutchings <andrew.hutchings@gmail.com>',
//     message: 'This is my commit message'
//   }]
// }

function formatChanges (change) {
  var formatted = `${change.name}\n` +
    `${change.previous.version}...${change.current.version}`

  if (change.commits.length > 0) {
    formatted += '\n\n' + change.commits.map(formatCommit).join('\n')
  }

  return formatted
}

function formatCommit (commit) {
  return `* ${commit.message} (${commit.author})`
}

module.exports = formatChanges
