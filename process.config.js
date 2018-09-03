module.exports = {
  apps: [
    {
      name: 'ru_bot',
      script: './src/index.js',
      exec_mode: 'fork',
      instances: 1,
      watch: false,
    },
  ],
}
