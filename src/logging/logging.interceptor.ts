/* eslint-disable */
import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

const reqLogger = new Logger('ClientRequest')
const resLogger = new Logger('ClientResponse')

export class LoggingInterceptor implements NestInterceptor {
	async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
		const [{ method, url, body, headers: { authorization } }] = context.getArgs()

		const before = Date.now()

		const requestId = Math.floor(Math.random() * 1000)

		const bodyForPrint = { ...body }

		body.password && (bodyForPrint.password = '*'.repeat(body.password.length))

		const message = `[${requestId}] ${method}: ${url} ${authorization}, ${JSON.stringify(bodyForPrint)}`

		reqLogger.log(message)

		return next
			.handle()
			.pipe(
				tap(async () => {
					const [, { statusCode }] = context.getArgs()

					const after = Date.now()

					const message = `[${requestId}], status: ${statusCode}, ${after - before} ms`

					resLogger.log(message)
				}),
			)
	}
}