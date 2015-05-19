# packcomp

Compare the `dependencies` and `devDependencies` keys (sections) from
two `package.json` files.

# Install

`npm install packcomp -g`

# Usage

`packcomp <package.json #1> <package.json #2>`

If the version number is not identical or missing in one of the packages then it will be reported. If it is identical then it will be ignore and skipped (i.e. no output).

# Example

`packcomp . ../other-repo`

# Example Output

```
Dependencies:
Module         Package #1  Package #2
-------------  ----------  ----------
console.table  ^0.4.0      missing
debug          missing     ~2.2.0
object-path    missing     ~0.9.2
randomstring   missing     ~1.0.5
request        missing     ~2.55.0


DevDependencies:
Module               Package #1  Package #2
-------------------  ----------  ----------
eslint               ^0.21.2     ^0.21.1
chai                 missing     ^2.3.0
istanbul             missing     ^0.3.13
mocha                missing     ^2.2.4
npm-update-outdated  missing     ^0.1.4
pre-commit           missing     ^1.0.6
sinon                missing     ^1.14.1
```
