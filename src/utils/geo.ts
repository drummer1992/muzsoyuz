/* eslint-disable */
import { Request } from './request'
import { SECOND } from './date'

interface GeoCodeOptions {
	address?: string
	location?: { lat: number, lng: number },
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

	static async geoCode({ address, location }: GeoCodeOptions) {
		if (!this.isRequestAllowed) {
			await OpenCage.wait()
		}

		this.blockGeoRequests()

		// @ts-ignore
		const response = await Request.get(`${process.env.OPEN_CAGE_API_URL}`)
			.query({
				key           : process.env.OPEN_CAGE_API_KEY,
				q             : `${encodeURIComponent(address ? address : `${location.lat},${location.lng}`)}`,
				countrycode   : 'ua',
				language      : 'ru',
				limit         : 1,
				min_confidence: 8,
			})

		const point = response?.results?.[0]

		return { addressGeoCoded: point?.formatted, location: point?.geometry }
	}
}