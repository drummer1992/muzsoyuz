import { Injectable } from '@nestjs/common'
import { UsersRepository } from './repository/users.repository'
import { UserDto } from '../dto/user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { businessAssert } from '../lib/errors'
import { ValidationUtils } from '../utils/validation'
import { isUUID } from 'class-validator'
import { User } from '../entities/entity.user'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UsersRepository)
		private usersRepository: UsersRepository,
	) {}

	getProfile(id: string) {
		businessAssert(isUUID(id), `Not valid id: [${id}]`)

		return this.usersRepository.findOne(id)
	}

	async findByEmail(email: string): Promise<User> {
		const user = await this.usersRepository.findOne({ where: { email } })

		businessAssert(user, `Unable to found user by email: ${email}`)

		return user
	}

	async ensureUniqueEmail(email: string) {
		return this.usersRepository.ensureUniqueEmail(email)
	}

	createProfile(user: User) {
		return this.usersRepository.createProfile(user)
	}

	updateProfile(id: string, data: UserDto) {
		businessAssert(isUUID(id), `Not valid id: [${id}]`)

		ValidationUtils.validateDTO(data, this.usersRepository.publicAttributes)

		return this.usersRepository.update({ id }, data)
	}
}