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
	catch(error: Error, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse()

		errorLogger.error(error)

		const status = (error instanceof HttpException)
			? error.getStatus()
			: HttpStatus.INTERNAL_SERVER_ERROR

		if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
			error = new InternalServerErrorException()
		}

		return response.status(status).send(error)
	}
}