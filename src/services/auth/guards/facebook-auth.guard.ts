import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

const DEFAULT_MESSAGE = 'Unknown error from facebook'

@Injectable()
export class FacebookAuthGuard extends AuthGuard('facebook') {
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