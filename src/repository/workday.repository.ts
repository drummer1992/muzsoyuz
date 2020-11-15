import { EntityRepository, Repository } from 'typeorm'
import { WorkDay } from '../entities/entity.work.day'
import { WorkdayDto } from '../dto/workday.dto'
import { DateUtils } from '../utils/date'
import { Injectable } from '@nestjs/common'
import { argumentAssert } from '../lib/errors'

@Injectable()
@EntityRepository(WorkDay)
export class WorkdayRepository extends Repository<WorkDay> {
	async createWorkingDay(userId, dto: WorkdayDto) {
		const now = new Date()

		await this.insert({
			user  : userId,
			date  : DateUtils.trimTime(dto.date || now),
			dayOff: dto.dayOff,
		})
	}

	async updateWorkingDay(userId, dto: WorkdayDto) {
		const now = new Date()

		const { affected } = await this.createQueryBuilder()
			.update({ dayOff: dto.dayOff })
			.where('"userId"=:userId AND date BETWEEN :from AND :to', {
				userId: userId,
				from  : DateUtils.trimTime(now),
				to    : DateUtils.trimTime(DateUtils.addDays(now, 1)),
			})
			.execute()

		argumentAssert(affected, `User: ${userId} has not had workingDay entity for date: ${now}`)
	}
}