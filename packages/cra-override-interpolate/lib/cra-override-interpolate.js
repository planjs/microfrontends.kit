'use strict';

module.exports = craOverrideInterpolate;

function findWebpackPlugin(plugins, pluginName) {
  return plugins.find(plugin => plugin.constructor.name === pluginName);
}

function overrideReplacements(value) {
  return function (config) {
    const plugin = findWebpackPlugin(config.plugins, 'InterpolateHtmlPlugin');
    const raw = plugin.replacements || {};

    plugin.replacements = {
      ...raw,
      ...value,
    };

    return config;
  };
}

function craOverrideInterpolate(raw) {
  return overrideReplacements(raw);
}
