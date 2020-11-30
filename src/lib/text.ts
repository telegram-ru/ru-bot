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
  const count = variants.length;

  return (object) => variants[Math.floor(Math.random() * count)](object);
}

/**
 * Create full name of user "$first_name $last_name (@username)"
 * Example: Sergey Sova (@sergeysova)
 * @param {User} param0 Telegram User type
 * @return {string}
 */
function fullName({ first_name: first, last_name: last, username }) {
  return [
    first && first.trim(),
    last && last.trim(),
    username && `(@${username.trim()})`,
  ]
    .filter(Boolean)
    .join(' ');
}

function fullNameId(user) {
  return `${fullName(user)} #${user.id}`;
}

function fullNameIdLink(user) {
  const name = [
    user.first_name && user.first_name.trim(),
    user.last_name && user.last_name.trim(),
    user.id && `#${user.id}`,
  ]
    .filter(Boolean)
    .join(' ');

  return `[${name}](tg://user?id=${user.id})`;
}

function fullNameLink(user) {
  const name = [
    user.first_name && user.first_name.trim(),
    user.last_name && user.last_name.trim(),
  ]
    .filter(Boolean)
    .join(' ');

  return `[${name}](tg://user?id=${user.id})`;
}

/**
 *
 * @param {Chat} param0
 * @return {string}
 */
function chatTitle({ title, username, id, type }) {
  const parts = [
    title && title.trim(),
    username && `(@${username.trim()})`,
  ].filter(Boolean);

  if (parts.length === 0) {
    parts.push(`${type}:${id}`);
  }

  return parts.join(' ');
}

// eslint-disable-next-line no-unused-vars
function chatLink({ title: titleRaw, username, id, type }) {
  const title = titleRaw.trim() || '<[unnamed]>';

  if (username) {
    return `[${title}](https://t.me/${username})`;
  }

  return `_private_ ${title}`;
}

function russianSpeaking(group) {
  if (group.title.includes('—')) {
    return {
      ...group,
      title: group.title.split('—')[0].trim(),
    };
  }
  return group;
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
  return cases[value] || defaultCase;
}

/**
 * Join list of messages with \n
 * @param {string[]} list
 * @return {string}
 */
function column(...list) {
  return list.join('\n');
}

export {
  random,
  fullName,
  fullNameId,
  fullNameIdLink,
  fullNameLink,
  chatTitle,
  chatLink,
  select,
  column,
  russianSpeaking,
};
