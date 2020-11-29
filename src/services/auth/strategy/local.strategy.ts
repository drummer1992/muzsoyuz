import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../../auth.service'
import { argumentAssert } from '../../../errors'
import { User } from '../../../entities/entity.user'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		private authService: AuthService,
	) {
		super({ usernameField: 'email' })
	}

	async validate(email: string, password: string): Promise<User> {
		argumentAssert(email, 'email is required')
		argumentAssert(password, 'password is required')

		const user = await this.authService.validateUser(email, password)

		if (!user) {
			throw new UnauthorizedException()
		}

		return user
	}
}