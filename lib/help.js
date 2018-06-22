/* eslint-disable no-console */

module.exports = () => {
  const help = '\n'
    + '\n  Usage: packcomp <package.json #1> <package.json #2> [<package.json #3>...]'
    + '\n'
    + '\n         <package.json> can also just be the location. '
    + '\n         package.json will be appended if not specified. '
    + '\n';
  console.log(help);
};

/* eslint-enable no-console */
