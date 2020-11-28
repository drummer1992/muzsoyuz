import {
	ExceptionFilter,
	Catch,
	HttpException,
	ArgumentsHost,
	HttpStatus,
	InternalServerErrorException, Logger,
} from '@nestjs/common'

const errorLogger = new Logger('ErrorLogger')

@Catch()
export class GlobalErrorFilter implements ExceptionFilter {
	catch(error: any, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse()

		errorLogger.error(error)

		let status

		if (error instanceof HttpException) {
			status = error.getStatus()

			error = error.getResponse()
		} else {
			status = HttpStatus.INTERNAL_SERVER_ERROR
			error = new InternalServerErrorException()
		}

		return response.status(status).send(error)
	}
}