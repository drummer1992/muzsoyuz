import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from './config'
import { AuthModule } from './modules/auth.module'
import { UserModule } from './modules/user.module'
import { JobModule } from './modules/job.module'
import { ScriptsModule } from './scripts/scripts.module'
import { EventsModule } from './modules/events.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(config.getTypeOrmConfig()),
		UserModule,
		JobModule,
		AuthModule,
		ScriptsModule,
		EventsModule,
	],
})

export class AppModule {
}
