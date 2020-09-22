'use strict'

const fs = require('fs').promises

module.exports = () => fs.mkdir(process.env.LOG_PATH)
  .then(() => console.log(`Log folder was created: ${process.env.LOG_PATH}`))
  .catch(e => {
    if (e.code === 'EEXIST') {
      console.warn(`Log folder already exists: ${process.env.LOG_PATH}`)
    } else {
      throw new Error(e.message)
    }
  })