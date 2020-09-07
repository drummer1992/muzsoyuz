import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from '../entities/entity.user'
import { Feed } from '../entities/entity.feed'
import { City } from '../entities/entity.city'

require('dotenv').config()

class Index {
	constructor(private env: { [key: string]: string | undefined }) { }

	private getValue(key: string, throwOnMissing = true): string {
		const value = this.env[key]

		if (!value && throwOnMissing) {
			throw new Error(`config error - missing env.${key}`)
		}

		return value
	}

	public ensureValues(keys: string[]) {
		keys.forEach(k => this.getValue(k, true))

		return this
	}

	public getPort() {
		return this.getValue('PORT', true)
	}

	public getAppPrefix() {
		return this.getValue('APP_PREFIX', true)
	}

	public isProduction() {
		const mode = this.getValue('MODE', false)

		return mode !== 'DEV'
	}

	public getTypeOrmConfig(): TypeOrmModuleOptions {
		return {
			type: 'postgres',

			host: this.getValue('POSTGRES_HOST'),
			port: parseInt(this.getValue('POSTGRES_PORT')),
			username: this.getValue('POSTGRES_USER'),
			password: this.getValue('POSTGRES_PASSWORD'),
			database: this.getValue('POSTGRES_DATABASE'),

			entities: [User, Feed, City],
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

const config = new Index(process.env)
	.ensureValues([
		'POSTGRES_HOST',
		'POSTGRES_PORT',
		'POSTGRES_USER',
		'POSTGRES_PASSWORD',
		'POSTGRES_DATABASE',
	])

export { config }