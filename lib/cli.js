/* eslint-disable no-console */

const minimist = require('minimist');
const help = require('./help');
const engine = require('./engine');

require('console.table');

const { diff, getTitles, getFilter, getContents } = engine;

module.exports = (procArgv) => {
  const argv = minimist(procArgv.slice(2));
  // argv._[0] - first package.json
  // argv._[1] - second package.json

  if (argv._.indexOf('help') >= 0 || argv._.length < 2) {
    help();
    return;
  }

  const filter = getFilter(argv);

  const titles = getTitles(argv);

  const contents = getContents(argv);

  function mapObjects(contentArray, key) {
    return contentArray.map(item => item[key]);
  }

  const dependencies = mapObjects(contents, 'dependencies');
  const devDependencies = mapObjects(contents, 'devDependencies');
  const peerDependencies = mapObjects(contents, 'peerDependencies');

  console.log('\nDependencies:');
  let diffs = diff(dependencies, titles, filter);
  console.table(diffs);

  console.log('\nDevDependencies:');
  diffs = diff(devDependencies, titles, filter);
  console.table(diffs);

  console.log('\npeerDependencies:');
  diffs = diff(peerDependencies, titles);
  console.table(diffs);
};

/* eslint-enable no-console */
