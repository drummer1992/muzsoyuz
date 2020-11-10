import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from '../entities/entity.user'
import { Job } from '../entities/entity.job'
import { City } from '../entities/entity.city'
import { WorkDay } from '../entities/entity.work.day'
import { ChatMessage } from '../entities/entity.chat.message'
import { ChatRoom } from '../entities/entity.chat.room'
import { Instrument } from '../entities/entity.instrument'

require('dotenv').config()

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

	public getClientHost() {
		return `${this.getValue('CLIENT_HOST')}:${this.getPort(false)}`
	}

	public getServerHost() {
		return `${this.getValue('SERVER_HOST')}:${this.getPort(true)}`
	}

	public getServerAPIPrefix() {
		return this.getValue('API_PREFIX')
	}

	public getProviderCallback(provider: string, isServer = false) {
		const PROVIDERS_MAP = {
			google  : 'GOOGLE_CALLBACK_URL',
			facebook: 'FACEBOOK_CALLBACK_URL',
		}

		let path = isServer ? this.getServerHost() : this.getClientHost()

		if (isServer) {
			path += `/${this.getServerAPIPrefix()}/auth`
		}

		return `${path}/${this.getValue(PROVIDERS_MAP[provider])}`
	}

	public isProduction() {
		const mode = this.getValue('MODE', false)

		console.log({ isProduction: mode !== 'DEV' })

		return mode !== 'DEV'
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
				City,
				WorkDay,
				ChatMessage,
				ChatRoom,
				Instrument,
			],

			synchronize: true,

			migrationsTableName: 'migration',

			migrations: ['src/migration/*.ts'],

			cli: {
				migrationsDir: 'src/migration',
			},

			ssl: this.isProduction(),
		}
	}
}

process.env.PORT = process.env.PORT || 9000 as any

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