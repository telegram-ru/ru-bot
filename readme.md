# ru_bot [![Build Status](https://travis-ci.org/telegram-ru/ru-bot.svg?branch=dev)](https://travis-ci.org/telegram-ru/ru-bot) [![codecov](https://codecov.io/gh/telegram-ru/ru-bot/branch/dev/graph/badge.svg)](https://codecov.io/gh/telegram-ru/ru-bot)


## Installation

For more better development conditions, you need to install [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/)

Also, we advise you to install all devdependencies locally (linters, etc):

`npm install`

Don't forget to create `.env` (from `.env.example`) and `src/.chatlist.json` (from `src/.chalist.example.json`).

When you made all steps above, run
```bash
docker-compose pull
docker-compose up -d postgres
docker-compose up --build app
```
Your application will automatically restart with nodemon after code changes (in src directory). 

Create commits through [`commitizen`](https://github.com/commitizen/cz-cli):

```shell
npm install --global commitizen

# commit
git cz
```

Use next commands to manipulate db schema:

```shell
# To run all migrations
npm run migrate

# To rollback latest migration
npm run rollback
```

