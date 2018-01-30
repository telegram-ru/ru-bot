# ru_bot [![Build Status](https://travis-ci.org/telegram-ru/ru-bot.svg?branch=dev)](https://travis-ci.org/telegram-ru/ru-bot) [![codecov](https://codecov.io/gh/telegram-ru/ru-bot/branch/dev/graph/badge.svg)](https://codecov.io/gh/telegram-ru/ru-bot)


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

Create commits through [`commitizen`](https://github.com/commitizen/cz-cli):

```shell
npm install --global commitizen

# commit
git cz
```

## Database

See config in `config/database.json`

Login to psql:

```sql
create role rubot with login password 'rubot';

create database rubot_development;
create database rubot_test;
create database rubot_production;

grant all privileges on database rubot_development to rubot;
grant all privileges on database rubot_test to rubot;
grant all privileges on database rubot_production to rubot;
```

Add next line to `pg_hba.conf` (change `9.6` to your postgres version):

- linux: `/etc/postgresql/9.6/main/`
- macOS: `/usr/local/var/postgres/`

```
local   all             rubot                                 md5
```
Restart postgres.



Use next commands to manipulate db schema:

```shell
# To run all migrations
npm run migrate

# To rollback latest migration
npm run rollback
```

