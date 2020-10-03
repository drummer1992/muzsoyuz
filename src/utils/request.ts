import { request, RequestOptions } from 'https'
import { Readable } from 'stream'
import { InternalServerErrorException } from '@nestjs/common'

interface CustomRequestOptions extends RequestOptions {
	body: object
}

export abstract class Request {
	private static readonly _request = ({ url, options }: { url?: string, options?: CustomRequestOptions }) => {
		return new Promise((resolve, reject) => {
			const buffer = []
			const requestBody = options?.body && Buffer.from(options.body)

			const req = request(url || options, res => {
				res.on('data', chunk => buffer.push(chunk))
				res.on('error', reject)
				res.on('close', () => {
					const body = buffer.concat().toString()

					try {
						resolve(body && JSON.parse(body))
					} catch (e) {
						console.error(e.message)

						throw new InternalServerErrorException()
					}
				})
			})

			if (options && ['POST', 'PUT'].includes(options.method) && requestBody) {
				const writable = Readable.from(requestBody).pipe(req)

				writable.on('error', reject)
				writable.on('finish', req.end)
			} else {
				req.end()
			}

			req.on('error', reject)
		})
	}

	static get(url: string): any {
		return this._request({ url })
	}

	static post(options: CustomRequestOptions) {
		return this._request({
			options: {
				method : 'POST',
				headers: {
					'Content-Length': Buffer.byteLength(JSON.stringify(options.body)),
				},
				...options,
			},
		})
	}
}