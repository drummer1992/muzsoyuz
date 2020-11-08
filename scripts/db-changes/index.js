'use strict'

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })

const { Client } = require('pg')

const client = new Client({
  user    : process.env.POSTGRES_USER,
  host    : process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port    : process.env.POSTGRES_PORT,
})

const scripts = [
  require('./city'),
  require('./instruments'),
]

async function main() {
  await client.connect()

  for (const script of scripts) {
    await script(client)
  }

  await client.end()
}

main().catch(e => {
  console.error(e)

  process.exit(-1)
})
