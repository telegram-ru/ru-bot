

/* eslint-disable no-restricted-syntax */
/**
 * @param {object} bot
 * @param {object[]} fnMapList
 */
const install = (bot, fnMapList) => {
  for (const fnMap of fnMapList) {
    // install(bot, [[fn, fn], [fn, fn, fn], [fn]])
    if (Array.isArray(fnMap)) {
      for (const fn of fnMap) {
        if (typeof fn !== 'function' || fn.length !== 1) {
          throw new TypeError('Installer should be function with one parameter')
        }

        fn(bot)
      }
    }
    else { // install(bot, [{a: fn, b: fn}, {c: fn, d: fn}, {a: fn}])
      for (const name of Object.keys(fnMap)) {
        const fn = fnMap[name]

        if (typeof fn !== 'function' || fn.length !== 1) {
          throw new TypeError('Installer should be function with one parameter')
        }

        fn(bot)
      }
    }
  }
}
/* eslint-enable no-restricted-syntax */

module.exports = {
  install,
}
