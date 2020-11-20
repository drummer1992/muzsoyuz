import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repository/user.repository'
import { UserDto } from '../../dto/user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { notFoundAssert } from '../../lib/errors'
import { User } from '../../entities/entity.user'
import { WorkdayDto, WorkdayFilterDto } from '../../dto/workday.dto'
import { WorkdayRepository } from '../../repository/workday.repository'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		@InjectRepository(WorkdayRepository)
		private workdayRepository: WorkdayRepository,
	) {
	}

	getProfile(id: string, props?: string[]) {
		return this.userRepository.getProfile(id, props)
	}

	async findByEmail(email: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { email } })

		notFoundAssert(user, `Unable to found user by email: ${email}`)

		return user
	}

	getProfileByProviderOrEmail(id, email, provider) {
		return this.userRepository.findOne({
			where : [
				{ [`${provider}Id`]: id },
				{ email: email || undefined },
			],
		})
	}

	ensureUniqueUser(email: string) {
		return this.userRepository.ensureUniqueUser('email', email)
	}

	createProfile(user: User) {
		return this.userRepository.createProfile(user)
	}

	createWorkingDay(userId, dto: WorkdayDto) {
		return this.workdayRepository.createWorkingDay(userId, dto)
	}

	updateWorkingDay(userId, dto: WorkdayDto) {
		return this.workdayRepository.updateWorkingDay(userId, dto)
	}

	findUsersByBusyness(filter: WorkdayFilterDto) {
		return this.userRepository.findUsersByBusyness(filter)
	}

	async updateProfile(id: string, data: UserDto) {
		await this.userRepository.update({ id }, data)

		return data
	}

	enrichWithProviderId(id, provider, providerId) {
		return this.userRepository.update({ id }, { [`${provider}Id`]: providerId })
	}
}