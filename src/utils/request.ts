/* eslint-disable */
import { Logger } from '@nestjs/common'

const logger = new Logger('ServerRequest')

const url = require('url')

enum Methods {
	get    = 'GET',
	post   = 'POST',
	put    = 'PUT',
	delete = 'DELETE',
	patch  = 'PATCH',
}

interface RequestOptions {
	path: string
	method: Methods
	body?: object
	headers?: object
}

interface ResponseShape {
	statusCode: number
	statusMessage: string
	headers: object
	body: any
}

class ResponseError extends Error {
	constructor(
		public error: any,
		public response: ResponseShape,
		public message = error.message || error,
		public code    = error.code,
		public status  = response.statusCode,
		public headers = response.headers,
	) {
		super()
	}
}

const nodeRequest = ({ path, method, body, headers }: RequestOptions): Promise<ResponseShape> => {
	return new Promise((resolve, reject) => {
		const u = url.parse(path)

		const https = u.protocol === 'https:'

		const httpClient = require(https ? 'https' : 'http')

		const options = {
			method,
			host: u.hostname,
			path: u.path,
			port: u.port || (https ? 443 : 80),
		}

		const request = httpClient.request(options, response => {
			const { statusCode, statusMessage, headers } = response

			const buffer = []
			const strings = []

			let bufferLength = 0
			let body = ''

			response.on('error', reject)

			response.on('data', chunk => {
				if (!Buffer.isBuffer(chunk)) {
					strings.push(chunk)
				} else if (chunk.length) {
					bufferLength += chunk.length
					buffer.push(chunk)
				}
			})

			response.on('close', () => {
				if (bufferLength) {
					body = Buffer.concat(buffer, bufferLength).toString('utf8')
				} else {
					body = strings.join()
				}

				resolve({ statusCode, statusMessage, headers, body })
			})
		})

		if (headers) {
			Object.keys(headers).forEach(key => {
				request.setHeader(key, headers[key])
			})
		}

		if (body) {
			const stringifierBody = JSON.stringify(body)

			request.setHeader('content-length', Buffer.byteLength(stringifierBody))

			request.write(stringifierBody)

			request.on('finish', request.end)
		} else {
			request.end()
		}

		request.on('error', reject)
	})
}

export class Request {
	constructor(
		public url: string,
		public method: Methods,
		public body?: object,
		public headers: object = {},
	) {

	}

	static get(url: string) {
		return new this(url, Methods.get)
	}

	static post(url: string, body: object) {
		return new this(url, Methods.post, body)
	}

	static put(url: string, body: object) {
		return new this(url, Methods.put, body)
	}

	static delete(url: string, body: object) {
		return new this(url, Methods.delete, body)
	}

	static patch(url: string, body: object) {
		return new this(url, Methods.patch, body)
	}

	private static getResponse(response: ResponseShape) {
		return response.body
	}

	private static parseBody(response: ResponseShape) {
		try {
			return Object.assign(response, { body: JSON.parse(response.body) })
		} catch {
			return response
		}
	}

	private static getError(response: ResponseShape) {
		if (response.statusCode === 502) {
			return 'No connection with server'
		}

		return response.body || `Code: ${response.statusCode}, Message: (${response.statusMessage})`
	}

	private static checkStatusCode(response: ResponseShape) {
		if (response.statusCode >= 200 && response.statusCode < 300) {
			return response
		}

		const error = Request.getError(response)

		return Promise.reject(new ResponseError(error, response))
	}

	setHeaders(headers: object) {
		this.headers = {
			...this.headers,
			...headers,
		}

		return this
	}

	query(query: object) {
		this.url += Object.keys(query).reduce(
			(acc, param, i, arr) => {
				const value = Array.isArray(query[param]) ? query[param].join(',') : query[param]

				acc += `${param}=${value}`

				i !== arr.length - 1 && (acc += '&')

				return acc
			}, this.url.includes('?') ? '&' : '?',
		)

		return this
	}

	then(successHandler, errorHandler) {
		return this.send().then(successHandler, errorHandler)
	}

	catch(errorHandler) {
		return this.send().catch(errorHandler)
	}

	send(body?: object): Promise<any> {
		this.body = body || this.body

		logger.log(this.url)

		return nodeRequest({
			path   : this.url,
			method : this.method,
			headers: this.headers,
			body   : this.body,
		})
			.then(Request.parseBody)
			.then(Request.checkStatusCode)
			.then(Request.getResponse)
	}
}