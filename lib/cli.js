'use strict';

var _ = require('lodash');
var minimist = require('minimist');
var path = require('path');
var help = require('./help');
var debug = require('debug')('packcomp:cli');

require('console.table');

function diffObj(item, versions, titles) {
  var obj = {
    "Module": item
  };
  titles.forEach(function (title, index){
    obj[title] = versions[index];
  });
  debug('diffObj: %o', obj);
  return obj;
}

function diff(dependencies, titles) {
  // Make sure that at least 1 item in the array is an object
  var exist = dependencies.reduce(function(acc, item) {
    acc = acc || !!item;
    return acc;
  }, false);

  if(!exist) {
    console.log('No dependencies');
    return;
  }

  // Get all dependency (keys) from each package.json and set them
  // to key in allDependencies. Assign an array to each keys with
  // the version numbers and a default of missing.
  var allDependencies = {};
  dependencies.forEach(function (dependency, index){
    Object.keys(dependency).forEach(function (key){
      if(!allDependencies[key]) {
        allDependencies[key] = _.times(dependencies.length, _.constant('missing'));
      }
      allDependencies[key][index] = dependency[key];
    });
  });

  // Remove all keys in allDependencies where the versions are all the same
  var diffs = [];
  Object.keys(allDependencies).forEach(function (key){
    var equal = allDependencies[key].reduce(function (a, b){
      return (a === b) ? a : false;
    });
    if(!equal){
      diffs.push(diffObj(key, allDependencies[key], titles));
    }
  });

  console.table(diffs);
}

module.exports = function() {
  var argv = minimist(process.argv.slice(2));
  // argv._[0] - first package.json
  // argv._[1] - second package.json

  if(argv._.indexOf('help') >= 0 || argv._.length < 2) {
    help();
    return;
  }

  var titles = argv._.map(function(item) {
    var loc = path.join(process.cwd(), item);
    var parts = _.trim(loc, '/').split('/');
    return _.last(parts) === 'package.json'
      ? parts[parts.length - 2]
      : _.last(parts);
  });
  debug('titles: %o', titles);

  var packages = argv._.map(function(item) {
    return _.endsWith(item, 'package.json')
    ? path.join(process.cwd(), item)
    : path.join(process.cwd(), item, 'package.json');
  });
  debug('packages: %o', packages);

  var contents = packages.map(function(pack){
    var content = require(pack);
    return {
      dependencies: content.dependencies,
      devDependencies: content.devDependencies
    };
  });

  function mapObjects(contentArray, key) {
    return contentArray.map(function (item) {
      return item[key];
    });
  }

  var dependencies = mapObjects(contents, 'dependencies');
  var devDependencies = mapObjects(contents, 'devDependencies');

  console.log('\nDependencies:');
  diff(dependencies, titles);

  console.log('\nDevDependencies:');
  diff(devDependencies, titles);
};
