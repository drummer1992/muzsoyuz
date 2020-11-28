import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repository/user.repository'
import { UserDto } from '../dto/user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { argumentAssert, notFoundAssert } from '../errors'
import { User } from '../entities/entity.user'
import { WorkdayDto, WorkdayFilterDto } from '../dto/workday.dto'
import { WorkdayRepository } from '../repository/workday.repository'
import { DateUtils } from '../utils/date'

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
		const user = await this.userRepository.createQueryBuilder()
			.addSelect(['hash', 'salt'])
			.where({ whereFactory: { email } })
			.execute()

		notFoundAssert(user, 'User not found')

		return await new User(user).validatePassword(password)
			&& this.userRepository.findOne({ where: { email } })
	}

	async getProfile(id: string, props: string[] = [], relations: string[] = []) {
		const profile = await this.userRepository.findOne({
			where: { id },
			relations,
			...(props.length ? { select: props as any }: {}),
		})

		notFoundAssert(profile, 'User not found')

		return profile
	}

	getUserByProviderIdOrEmail(id, email, provider) {
		return this.userRepository.findOne({
			where: [
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

	async createWorkingDay(userId, dto: WorkdayDto) {
		const now = new Date()

		await this.workdayRepository.insert({
			user  : userId,
			date  : DateUtils.trimTime(dto.date || now),
			dayOff: dto.dayOff,
		})
	}

	updateWorkingDay(userId, dto: WorkdayDto) {
		return this.workdayRepository.updateWorkingDay(userId, dto)
	}

	findUsersByBusyness(filter: WorkdayFilterDto) {
		return this.userRepository.findUsersByBusyness(filter)
	}

	async updateProfile(id: string, data: UserDto) {
		argumentAssert(Object.keys(data).length, 'empty profile data')

		const { affected } = await this.userRepository.update({ id }, data)

		argumentAssert(affected, 'User not found')

		return data
	}

	enrichWithProviderId(id, provider, providerId) {
		return this.userRepository.update({ id }, { [`${provider}Id`]: providerId })
	}
}