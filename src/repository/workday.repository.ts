import { EntityRepository, Repository } from 'typeorm'
import { WorkDay } from '../entities/entity.work.day'
import { Injectable } from '@nestjs/common'
import { argumentAssert } from '../errors'
import { WorkdayDto } from '../controllers/dto/workday.dto'
import { addDays, trimTime } from '../utils/date'

@Injectable()
@EntityRepository(WorkDay)
export class WorkdayRepository extends Repository<WorkDay> {
	async updateWorkingDay(userId, dto: WorkdayDto) {
		const now = new Date()

		const { affected } = await this.createQueryBuilder()
			.update({ dayOff: dto.dayOff })
			.where('"userId"=:userId AND date BETWEEN :from AND :to', {
				userId: userId,
				from  : trimTime(now),
				to    : trimTime(addDays(now, 1)),
			})
			.execute()

		argumentAssert(affected, `User: ${userId} has not had workingDay entity for date: ${now}`)
	}
}