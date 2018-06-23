# packcomp

[![Greenkeeper badge](https://badges.greenkeeper.io/guyellis/packcomp.svg)](https://greenkeeper.io/)

[![Dependency Status](https://david-dm.org/guyellis/packcomp.svg)](https://david-dm.org/guyellis/packcomp)
[![Code Climate](https://codeclimate.com/github/guyellis/packcomp/badges/gpa.svg)](https://codeclimate.com/github/guyellis/packcomp)

Compare the `dependencies` and `devDependencies` keys (sections) from
two or more `package.json` files.

# Install

`npm install packcomp -g`

# Usage

`packcomp <package.json #1> <package.json #2> [<package.json #3>...]`

If the version number is not identical or missing in one of the packages then it will
be reported. If it is identical in all packages then it will be ignored and skipped
(i.e. no output).

The package.json files can be relative paths to local files or URLs that will return a
package.json object or a mixture of both.

# Examples
```
packcomp . ../other-repo1 ../other-repo2

packcomp ../path/to/package/file/ https://<somedomain.com>/<some-path>/package.json
```

# Example Output
```
Dependencies:
Module         Repo #1   Repo #2   Repo #3
-------------  --------  --------  -----------------
console.table  ^0.4.0    missing   missing
debug          ^2.2.0    ^2.2.0    2.1.3
lodash         ^3.9.3    ^3.9.1    3.8.0
minimist       ^1.1.1    ^1.1.1    missing
randomstring   missing   ^1.0.5    missing
request        missing   ^2.55.0   missing
async          missing   missing   0.9.0
node-cache     missing   missing   2.1.1
redis          missing   missing   0.12.1


DevDependencies:
Module               Repo #1   Repo #2   Repo #3
-------------------  --------  --------  -----------------
eslint               ^0.22.1   ^0.21.1   ^0.20.0
chai                 missing   ^2.3.0    missing
istanbul             missing   ^0.3.13   ^0.3.13
mocha                missing   ^2.2.4    ^2.2.4
npm-update-outdated  missing   ^0.1.4    ^0.1.4
pre-commit           missing   ^1.0.6    ^1.0.6
sinon                missing   ^1.14.1   ^1.14.1  
```

# Filter Example
```
packcomp -f 'n*' . ../other-repo1 ../other-repo2
```

# Filtered Example Output
```
Dependencies:
Module         Repo #1   Repo #2   Repo #3
-------------  --------  --------  -----------------
node-cache     missing   missing   2.1.1


DevDependencies:
Module               Repo #1   Repo #2   Repo #3
-------------------  --------  --------  -----------------
npm-update-outdated  missing   ^0.1.4    ^0.1.4
```

# Pivot Example
```
packcomp -p true 'n*' . ../other-repo1 ../other-repo2
```

# Pivot Example Output
```
Dependencies:
Repo     console.table  debug   lodash  minimist  randomstring  request  async    node-cache  redis
-------  -------------  ------  ------  --------  ------------  -------  -------  ----------  -------
Repo #1  ^0.4.0         ^2.2.0  ^3.9.3  ^1.1.1    missing       missing  missing  missing     missing
Repo #2  missing        ^2.2.0  ^3.9.1  ^1.1.1    ^1.0.5        ^2.55.0  missing  missing     missing
Repo #3  missing        2.1.3   3.8.0   missing   missing       missing  0.9.0    2.1.1       0.12.1

DevDependencies:
Repo     eslint   chai     istanbul  mocha    npm-update-outdated  pre-commit  sinon
-------  -------  -------  --------  -------  -------------------  ----------  -------
Repo #1  ^0.22.1  missing  missing   missing  missing              missing     missing
Repo #2  ^0.21.1  ^2.3.0   ^0.3.13   ^2.2.4   ^0.1.4               ^1.0.6      ^1.14.1
Repo #3  ^0.20.0  missing  ^0.3.13   ^2.2.4   ^0.1.4               ^1.0.6      ^1.14.1
```

