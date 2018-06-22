/* eslint-disable no-console */

const _ = require('lodash');
const debug = require('debug')('packcomp:engine');
const pivot = require('array-pivot');
const path = require('path');
const { getRemotePackage } = require('./remote');

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
    if (dependency) {
      Object.keys(dependency).forEach((key) => {
        if (!allDependencies[key]) {
          allDependencies[key] = _.times(dependencies.length, _.constant('missing'));
        }
        allDependencies[key][index] = dependency[key];
      });
    }
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
    return [];
  }

  return diffs;
};

const getTitles = (packages) => {
  const unique = {};
  let counter = 0;

  const titles = packages.map((pack) => {
    const { name } = pack;
    if (!name) {
      let nominalName;
      do {
        counter += 1;
        nominalName = `#${counter}`;
      } while (unique[nominalName]);
      unique[nominalName] = true;
      return nominalName;
    }

    let nominalName = name;
    while (unique[nominalName]) {
      counter += 1;
      nominalName = `${name} #${counter}`;
    }
    unique[nominalName] = true;
    return nominalName;
  });

  return titles;
};

const getFilter = argv => ((argv.f !== undefined) ? argv.f : '*');

const getPivot = argv => (argv.p !== undefined);

const isUrl = RegExp('^https?://');

const getContents = async (argv) => {
  const packages = argv._.map((item) => {
    if (isUrl.test(item)) {
      return getRemotePackage(item);
    }
    const fullPath = _.endsWith(item, 'package.json')
      ? path.join(process.cwd(), item)
      : path.join(process.cwd(), item, 'package.json');
    // eslint-disable-next-line global-require,import/no-dynamic-require
    return new Promise(resolve => resolve(require(fullPath)));
  });

  const contents = await Promise.all(packages);

  return contents.map(pack => _.pick(pack, [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'name',
  ]));
};

const getDependencies = async (argv) => {
  const filter = getFilter(argv);

  const doPivot = getPivot(argv);

  const contents = await getContents(argv);

  const titles = getTitles(contents);

  function mapObjects(contentArray, key) {
    return contentArray.map(item => item[key]);
  }

  const dependencies = mapObjects(contents, 'dependencies');
  const devDependencies = mapObjects(contents, 'devDependencies');
  const peerDependencies = mapObjects(contents, 'peerDependencies');

  if (doPivot) {
    return {
      dependencies: pivot(diff(dependencies, titles, filter)),
      devDependencies: pivot(diff(devDependencies, titles, filter)),
      peerDependencies: pivot(diff(peerDependencies, titles, filter)),
    };
  }

  return {
    dependencies: diff(dependencies, titles, filter),
    devDependencies: diff(devDependencies, titles, filter),
    peerDependencies: diff(peerDependencies, titles, filter),
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
