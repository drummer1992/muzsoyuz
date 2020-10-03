import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common'

export class InvalidArgumentsError extends HttpException {
	constructor(error) {
		super(error, HttpStatus.BAD_REQUEST)
	}
}

export class BusinessError extends HttpException {
	constructor(message) {
		super(message, HttpStatus.BAD_REQUEST)
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

export const notFoundAssert = (condition, id) => {
	if (!condition) {
		throw new NotFoundError(`Unable to find entity by id: ${id}`)
	}
}

export const authorizedAssert = user => {
	if (!user) {
		throw new UnauthorizedException()
	}
}