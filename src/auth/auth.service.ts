import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { businessAssert } from '../lib/errors'
import { User } from '../entities/entity.user'
import { AuthDto } from '../dto/user.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {
	}

	async register(data: AuthDto) {
		businessAssert(
			await this.usersService.ensureUniqueEmail(data.email),
			`User with email: ${data.email} already exists`,
		)

		const user = new User({ email: data.email })

		await user.setPassword(data.password)

		return user
	}

	async validateUser(email, password) {
		const user = await this.usersService.findByEmail(email)

		return await user.validatePassword(password)
			? user
			: null
	}

	login(user: { email: string, id: string }) {
		return {
			token: this.jwtService.sign({
				username: user.email,
				sub     : user.id,
			}),
		}
	}
}
