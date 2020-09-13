# `monorepo-dependencies`

![npm](https://img.shields.io/npm/v/monorepo-dependencies?label=monorepo-dependencies)
<br/>
[![NPM](https://nodei.co/npm/monorepo-dependencies.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/package/monorepo-dependencies)

> Get the local dependency package path of `lerna` and `yarn` in the workspace

## Usage

```javascript
const { monorepoDependenciesLocalPaths } = require('monorepo-dependencies');

monorepoDependenciesLocalPaths('@scope/core');
```

In the `yarn` or `lerna` workspace, obtain the local dependency package path through the package name.
