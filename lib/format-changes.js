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
//   changes: [{
//     author: 'Andrew Hutchings <andrew.hutchings@gmail.com>',
//     message: 'This is my commit message'
//   }]
// }

function formatChanges ({name, current, previous, changes}) {
  return `
    ${name}
    ${previous.version}...${current.version}

    ${changes.map(formatChange)}
  `
}

function formatChange (change) {
  return `* ${change.message}`
}

module.exports = formatChanges
