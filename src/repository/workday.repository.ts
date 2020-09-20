import { EntityRepository, Repository } from 'typeorm'
import { WorkDay } from '../entities/entity.work.day'
import { WorkdayDto } from '../dto/workday.dto'
import { DateUtils } from '../utils/date'
import { Injectable } from '@nestjs/common'

@Injectable()
@EntityRepository(WorkDay)
export class WorkdayRepository extends Repository<WorkDay> {
	async markWorkingDay(user, dto: WorkdayDto) {
		const now = new Date()

		const { affected } = await this.createQueryBuilder()
			.update('Workday', { dayOff: dto.dayOff })
			.where('"userId"=:userId AND date BETWEEN :from AND :to', {
				userId: user.id,
				from  : DateUtils.trimTime(now),
				to    : DateUtils.trimTime(DateUtils.addDays(now, 1)),
			})
			.execute()

		if (!affected) {
			await this.insert({
				user  : user.id,
				date  : dto.date || now,
				dayOff: dto.dayOff,
			})
		}

		return dto
	}
}