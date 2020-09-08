# `cra-override-workspaces`

![npm](https://img.shields.io/npm/v/cra-override-workspaces?label=cra-override-workspaces)
<br/>
[![NPM](https://nodei.co/npm/cra-override-workspaces.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/package/cra-override-workspaces)

> customize-cra support lerna or yarn workspace

## Usage

```javascript
const craOverrideWorkspaces = require('cra-override-workspaces');
const { override } = require('customize-cra');

module.exports = override(craOverrideWorkspaces());
```
