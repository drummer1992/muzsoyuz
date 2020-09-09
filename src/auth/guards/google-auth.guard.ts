import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
	handleRequest(err, user) {
		if (err || !user) {
			throw new HttpException(err.message, HttpStatus.FORBIDDEN);
		}

		return user;
	}
}