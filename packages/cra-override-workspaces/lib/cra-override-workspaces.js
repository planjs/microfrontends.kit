const { monorepoDependenciesLocalPaths } = require('monorepo-dependencies');
const {
  removeModuleScopePlugin,
  babelInclude,
  override,
} = require('customize-cra');

module.exports = craOverrideWorkspaces;

function craOverrideWorkspaces(appSrc, pkgName = process.env.npm_package_name) {
  process.env.SKIP_PREFLIGHT_CHECK = true;

  return override(
    removeModuleScopePlugin(),
    babelInclude([appSrc, ...monorepoDependenciesLocalPaths(pkgName)])
  );
}
