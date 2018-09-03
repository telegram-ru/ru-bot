const glob = require('glob');
const pipe = require('ramda.pipe')


const replace = (from, to = '') => (path) => path.replace(from, to)
const prefix = (vl) => (path) => vl + path
const firstup = () => (path) => path.charAt(0).toUpperCase() + path.slice(1)

/**
 * @param {string} pattern
 * @param {(path: string) => string} fn
 */
const find = (pattern, ...fns) => glob.sync(pattern)
  .map(pipe(...fns))
  .filter(Boolean)

/**
 * Check `path` to not include substring in `variants`
 * @param {string[]} variants
 * @return {(path: string) => boolean}
 */
const exclude = (...variants) => (path) =>
  variants.every((variant) => !path.includes(variant))

/**
 * Check `path` to include substring of one of `variants`
 * @param {string[]} variants
 * @return {(path: string) => boolean}
 */
const include = (...variants) => (path) =>
  variants.some((variant) => path.includes(variant))

module.exports = {
  types: [
    { value: 'feat', name: 'feat:     A new feature' },
    { value: 'fix', name: 'fix:      A bug fix' },
    { value: 'docs', name: 'docs:     Documentation only changes' },
    { value: 'style', name: 'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)' },
    { value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature' },
    { value: 'chore',  name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation' },
    { value: 'config', name: 'config:   Changes in the configuration files' },
    { value: 'perf', name: 'perf:     A code change that improves performance' },
    { value: 'test', name: 'test:     Adding missing tests' },
    { value: 'revert', name: 'revert:   Revert to a commit' },
    { value: 'WIP', name: 'WIP:      Work in progress' },
  ],
  scopes: [
    { name: 'index' },
    { name: 'lib' },
    ...find('src/models/*.*', replace('src/models/'), replace('.mjs'), firstup()).filter(exclude('Index')),

  ],
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix', 'revert'],
}
