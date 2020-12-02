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
function random(variants: Array<(...any) => string>) {
  const count = variants.length;

  return (object) => variants[Math.floor(Math.random() * count)](object);
}

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

function chatLink({ title: titleRaw, username }) {
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

export {
  random,
  fullName,
  fullNameId,
  fullNameIdLink,
  fullNameLink,
  chatLink,
  russianSpeaking,
};
