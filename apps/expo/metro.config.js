// metro.config.js
// Learn more: https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config') // ← CHANGE THIS LINE
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(__dirname, '../..') // monorepo root

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
  minifierPath: require.resolve('metro-minify-terser'),
}

module.exports = config
