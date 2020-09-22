'use strict'

const CITY_MAP = {
  Kyiv: [
    [30.22561, 50.44537],
    [30.29599, 50.55173],
    [30.47109, 50.567],
    [30.6347, 50.53567],
    [30.65977, 50.46929],
    [30.74251, 50.39646],
    [30.62372, 50.33931],
    [30.5372, 50.32769],
    [30.42253, 50.34654],
    [30.22561, 50.44537],
  ],
}

const getInsertQuery = (city, multiPolygon) => {
  return multiPolygon.reduce((prev, point, i) => {
      const isLastPoint = i === multiPolygon.length - 1

      const strPoint = point.join(' ')

      return prev + (isLastPoint ? strPoint : strPoint + ',')
    },
    `INSERT INTO "City" (name, location) VALUES ('${city}', ST_GeomFromText('MULTIPOLYGON(((`,
  ) + `)))', 4326))`
}

module.exports = async client => {
  const { rows: [{ count }] } = await client.query(`SELECT COUNT(*) from "City"`)

  if (Number(count) === 0) {
    const cityKeys = Object.keys(CITY_MAP)

    for (const city of cityKeys) {
      const query = getInsertQuery(city, CITY_MAP[city])

      await client.query(query)
    }

    console.log(`Cities was inserted: ${cityKeys.join(', ')}`)
  }
}