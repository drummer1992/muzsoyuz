import { Injectable } from '@nestjs/common'
import { UserService } from '../users/user.service'
import { businessAssert } from '../lib/errors'
import { User } from '../entities/entity.user'
import { AuthDto } from '../dto/user.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {
	}

	async register(data: AuthDto) {
		businessAssert(
			await this.userService.ensureUniqueEmail(data.email),
			`User with email: ${data.email} already exists`,
		)

		const user = new User({ email: data.email })

		await user.setPassword(data.password)

		return this.login({ username: user.email, sub: this.userService.createProfile(user) })
	}

	async validateUser(email, password) {
		const user = await this.userService.findByEmail(email)

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
		const { provider, displayName, emails: [email] = [], photos: [image] = [] } = user

		const existingUser = await this.userService.getIdByProviderId(user.id, provider)

		let id = existingUser?.id

		if (!id) {
			id = await this.userService.createProfile(new User({
				[`${provider}Id`]: user.id,
				name             : displayName || undefined,
				email            : email?.value || undefined,
				imageUrl         : image?.value || undefined,
			}))
		}

		return this.login({ username: email || displayName, sub: id })
	}
}
