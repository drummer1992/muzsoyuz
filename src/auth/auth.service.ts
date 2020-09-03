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

		return this.login({ username: user.email, sub: this.usersService.createProfile(user) })
	}

	async validateUser(email, password) {
		const user = await this.usersService.findByEmail(email)

		return await user.validatePassword(password)
			? user
			: null
	}

	login({ username, sub }) {
		return {
			token: this.jwtService.sign({ username, sub }),
		}
	}

	async oauthHandler(user) {
		const { id, provider, displayName, emails: [email] = [], photos: [imageUrl] = [] } = user

		const existingUser = await this.usersService.findByProviderId(id, provider)

		if (!existingUser) {
			await this.usersService.createProfile(new User({
				[`${provider}Id`]: id,
				name             : displayName || undefined,
				email            : email || undefined,
				imageUrl         : imageUrl || undefined,
			}))
		}

		return this.login({ username: email || displayName, sub: id })
	}
}
