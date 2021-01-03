import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from '../entities/entity.user'
import { Job } from '../entities/entity.job'
import { WorkDay } from '../entities/entity.work.day'
import { Instrument } from '../entities/entity.instrument'
import { JobRepository } from '../repository/job.repository'
import { UserRepository } from '../repository/user.repository'
import { InstrumentRepository } from '../repository/instrument.repository'
import { WorkdayRepository } from '../repository/workday.repository'
import * as dotEnv from 'dotenv'
import * as path from 'path'

const env = process.env.NODE_ENV || ''
const envPath = path.resolve(__dirname, `../../.env${env && '.' + env}`)

const { error } = dotEnv.config({ path: envPath })

if (error) {
	console.warn('.env file is not loaded', error)
}

class Index {
	constructor(private env: { [key: string]: string | undefined }) {
	}

	private getValue(key: string, throwOnMissing = true): string {
		const value = this.env[key]

		if (!value && throwOnMissing) {
			throw new Error(`config error - missing env.${key}`)
		}

		return value
	}

	public ensureValues(keys: string[]) {
		keys.forEach(k => this.getValue(k))

		return this
	}

	public getPort(isServer) {
		return parseInt(this.getValue(isServer ? 'PORT' : 'CLIENT_PORT'))
	}

	public getServerAPIPrefix() {
		return this.getValue('API_PREFIX')
	}

	public getProviderCallback(provider: string) {
		const PROVIDERS_MAP = {
			google  : 'GOOGLE_CALLBACK_URL',
			facebook: 'FACEBOOK_CALLBACK_URL',
		}

		return `${this.getValue('CALLBACK_HOST')}/${this.getValue(PROVIDERS_MAP[provider])}`
	}

	public getRepositories() {
		return [
			JobRepository,
			UserRepository,
			InstrumentRepository,
			WorkdayRepository,
		]
	}

	public getTypeOrmConfig(): TypeOrmModuleOptions {
		return {
			type    : 'postgres',
			host    : this.getValue('POSTGRES_HOST'),
			port    : parseInt(this.getValue('POSTGRES_PORT')),
			username: this.getValue('POSTGRES_USER'),
			password: this.getValue('POSTGRES_PASSWORD'),
			database: this.getValue('POSTGRES_DATABASE'),
			entities: [
				User,
				Job,
				WorkDay,
				Instrument,
			],

			synchronize: true,

			migrationsTableName: 'migration',

			migrations: ['src/migration/*.ts'],

			cli: {
				migrationsDir: 'src/migration',
			},

			ssl: false,
		}
	}
}

const config = new Index(process.env)

config.ensureValues([
	'PORT',
	'POSTGRES_HOST',
	'POSTGRES_PORT',
	'POSTGRES_USER',
	'POSTGRES_PASSWORD',
	'POSTGRES_DATABASE',
])

export { config }