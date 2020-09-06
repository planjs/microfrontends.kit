module.exports = craOverrideDefine;

function findWebpackPlugin(plugins, pluginName) {
  return plugins.find(plugin => plugin.constructor.name === pluginName);
}

function overrideProcessEnv(value) {
  return function (config) {
    const plugin = findWebpackPlugin(config.plugins, 'DefinePlugin');
    const processEnv = plugin.definitions['process.env'] || {};

    plugin.definitions['process.env'] = {
      ...processEnv,
      ...value,
    };

    return config;
  };
}

function craOverrideDefine(processEnv) {
  return overrideProcessEnv(processEnv);
}
