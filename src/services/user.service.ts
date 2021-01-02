import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repository/user.repository'
import { UpdateUserDto } from '../controllers/dto/user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { argumentAssert, notFoundAssert } from '../errors'
import { User } from '../entities/entity.user'
import { WorkdayDto, WorkdayFilterDto } from '../controllers/dto/workday.dto'
import { WorkdayRepository } from '../repository/workday.repository'
import { isFutureDate, trimTime } from '../utils/date'
import { MoreThanOrEqual } from 'typeorm'

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
			.andWhere('user.hash IS NOT NULL AND user.salt IS NOT NULL')
			.getOne()

		notFoundAssert(user, 'User not found')

		argumentAssert(await new User(user).validatePassword(password), 'password is not valid')

		return this.userRepository.findOne({ where: { email } })
	}

	async getProfileById(id: string) {
		const profile = await this.userRepository.findOne({
			where    : { id },
			relations: ['jobs'],
		})

		notFoundAssert(profile, 'User not found')

		return profile
	}

	getUserProfile(where: any) {
		return this.userRepository.findOne({ where })
	}

	getUserWorkingDays(userId: string) {
		return this.workdayRepository.find({
			where: {
				dayOff: true,
				date  : MoreThanOrEqual(trimTime(Date.now())),
				user  : new User({ id: userId }),
			},
		})
	}

	ensureUniqueEmail(email: string) {
		return this.userRepository.ensureUniqueUser('email', email)
	}

	createProfile(user: User) {
		return this.userRepository.createProfile(user)
	}

	async markWorkingDays(userId, dto: WorkdayDto) {
		for (const date of dto.dates) {
			const trimmedDate = trimTime(date)

			const { affected } = await this.workdayRepository.createQueryBuilder()
				.update({ dayOff: dto.dayOff })
				.where('"userId"=:userId AND date=:date', {
					userId: userId,
					date  : trimmedDate,
				})
				.execute()

			if (!affected) {
				argumentAssert(isFutureDate(date), 'date can not be in past')

				const payload = {
					user  : userId,
					date  : trimmedDate,
					dayOff: dto.dayOff,
				}

				await this.workdayRepository.insert(payload)
			}
		}

		return dto
	}

	findUsersByBusyness(filter: WorkdayFilterDto) {
		return this.userRepository.findUsersByBusyness(filter)
	}

	async updateProfile(id: string, data: UpdateUserDto | User) {
		argumentAssert(Object.keys(data).length, 'empty profile data')

		const { affected } = await this.userRepository.update({ id }, data)

		argumentAssert(affected, 'User not found')

		return data
	}
}