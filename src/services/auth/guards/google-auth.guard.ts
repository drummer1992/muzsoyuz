import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

const DEFAULT_MESSAGE = 'Unknown error from google'

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
	handleRequest(err, user) {
		if (err || !user) {
			throw new HttpException(
				err?.message
				|| err
				|| DEFAULT_MESSAGE,
				HttpStatus.FORBIDDEN,
			)
		}

		return user
	}
}