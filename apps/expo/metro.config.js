// metro.config.js
// Learn more: https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(__dirname, '../..') // monorepo root

console.log('Using projectRoot:', projectRoot)
console.log('Using workspaceRoot:', workspaceRoot)

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot)

// ---- your custom tweaks ----
config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// Work-around for supabase-js export bug
config.resolver.unstable_enablePackageExports = false

// Allow require.context + use terser
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
  _expoRelativeProjectRoot: projectRoot,
  minifierPath: require.resolve('metro-minify-terser'),
}

module.exports = config
