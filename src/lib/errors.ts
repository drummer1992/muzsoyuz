import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common'

export const businessAssert = (condition, message) => {
	if (!message) {
		throw new Error('message is required')
	}

	if (!condition) {
		throw new HttpException(message, HttpStatus.BAD_REQUEST)
	}
}

export const notFoundAssert = (condition, id) => {
	if (!condition) {
		throw new HttpException(`Unable to find entity by id: ${id}`, HttpStatus.NOT_FOUND)
	}
}

export const authorizedAssert = user => {
	if (!user) {
		throw new UnauthorizedException()
	}
}