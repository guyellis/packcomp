/* eslint-disable no-console */

const _ = require('lodash');
const minimist = require('minimist');
const path = require('path');
const help = require('./help');
const debug = require('debug')('packcomp:cli');

require('console.table');

function diffObj(item, versions, titles) {
  const obj = {
    Module: item,
  };
  titles.forEach((title, index) => {
    obj[title] = versions[index];
  });
  debug('diffObj: %o', obj);
  return obj;
}

function diff(dependencies, titles) {
  // Make sure that at least 1 item in the array is an object
  const exist = dependencies.reduce((acc, item) => acc || !!item, false);

  if (!exist) {
    console.log('No dependencies');
    return;
  }

  // Get all dependency (keys) from each package.json and set them
  // to key in allDependencies. Assign an array to each keys with
  // the version numbers and a default of missing.
  const allDependencies = {};
  dependencies.forEach((dependency, index) => {
    Object.keys(dependency).forEach((key) => {
      if (!allDependencies[key]) {
        allDependencies[key] = _.times(dependencies.length, _.constant('missing'));
      }
      allDependencies[key][index] = dependency[key];
    });
  });

  // Remove all keys in allDependencies where the versions are all the same
  const diffs = [];
  Object.keys(allDependencies).forEach((key) => {
    const equal = allDependencies[key].reduce((a, b) => ((a === b) ? a : false));
    if (!equal) {
      diffs.push(diffObj(key, allDependencies[key], titles));
    }
  });

  console.table(diffs);
}

module.exports = () => {
  const argv = minimist(process.argv.slice(2));
  // argv._[0] - first package.json
  // argv._[1] - second package.json

  if (argv._.indexOf('help') >= 0 || argv._.length < 2) {
    help();
    return;
  }

  const titles = argv._.map((item) => {
    const loc = path.join(process.cwd(), item);
    const parts = _.trim(loc, '/').split('/');
    return _.last(parts) === 'package.json'
      ? parts[parts.length - 2]
      : _.last(parts);
  });
  debug('titles: %o', titles);

  const packages = argv._.map(item => (_.endsWith(item, 'package.json')
    ? path.join(process.cwd(), item)
    : path.join(process.cwd(), item, 'package.json')));
  debug('packages: %o', packages);

  const contents = packages.map((pack) => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const content = require(pack);
    return {
      dependencies: content.dependencies,
      devDependencies: content.devDependencies,
    };
  });

  function mapObjects(contentArray, key) {
    return contentArray.map(item => item[key]);
  }

  const dependencies = mapObjects(contents, 'dependencies');
  const devDependencies = mapObjects(contents, 'devDependencies');

  console.log('\nDependencies:');
  diff(dependencies, titles);

  console.log('\nDevDependencies:');
  diff(devDependencies, titles);
};

/* eslint-enable no-console */
