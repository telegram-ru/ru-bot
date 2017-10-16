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

Login to psql:

```sql
create role rubot with login password 'rubot';

create database rubot_development;
create database rubot_test;
create database rubot_production;

grant all privileges on database rubot_legacy to rubot;
grant all privileges on database rubot_test to rubot;
grant all privileges on database rubot_production to rubot;
```

Add next line to `/etc/postgresql/9.6/main/pg_hba.conf` (change `9.6` to your postgres version)

```
local   all             rubot                                 md5
```

Use next commands to manipulate db schema:

```shell
# To run all migrations
npm run migrate

# To rollback latest migration
npm run rollback
```

