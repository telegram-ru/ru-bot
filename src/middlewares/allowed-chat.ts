async function allowWhiteListChat(ctx, next) {
  const { chat, isChatInWhiteList } = ctx;
  console.log(
    'allowWhiteListChat',
    chat.id,
    chat.type,
    isChatInWhiteList(chat),
  );
  if (isChatInWhiteList(chat)) {
    return next();
  }

  return null;
}

export { allowWhiteListChat };
