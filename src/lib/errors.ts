import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common'

export class InvalidArgumentsError extends HttpException {
	constructor(message) {
		super({
			statusCode: HttpStatus.BAD_REQUEST,
			message,
			error     : 'Bad Request',
		}, HttpStatus.BAD_REQUEST)
	}
}

export class BusinessError extends HttpException {
	constructor(message) {
		super({
			statusCode: HttpStatus.BAD_REQUEST,
			message,
			error     : 'Bad Request',
		}, HttpStatus.BAD_REQUEST)
	}
}

export class NotFoundError extends HttpException {
	constructor(message) {
		super(message, HttpStatus.NOT_FOUND)
	}
}

export const argumentAssert = (condition, message) => {
	if (!message) {
		throw new Error('message is required')
	}

	if (!condition) {
		throw new InvalidArgumentsError(message)
	}
}

export const businessAssert = (condition, message) => {
	if (!message) {
		throw new Error('message is required')
	}

	if (!condition) {
		throw new BusinessError(message)
	}
}

export const notFoundAssert = (condition, message) => {
	if (!condition) {
		throw new NotFoundError(message || 'Unable to find entity')
	}
}

export const authorizedAssert = user => {
	if (!user) {
		throw new UnauthorizedException()
	}
}