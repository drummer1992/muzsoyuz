import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import * as fs from 'fs'
import * as path from 'path'

export class LoggingInterceptor implements NestInterceptor {
	private writableStream

	getStream() {
		if (!this.writableStream) {
			this.writableStream = fs.createWriteStream(
				path.join(process.env.LOG_PATH, new Date().toISOString() + '.log'),
			)

			const _write = this.writableStream.write

			this.writableStream.write = (data, encoding = 'utf8') => new Promise((resolve, reject) => {
				_write.call(this.writableStream, data, encoding, err => err ? reject(err) : resolve())
			})
		}

		return this.writableStream
	}

	async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
		const [{ method, url, params, query, body, headers: { authorization } }] = context.getArgs()

		const before = Date.now()

		const requestId = Math.floor(Math.random() * 1000)

		const beforeLog = `[INFO]: [${requestId}] ${new Date(before).toISOString()}, ${method}: ${url}, `
			+ `TOKEN: ${authorization} `
			+ `PATH_PARAMS: ${JSON.stringify(params)}, `
			+ `QUERY: ${JSON.stringify(query)}, `
			+ `BODY: ${JSON.stringify(body)}\n`

		const stream = await this.getStream()

		await stream.write(beforeLog)

		return next
			.handle()
			.pipe(
				tap(async () => {
					const [, { statusCode }] = context.getArgs()

					const after = Date.now()

					const afterLog = `[INFO]: [${requestId}] ${new Date(after).toISOString()}, `
						+ `STATUS: ${statusCode}, `
						+ `PROCESSING TIME: ${after - before} ms\n`

					await stream.write(afterLog)
				}),

				catchError(async err => {
					const message = `[ERROR]: [${requestId}] ${new Date().toISOString()}, ${JSON.stringify(err)}\n`

					await stream.write(message)

					return err
				}),
			)
	}
}