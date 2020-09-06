const { monorepoDependenciesLocalPaths } = require('monorepo-dependencies');

module.exports = craOverrideWorkspaces;

function craOverrideWorkspaces() {
  process.env.SKIP_PREFLIGHT_CHECK = true;
  const { paths } = require('react-app-rewired');
  const {
    removeModuleScopePlugin,
    babelInclude,
    override,
  } = require('customize-cra');

  return override(
    removeModuleScopePlugin(),
    babelInclude([
      paths.appSrc,
      ...monorepoDependenciesLocalPaths(process.env.npm_package_name),
    ])
  );
}
