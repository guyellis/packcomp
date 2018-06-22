/* eslint-disable no-console */

const _ = require('lodash');
const debug = require('debug')('packcomp:engine');
const path = require('path');

const diffObj = (item, versions, titles) => {
  const obj = {
    Module: item,
  };
  titles.forEach((title, index) => {
    obj[title] = versions[index];
  });
  debug('diffObj: %o', obj);
  return obj;
};

const diff = (dependencies, titles, filter) => {
  // Make sure that at least 1 item in the array is an object
  const exist = dependencies.reduce((acc, item) => acc || !!item, false);

  if (!exist) {
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
      if (filter !== '*') {
        if (key.match(filter)) {
          diffs.push(diffObj(key, allDependencies[key], titles));
        }
      } else {
        diffs.push(diffObj(key, allDependencies[key], titles));
      }
    }
  });

  if (diffs.length === 0) {
    console.log('No Matches');
    return [];
  }

  return diffs;
};

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

const getFilter = (argv) => {
  if (argv.f !== undefined) {
    return argv.f;
  }

  return '*';
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

const getDependencies = (argv) => {
  const filter = getFilter(argv);

  const titles = getTitles(argv);

  const contents = getContents(argv);

  function mapObjects(contentArray, key) {
    return contentArray.map(item => item[key]);
  }

  const dependencies = mapObjects(contents, 'dependencies');
  const devDependencies = mapObjects(contents, 'devDependencies');
  const peerDependencies = mapObjects(contents, 'peerDependencies');

  return {
    dependencies: diff(dependencies, titles, filter),
    devDependencies: diff(devDependencies, titles, filter),
    peerDependencies: diff(peerDependencies, titles),
  };
};

module.exports = {
  diff,
  getTitles,
  getFilter,
  getContents,
  getDependencies,
};

/* eslint-enable no-console */
