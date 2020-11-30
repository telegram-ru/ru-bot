const allowWhiteListChat = async ({ chat, isChatInWhiteList }, next) => {
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
};

export { allowWhiteListChat };
