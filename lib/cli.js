
const minimist = require('minimist');
const help = require('./help');
const engine = require('./engine');

require('console.table');

const {
  getDependencies,
} = engine;

module.exports = async (procArgv) => {
  const argv = minimist(procArgv.slice(2));
  // argv._[0] - first package.json
  // argv._[1] - second package.json

  if (argv._.indexOf('help') >= 0 || argv._.length < 2) {
    help();
    return;
  }

  const {
    dependencies,
    devDependencies,
    peerDependencies,
  } = await getDependencies(argv);

  /* eslint-disable no-console */
  console.log('\nDependencies:');
  console.table(dependencies);

  console.log('\nDevDependencies:');
  console.table(devDependencies);

  console.log('\npeerDependencies:');
  console.table(peerDependencies);
  /* eslint-enable no-console */
};
