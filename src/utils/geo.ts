/* eslint-disable */
import { Request } from './request'
import { SECOND } from './date'

interface GeoCodeOptions {
	address?: string
	location?: { lat: number, lng: number },
}

interface GeoResponse {
	addressGeoCoded?: string
	cityGeoCoded?: string
	location?: { lat: number, lng: number }
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

	static async geoCode(data: GeoCodeOptions): Promise<GeoResponse> {
		const { address, location } = data || {}

		const result = {}

		if (address || location) {
			if (!this.isRequestAllowed) {
				await OpenCage.wait()
			}

			this.blockGeoRequests()

			const response: any = await Request.get(process.env.OPEN_CAGE_API_URL)
				.query({
					key           : process.env.OPEN_CAGE_API_KEY,
					q             : encodeURIComponent(address ? address : `${location.lat},${location.lng}`),
					countrycode   : 'ua',
					language      : 'ru',
					limit         : 1,
					min_confidence: 8,
				})
				.catch(console.error)

			const point = response?.results?.[0]

			Object.assign(result, {
				addressGeoCoded: point?.formatted,
				cityGeoCoded   : point?.components?.city,
				location       : point?.geometry,
			})
		}

		return result
	}
}