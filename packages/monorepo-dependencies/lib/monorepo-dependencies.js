const path = require('path');
const fs = require('fs');
const loadJsonFileSync = require('load-json-file').sync;
const { makeSyncFileFinder } = require('@lerna/project/lib/make-file-finder');
const { Package } = require('@lerna/package');
const { Project } = require('@lerna/project');
const { PackageGraph } = require('@lerna/package-graph');
const findYarnWorkspaceRoot = require('find-yarn-workspace-root');
const { spawn } = require('./spawn');

module.exports.lernaDependenciesProject = lernaDependenciesProject;
module.exports.yarnWorkspaceDependenciesLocalPaths = yarnWorkspaceDependenciesLocalPaths;
module.exports.monorepoDependenciesLocalPaths = monorepoDependenciesLocalPaths;

function getLernaPackagesSync(project) {
  const finder = makeSyncFileFinder(project.rootPath, project.packageConfigs);

  return finder('package.json', packageConfigPath => {
    const packageJson = loadJsonFileSync(packageConfigPath);
    return new Package(
      packageJson,
      path.dirname(packageConfigPath),
      project.rootPath
    );
  });
}

function lernaDependenciesProject(appName, baseDir = process.cwd()) {
  const project = new Project(baseDir);
  const packages = getLernaPackagesSync(project);
  const packageGraph = new PackageGraph(
    packages,
    'allDependencies',
    'forceLocal'
  );
  const currentNode = packageGraph.get(appName);
  if (!currentNode) {
    return undefined;
  }

  const dependencies = new Set(currentNode.localDependencies.keys());
  const dependenciesToExplore = new Set(dependencies);
  dependenciesToExplore.delete(appName);

  while (dependenciesToExplore.size > 0) {
    const packageName = dependenciesToExplore.values().next().value;
    dependenciesToExplore.delete(packageName);
    const node = packageGraph.get(packageName);
    const newDependencies = new Set(node.localDependencies.keys());
    newDependencies.delete(appName);

    for (const d of newDependencies.values()) {
      if (!dependencies.has(d)) {
        dependenciesToExplore.add(d);
        dependencies.add(d);
      }
    }
  }

  return Array.from(dependencies).map(dependencyName =>
    packageGraph.get(dependencyName)
  );
}

function yarnWorkspaceDependenciesLocalPaths(appName, baseDir = process.cwd()) {
  const dependencies = JSON.parse(
    spawn('yarn -s workspaces info json', baseDir)
  );
  const root = findYarnWorkspaceRoot(baseDir);
  const project = dependencies[appName];
  if (!project) {
    return undefined;
  }
  const { workspaceDependencies } = project;
  return workspaceDependencies.map(v =>
    path.resolve(root, workspaceDependencies[v].location)
  );
}

/**
 * Get the local dependency package path of lerna and yarn in the workspace
 * @param appName
 * @param baseDir
 * @return {string[]}
 */
function monorepoDependenciesLocalPaths(appName, baseDir) {
  const projects = lernaDependenciesProject(appName, baseDir);
  if (!projects) {
    return yarnWorkspaceDependenciesLocalPaths(appName, baseDir);
  }
  return projects.map(project => {
    const resolvedPath = fs.realpathSync(project.location);
    return path.resolve(resolvedPath);
  });
}
