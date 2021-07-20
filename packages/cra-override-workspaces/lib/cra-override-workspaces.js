const { monorepoDependenciesLocalPaths } = require('monorepo-dependencies');
const {
  override,
  getBabelLoader,
  removeModuleScopePlugin,
} = require('customize-cra');

module.exports = craOverrideWorkspaces;

function craOverrideWorkspaces(pkgName = process.env.npm_package_name) {
  process.env.SKIP_PREFLIGHT_CHECK = true;

  return override(config => {
    const babelLoad = getBabelLoader(config);
    babelLoad.include = [
      ...(Array.isArray(babelLoad.include)
        ? babelLoad.include
        : [babelLoad.include]),
      ...(monorepoDependenciesLocalPaths(pkgName) || []),
    ];
    return config;
  }, removeModuleScopePlugin());
}
