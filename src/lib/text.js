/**
 * Select random function and call it with arguments
 * @param {Function[]} variants
 * @return {Function}
 * @example
 * const transl = {
 *   name: random([
 *     value => `translate(${value})`,
 *     () => `other variant`,
 *   ])
 * }
 */
function random(variants) {
  const count = variants.length

  return (object) => variants[Math.floor(Math.random() * count)](object)
}

/**
 * Create full name of user "$first_name $last_name (@username)"
 * Example: Sergey Sova (@sergeysova)
 * @param {User} param0 Telegram User type
 * @return {string}
 */
function fullName({ first_name: first, last_name: last, username }) {
  return [
    first,
    last,
    username && `(@${username})`,
  ]
    .filter((e) => !!e)
    .join(' ')
}

function fullNameId(user) {
  return `${fullName(user)} #${user.id}`
}

/**
 *
 * @param {Chat} param0
 * @return {string}
 */
function chatTitle({ title, username, id, type }) {
  const parts = [
    title,
    username && `(@${username})`,
  ].filter((e) => !!e)

  if (parts.length === 0) {
    parts.push(`${type}:${id}`)
  }

  return parts.join(' ')
}

/**
 * Like switch case, but function
 * Select key by $value from $cases
 * Return $defaultCase if $cases[$value] not found
 * @param {any} value
 * @param {{}} cases
 * @param {any} defaultCase
 */
function select(value, cases, defaultCase) {
  return cases[value] || defaultCase
}

/**
 * Join list of messages with \n
 * @param {string[]} list
 * @return {string}
 */
function column(...list) {
  return list.join('\n')
}

module.exports = {
  random,
  fullName,
  fullNameId,
  chatTitle,
  select,
  column,
}
