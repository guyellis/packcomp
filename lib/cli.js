'use strict';

var _ = require('lodash');
var minimist = require('minimist');
var path = require('path');
var help = require('./help');
require('console.table');

function diffObj(item, one, two) {
  return {
    "Module": item,
    "Package #1": one ? one : 'missing',
    "Package #2": two ? two : 'missing'
  };
}

function diff(one, two) {
  if(one && two) {
    var diffs = [];
    Object.keys(one).forEach(function(item){
      if(one[item] !== two[item]) {
        diffs.push(diffObj(item, one[item], two[item]));
      }
      delete two[item];
    });
    Object.keys(two).forEach(function(item){
      diffs.push(diffObj(item, null, two[item]));
    });
    console.table(diffs);
  } else {
    if(!one) {
      console.log('Package #1 - no dependencies');
    }
    if(!two) {
      console.log('Package #2 - no dependencies');
    }
  }
}

module.exports = function() {
  var argv = minimist(process.argv.slice(2));
  // argv._[0] - first package.json
  // argv._[1] - second package.json

  if(argv._.indexOf('help') >= 0 ||
    argv._.length < 2 || argv._.length > 2) {
    help();
    return;
  }

  var packages = argv._.map(function(item) {
    return _.endsWith('package.json')
    ? path.join(process.cwd(), item)
    : path.join(process.cwd(), item, 'package.json');
  });
  

  var contents = packages.map(function(pack){
    var content = require(pack);
    return {
      dependencies: content.dependencies,
      devDependencies: content.devDependencies
    };
  });

  console.log('\nDependencies:');
  diff(contents[0].dependencies, contents[1].dependencies);

  console.log('\nDevDependencies:');
  diff(contents[0].devDependencies, contents[1].devDependencies);
};
