import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repository/user.repository'
import { UpdateUserDto } from '../controllers/dto/user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { argumentAssert, notFoundAssert } from '../errors'
import { User } from '../entities/entity.user'
import { WorkdayDto, WorkdayFilterDto } from '../controllers/dto/workday.dto'
import { WorkdayRepository } from '../repository/workday.repository'
import { trimTime } from '../utils/date'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserRepository)
		private userRepository: UserRepository,
		@InjectRepository(WorkdayRepository)
		private workdayRepository: WorkdayRepository,
	) {
	}

	async validateUser(email, password) {
		const user = await this.userRepository.createQueryBuilder('user')
			.addSelect(['user.hash', 'user.salt'])
			.where('user.email=:email', { email })
			.getOne()

		notFoundAssert(user, 'User not found')

		argumentAssert(await new User(user).validatePassword(password), 'password is not valid')

		return this.userRepository.findOne({ where: { email } })
	}

	async getProfile(id: string) {
		const profile = await this.userRepository.findOne({
			where    : { id },
			relations: ['jobs'],
		})

		notFoundAssert(profile, 'User not found')

		return profile
	}

	getUserByProviderIdOrEmail(id, email, provider) {
		const where = [{ [`${provider}Id`]: id }]

		email && where.push({ email })

		return this.userRepository.findOne({ where })
	}

	ensureUniqueUser(email: string) {
		return this.userRepository.ensureUniqueUser('email', email)
	}

	createProfile(user: User) {
		return this.userRepository.createProfile(user)
	}

	createWorkingDay(userId, dto: WorkdayDto) {
		const now = new Date()

		return this.workdayRepository.save({
			user  : userId,
			date  : trimTime(dto.date || now),
			dayOff: dto.dayOff,
		})
	}

	updateWorkingDay(userId, dto: WorkdayDto) {
		return this.workdayRepository.updateWorkingDay(userId, dto)
	}

	findUsersByBusyness(filter: WorkdayFilterDto) {
		return this.userRepository.findUsersByBusyness(filter)
	}

	async updateProfile(id: string, data: UpdateUserDto) {
		argumentAssert(Object.keys(data).length, 'empty profile data')

		const { affected } = await this.userRepository.update({ id }, data)

		argumentAssert(affected, 'User not found')

		return data
	}

	enrichWithProviderId(id, provider, providerId) {
		return this.userRepository.update({ id }, { [`${provider}Id`]: providerId })
	}
}