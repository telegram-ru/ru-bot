module.exports = {
  apps: [
    {
      name: 'RuBot',
      script: './src/index.js',
      exec_mode: 'fork',
      instances: 1,
      watch: false,
    },
  ],
}
