import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'
import { authorizedAssert } from '../../../lib/errors'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		private authService: AuthService,
	) {
		super({ usernameField: 'email' })
	}

	async validate(email, password): Promise<any> {
		const user = await this.authService.validateUser(email, password)

		authorizedAssert(user)

		return user
	}
}