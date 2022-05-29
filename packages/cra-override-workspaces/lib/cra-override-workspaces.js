const { monorepoDependenciesLocalPaths } = require('monorepo-dependencies');
const { override, getBabelLoader, removeModuleScopePlugin } = require('customize-cra');

module.exports = craOverrideWorkspaces;

function craOverrideWorkspaces(pkgName = process.env.npm_package_name) {
  process.env.SKIP_PREFLIGHT_CHECK = true;

  return override((config) => {
    const babelLoad = getBabelLoader(config);
    if (babelLoad) {
      babelLoad.include = [
        ...(Array.isArray(babelLoad.include) ? babelLoad.include : [babelLoad.include]),
        ...(monorepoDependenciesLocalPaths(pkgName) || []),
      ];
    }

    // replace esbuild swc loader
    ['esbuild', 'swc'].forEach((loaderName) => {
      const loaders = config.module.rules.find((rule) => Array.isArray(rule.oneOf)).oneOf;
      if (loaders) {
        const loader = loaders.find((rule) => {
          return rule.loader && rule.loader.includes(loaderName);
        });
        if (loader) {
          loader.include = [
            ...(Array.isArray(loader.include)
              ? loader.include
              : [loader.include]),
            ...(monorepoDependenciesLocalPaths(pkgName) || []),
          ];
        }
      }
    });

    return config;
  }, removeModuleScopePlugin());
}
