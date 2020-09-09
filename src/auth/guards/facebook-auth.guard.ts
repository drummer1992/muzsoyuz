import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class FacebookAuthGuard extends AuthGuard('facebook') {
	handleRequest(err, user) {
		if (err || !user) {
			throw new HttpException(err.message, HttpStatus.FORBIDDEN);
		}

		return user;
	}
}