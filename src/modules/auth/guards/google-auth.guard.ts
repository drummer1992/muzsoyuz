import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
	handleRequest(err, user) {
		console.log({ user })

		if (err || !user) {
			console.error(err.stack || err.message)

			throw new HttpException(err.message, HttpStatus.FORBIDDEN)
		}

		return user
	}
}