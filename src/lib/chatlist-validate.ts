class InvalidChatlistError extends TypeError {
  constructor(message, errors) {
    super(message);
    this.name = 'InvalidChatlistError';
    this.stack = errors
      .reverse()
      .map((error) => `${error.dataPath} ${error.message}`)
      .join('\n');
  }
}

export { InvalidChatlistError };
