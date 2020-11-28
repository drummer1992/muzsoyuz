import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JobRepository } from '../../repository/job.repository'
import { InstrumentRepository } from '../../repository/instrument.repository'
import { UserRepository } from '../../repository/user.repository'
import { WorkdayRepository } from '../../repository/workday.repository'
import { Instruments } from '../../app.interfaces'
import { In } from 'typeorm'

const dbChangesLogger = new Logger('DbChangesLogger')

@Injectable()
export class DbChangesService {
	@InjectRepository(JobRepository)
	private jobRepository: JobRepository
	@InjectRepository(InstrumentRepository)
	private instrumentRepository: InstrumentRepository
	@InjectRepository(UserRepository)
	private userRepository: UserRepository
	@InjectRepository(WorkdayRepository)
	private workdayRepository: WorkdayRepository

	async createInstruments() {
		const instrumentsPayload = [
			{
				name    : Instruments.DRUMS,
				imageURL: 'https://i.ibb.co/7ST9nXH/Drum.png',
			},
			{
				name    : Instruments.PANDORA,
				imageURL: 'https://i.ibb.co/dJDSzZg/bandura.png',
			},
			{
				name    : Instruments.GUITAR,
				imageURL: 'https://i.ibb.co/59vWJd7/guitar.png',
			},
			{
				name    : Instruments.BAS,
				imageURL: 'https://i.ibb.co/59vWJd7/guitar.png',
			},
			{
				name    : Instruments.VOICE,
				imageURL: 'https://i.ibb.co/Vvcm1s5/mic.png',
			},
			{
				name    : Instruments.SAX,
				imageURL: 'https://i.ibb.co/Xzt1y7C/sax.png',
			},
			{
				name    : Instruments.TRUMPET,
				imageURL: 'https://i.ibb.co/D7jtHdj/trumpet.png',
			},
			{
				name    : Instruments.VIOLIN,
				imageURL: 'https://i.ibb.co/gvV4f6d/violin.png',
			},
		]

		const records = await this.instrumentRepository.find({
			where: {
				name: In(instrumentsPayload.map(i => i.name)),
			},
		})

		if (records.length !== instrumentsPayload.length) {
			const result = await this.instrumentRepository.createQueryBuilder('instrument')
				.insert()
				.into('instrument')
				.values(instrumentsPayload.filter(item => records.some(rec => rec.name !== item.name)))
				.execute()

			dbChangesLogger.log(result)
		} else {
			dbChangesLogger.log('No need to insert instruments')
		}
	}

	async main() {
		await this.createInstruments()
	}
}