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
				imageURL: 'https://muzsoyuz.com/assets/icon/drums.svg',
			},
			{
				name    : Instruments.PANDORA,
				imageURL: 'https://muzsoyuz.com/assets/icon/pandora.svg',
			},
			{
				name    : Instruments.GUITAR,
				imageURL: 'https://muzsoyuz.com/assets/icon/guitar.svg',
			},
			{
				name    : Instruments.BAS,
				imageURL: 'https://muzsoyuz.com/assets/icon/bas.svg',
			},
			{
				name    : Instruments.VOICE,
				imageURL: 'https://muzsoyuz.com/assets/icon/voice.svg',
			},
			{
				name    : Instruments.SAX,
				imageURL: 'https://muzsoyuz.com/assets/icon/sax.svg',
			},
			{
				name    : Instruments.TRUMPET,
				imageURL: 'https://muzsoyuz.com/assets/icon/trumpet.svg',
			},
			{
				name    : Instruments.VIOLIN,
				imageURL: 'https://muzsoyuz.com/assets/icon/violin.svg',
			},			{
				name    : Instruments.PIANO,
				imageURL: 'https://muzsoyuz.com/assets/icon/piano.svg',
			},
		]

		const records = await this.instrumentRepository.find({
			where: {
				name: In(instrumentsPayload.map(i => i.name)),
			},
		})

		if (records.length !== instrumentsPayload.length) {
			const payload = instrumentsPayload.filter(item => !records.some(rec => rec.name === item.name))

			for (const item of payload) {
				await this.instrumentRepository.insert(item)

				dbChangesLogger.log(`${item.name} was inserted: ${item.imageURL}`)
			}
		} else {
			dbChangesLogger.log('No need to insert instruments')
		}
	}

	async main() {
		await this.createInstruments()
	}
}