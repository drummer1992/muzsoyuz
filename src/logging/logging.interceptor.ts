import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'

const reqLogger = new Logger('ClientRequest')
const resLogger = new Logger('ClientResponse')

export class LoggingInterceptor implements NestInterceptor {
	async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
		const [{ method, url, body, headers: { authorization } }] = context.getArgs()

		const before = Date.now()

		const requestId = Math.floor(Math.random() * 1000)

		const message = `[${requestId}] ${method}: ${url} ${authorization}, ${JSON.stringify(body)}`

		reqLogger.log(message)

		return next
			.handle()
			.pipe(
				tap(async response => {
					const [, { statusCode }] = context.getArgs()

					const after = Date.now()

					const message = `[${requestId}], status: ${statusCode}, `
						+ `response: ${JSON.stringify(response)} ${after - before} ms`

					resLogger.log(message)
				}),

				catchError(async err => {
					const message = `[${requestId}], ${JSON.stringify(err)}`

					resLogger.error(message)

					return err
				}),
			)
	}
}