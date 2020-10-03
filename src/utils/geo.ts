/* eslint-disable */
import { Request } from './request'
import { SECOND } from './date'
import assert = require('assert')

interface IGeoCode {
	address?: string
	location?: { latitude: number, longitude: number },
	country?: string,
	language?: string,
	limit?: number,
	minConfidence?: number
}

export abstract class OpenCage {
	private static isRequestAllowed = true

	private static blockGeoRequests() {
		this.isRequestAllowed = false

		setTimeout(() => {
			this.isRequestAllowed = true
		}, SECOND)
	}

	private static wait() {
		return new Promise(resolve => {
			const interval = setInterval(() => {
				if (OpenCage.isRequestAllowed) {
					resolve(clearInterval(interval))
				}
			}, SECOND / 10)
		})
	}

	private static resolveLocationQuery(address, location) {
		assert(address || location, 'address or location are required')

		return `${encodeURIComponent(address ? address : `${location.lat},${location.lng}`)}`
	}

	private static resolveQuery(query) {
		const { key: apiKey, ...restQuery } = query

		return Object.keys(restQuery).reduce(
			(acc, key) => acc + `&${key}=${query[key]}`, `?key=${apiKey}`,
		)
	}

	static async geoCode({ address, location, country, language, limit }: IGeoCode) {
		if (!this.isRequestAllowed) {
			await OpenCage.wait()
		}

		this.blockGeoRequests()

		const query = {
			key           : process.env.OPEN_CAGE_API_KEY,
			q             : this.resolveLocationQuery(address, location),
			countrycode   : country || 'ua',
			language      : language || 'ru',
			limit         : limit || 1,
		}

		const { results: [point] } = await Request.get(`${process.env.OPEN_CAGE_API_URL}${this.resolveQuery(query)}`)

		return point && { address: point.formatted, location: point.geometry }
	}
}