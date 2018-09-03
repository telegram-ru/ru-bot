import DotEnv from 'dotenv'
import dbConfig from '../config/database.json'


DotEnv.config()

const {
  BOT_TOKEN,
  NODE_ENV = 'development',
} = process.env

export const db = dbConfig[NODE_ENV]
export const bot = {
  token: BOT_TOKEN,
}
