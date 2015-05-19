'use strict';

module.exports = function() {
  var help =
    '\n' +
    '\n  Usage: packcomp <package.json #1> <package.json #2>' +
    '\n' +
    '\n         <package.json> can also just be the location. ' +
    '\n         package.json will be appended if not specified. ' +
    '\n';
  console.log(help);
};
