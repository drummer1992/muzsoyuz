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

		const status = (error instanceof HttpException)
			? error.getStatus()
			: HttpStatus.INTERNAL_SERVER_ERROR

		if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
			error = new InternalServerErrorException()
		}

		errorLogger.error(error)
		
		return response.status(status).send(error)
	}
}