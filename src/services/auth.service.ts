import { Injectable } from '@nestjs/common'
import { UserService } from './user.service'
import { businessAssert } from '../errors'
import { User } from '../entities/entity.user'
import { AuthDto } from '../controllers/dto/user.dto'
import { JwtService } from '@nestjs/jwt'
import { pick } from '../utils/object'

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
			await this.userService.ensureUniqueEmail(data.email),
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

	getUserByEmailOrId(provider, id, email) {
		const where = [{ [`${provider}Id`]: id }]

		email && where.push({ email })

		return this.userService.getUserProfile(where)
	}

	async oauthHandler(user: any) {
		const { provider, displayName, emails: [email] = [], photos: [image] = [] } = user

		let profile = await this.getUserByEmailOrId(provider, user.id, email?.value)

		const payload = {
			[`${provider}Id`]: user.id,
			name             : displayName,
			email            : email?.value,
			imageURL         : image?.value,
		} as User

		if (!profile) {
			profile = await this.userService.createProfile(payload)
		}

		const difference = Object.keys(payload).filter(key => {
			return payload[key] && profile[key] !== payload[key]
		})

		if (difference.length) {
			await this.userService.updateProfile(profile.id, pick(payload, difference) as User)
		}

		return {
			profile,
			token: this.login({ username: email || displayName, sub: profile.id }),
		}
	}
}
