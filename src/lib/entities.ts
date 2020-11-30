/**
 * each reconstruct should return string
 * @type {{[key: string]: (text: string, entity: {}) => string}}
 */
const reconstructors = {
  mention: (text) => text,
  hashtag: (text) => text,
  bot_command: (text) => text,
  url: (text) => text,
  email: (text) => text,
  bold: (text) => `*${text}*`,
  italic: (text) => `_${text}_`,
  code: (text) => `\`${text}\``,
  pre: (text) => `\`\`\`${text}\`\`\``,
  text_link: (text, entity) => `[${text}](${entity.url})`,
  text_mention: (text, entity) => `[${text}](tg://user?id=${entity.user.id})`,
};

function applyReconstructor(text, entity) {
  const head = text.substring(0, entity.offset);
  const tail = text.substring(entity.offset + entity.length);
  const source = text.substring(entity.offset, entity.offset + entity.length);
  const content = reconstructors[entity.type](source, entity);

  return `${head}${content}${tail}`;
}

function reconstructMarkdown(message) {
  const { entities, text } = message;

  return entities.reduceRight(applyReconstructor, text);
}

export { reconstructMarkdown };
