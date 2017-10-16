# ru_bot

## Installation

```shell
nvm install
nvm use
npm install
```

## Start

Production mode use `pm2`, see `process.config.js`

```shell
npm start
```


## Development

Development mode use `nodemon`

```shell
npm run dev
```

## Database

See config in `config/database.json`

```shell
# To run all migrations
npm run migrate

# To rollback latest migration
npm run rollback
```
