const _ = require('lodash');
const debug = require('debug')('packcomp:engine');
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

  return (diffs.length === 0) ? [] : diffs;
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

const getFilter = (argv) => ((argv.f !== undefined) ? argv.f : '*');

// eslint-disable-next-line prefer-regex-literals
const isUrl = RegExp('^https?://');

const getContents = async (argv) => {
  const packages = argv._.map((item) => {
    if (isUrl.test(item)) {
      return getRemotePackage(item);
    }
    const fullPath = _.endsWith(item, 'package.json')
      ? path.join(process.cwd(), item)
      : path.join(process.cwd(), item, 'package.json');
    // eslint-disable-next-line global-require,import/no-dynamic-require,no-promise-executor-return
    return new Promise((resolve) => resolve(require(fullPath)));
  });

  const contents = await Promise.all(packages);

  return contents.map((pack) => _.pick(pack, [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'name',
  ]));
};

const pivotDependencies = (results) => {
  // Elements in array have:
  /*
  {
    Module: 'async',
    'http-status-check': '2.6.1',
    learn: 'missing'
  }
  {
    Module: 'debug',
    'http-status-check': '3.1.0',
    learn: 'missing'
  }

  We want to change this to:

  {
    Repo: 'http-status-check',
    'async': '2.6.1'
    'debug': '3.1.0',
  }
  {
    Repo: 'learn',
    'async': 'missing'
    'debug': 'missing',
  }
  */

  const flipArray = (collection) => {
    if (!collection || !collection.length) {
      return collection;
    }

    // Use the first item in the collection to generate an index of all the
    // modules:
    const [first] = collection;
    const index = Object.keys(first).reduce((acc, key) => {
      if (key !== 'Module') {
        acc[key] = {};
      }
      return acc;
    }, {});

    collection.forEach((item) => {
      const { Module: module } = item;
      Object.keys(item).forEach((dep) => {
        if (dep !== 'Module') {
          const value = item[dep];
          index[dep][module] = value;
        }
      });
    });

    return Object.keys(index).map((key) => ({
      Repo: key,
      ...index[key],
    }));
  };

  return ['dependencies', 'devDependencies', 'peerDependencies'].reduce((acc, type) => {
    acc[type] = flipArray(results[type]);
    return acc;
  }, {});
};

const getDependencies = async (argv) => {
  const filter = getFilter(argv);

  const contents = await getContents(argv);

  const titles = getTitles(contents);

  function mapObjects(contentArray, key) {
    return contentArray.map((item) => item[key]);
  }

  const dependencies = mapObjects(contents, 'dependencies');
  const devDependencies = mapObjects(contents, 'devDependencies');
  const peerDependencies = mapObjects(contents, 'peerDependencies');

  const results = {
    dependencies: diff(dependencies, titles, filter),
    devDependencies: diff(devDependencies, titles, filter),
    peerDependencies: diff(peerDependencies, titles, filter),
  };

  return argv.p ? pivotDependencies(results) : results;
};

module.exports = {
  diff,
  getTitles,
  getFilter,
  getContents,
  getDependencies,
};
