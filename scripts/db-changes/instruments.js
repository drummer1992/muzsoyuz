'use strict'

const Sql = require('./helpers/sql')

const Instrument = {
  GUITAR  : 'guitar',
  DRUMS   : 'drums',
  VOICE   : 'voice',
  BAS     : 'bas',
  KEYS    : 'keys',
  SAX     : 'sax',
  TRUMPET : 'trumpet',
  TROMBONE: 'trombone',
  BAND    : 'band',
  OTHER   : 'other',
  PANDORA : 'pandora',
  VIOLIN  : 'violin',
}

module.exports = async client => {
  const sql = new Sql('Instrument', client)

  await sql.delete('1=1')
    .execute()

  await sql.create([
    {
      name    : Instrument.DRUMS,
      imageURL: 'https://i.ibb.co/7ST9nXH/Drum.png',
    },
    {
      name    : Instrument.PANDORA,
      imageURL: 'https://i.ibb.co/dJDSzZg/bandura.png',
    },
    {
      name    : Instrument.GUITAR,
      imageURL: 'https://i.ibb.co/59vWJd7/guitar.png',
    },
    {
      name    : Instrument.BAS,
      imageURL: 'https://i.ibb.co/59vWJd7/guitar.png',
    },
    {
      name    : Instrument.VOICE,
      imageURL: 'https://i.ibb.co/Vvcm1s5/mic.png',
    },
    {
      name    : Instrument.SAX,
      imageURL: 'https://i.ibb.co/Xzt1y7C/sax.png',
    },
    {
      name    : Instrument.TRUMPET,
      imageURL: 'https://i.ibb.co/D7jtHdj/trumpet.png',
    },
    {
      name    : Instrument.VIOLIN,
      imageURL: 'https://i.ibb.co/gvV4f6d/violin.png',
    },
  ])
    .execute()

  console.log('Instruments were inserted')
}