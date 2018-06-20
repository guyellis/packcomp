/* eslint-disable no-console */

const _ = require('lodash');
const debug = require('debug')('packcomp:engine');
const path = require('path');

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
    return [];
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

  return diffs;
}

const getTitles = (argv) => {
  const titles = argv._.map((item) => {
    const loc = path.join(process.cwd(), item);
    const parts = _.trim(loc, '/').split('/');
    return _.last(parts) === 'package.json'
      ? parts[parts.length - 2]
      : _.last(parts);
  });
  debug('titles: %o', titles);
  return titles;
};

const getContents = (argv) => {
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

  return contents;
};

module.exports = {
  diff,
  getTitles,
  getContents,
};

/* eslint-enable no-console */
