import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from './config'
import { AuthModule } from './modules/auth.module'
import { UserModule } from './modules/user.module'
import { JobModule } from './modules/job.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(config.getTypeOrmConfig()),
		UserModule,
		JobModule,
		AuthModule,
	],
})

export class AppModule {
}
