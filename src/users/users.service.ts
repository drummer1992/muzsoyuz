import { Injectable } from '@nestjs/common'
import { UsersRepository } from './repository/users.repository'
import { UserDto } from '../dto/user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { businessAssert } from '../lib/errors'
import { ValidationUtils } from '../utils/validation'
import { User } from '../entities/entity.user'
import { ObjectUtils } from '../utils/object'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UsersRepository)
		private usersRepository: UsersRepository,
	) {}

	async getProfile(id: string) {
		return ObjectUtils.omit(await this.usersRepository.findOne(id), ['salt', 'hash'])
	}

	async findByEmail(email: string): Promise<User> {
		const user = await this.usersRepository.findOne({ where: { email } })

		businessAssert(user, `Unable to found user by email: ${email}`)

		return user
	}

	async findByFbId(id) {
		return this.usersRepository.findOne({ where: { facebookId: id } })
	}

	ensureUniqueEmail(email: string) {
		return this.usersRepository.ensureUniqueEmail(email)
	}

	createProfile(user: User) {
		return this.usersRepository.createProfile(user)
	}

	async updateProfile(id: string, data: UserDto) {
		ValidationUtils.validateDTO(data, this.usersRepository.publicAttributes)

		const { affected } =  await this.usersRepository.update({ id }, data)

		if (affected) {
			return data
		}
	}
}