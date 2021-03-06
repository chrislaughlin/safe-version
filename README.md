# safe-version

[![npm package][npm-badge]][npm]

Safe version allows you to run the `npm version` command with out affecting your repo. It will:
- Check a version was provided
- Check for local changes that have not been committed
- Check that the branch is in sync with origin

Then version your project.

Add the script to your npm process or run as a global script. 

In your npm config add this script
```
npm bump: "safe-version"
```

Then run the following:
```
npm run bump -- --patch
```

Global
```
safe-version patch
```

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/safe-version
