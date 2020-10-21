'use strict'

class Sql {
  constructor(table, client) {
    this.client = client
    this.table = table
    this.query = ''
  }

  where(whereClause) {
    this.query += ' WHERE '

    if (typeof whereClause === 'string') {
      this.query += whereClause
    } else {
      this.query = Object.keys(whereClause)
        .reduce((acc, key) => {
          return acc += `${key}=${whereClause[key]}`
        }, this.query)
    }

    return this
  }

  create(data) {
    const columns = Object.keys(data[0]).map(value => `"${value}"`).join(',')

    this.query = `INSERT INTO "${this.table}" (${columns}) VALUES `

    const values = data
      .map(item => `(${Object.values(item).map(value => `'${value}'`).join(',')})`)
      .join(',')

    this.query += values

    return this
  }

  delete(where) {
    this.query = `DELETE FROM "${this.table}"`

    if (where) {
      return this.where(where)
    }

    return this
  }

  async execute() {
    await this.client.query(this.query)

    this.query = ''

    return this
  }
}

module.exports = Sql