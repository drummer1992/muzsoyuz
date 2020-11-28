import { Inject, Logger, Module, OnModuleInit } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from '../config'
import { DbChangesService } from './services/db-changes.service'

const scriptsLogger = new Logger('ScriptsLogger')

@Module({
	imports  : [
		TypeOrmModule.forFeature(config.getRepositories()),
	],
	providers: [DbChangesService],
})
export class ScriptsModule implements OnModuleInit {
	@Inject()
	private dbChangesService: DbChangesService

	async onModuleInit(): Promise<any> {
		scriptsLogger.log('Initialization...')

		await this.dbChangesService.main()
	}
}