import { Injectable } from '@nestjs/common'
import { UserService } from './user.service'
import { businessAssert } from '../errors'
import { User } from '../entities/entity.user'
import { AuthDto } from '../controllers/dto/user.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {
	}

	login({ username, sub }) {
		return this.jwtService.sign({ username, sub })
	}

	async register(data: AuthDto) {
		businessAssert(
			await this.userService.ensureUniqueUser(data.email),
			`User with email: ${data.email} already exists`,
		)

		const user = new User({ email: data.email })

		await user.setPassword(data.password)

		const profile = await this.userService.createProfile(user)

		return {
			profile,
			token: this.login({ username: user.email, sub: profile.id }),
		}
	}

	async validateUser(email, password) {
		return await this.userService.validateUser(email, password)
	}

	async oauthHandler(user: any) {
		const { provider, displayName, emails: [email] = [], photos: [image] = [] } = user

		let profile = await this.userService.getUserByProviderIdOrEmail(user.id, email?.value, provider)

		if (!profile) {
			const payload = {
				[`${provider}Id`]: user.id,
				name             : displayName,
				email            : email?.value,
				imageURL         : image?.value,
			} as User

			profile = await this.userService.createProfile(payload)
		} else if (!profile[`${provider}Id`]) {
			await this.userService.updateProfile(profile.id, { [`${provider}Id`]: user.id } as User)
		}

		return {
			profile,
			token: this.login({ username: email || displayName, sub: profile.id }),
		}
	}
}
