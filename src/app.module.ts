import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from './config'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/users/user.module'
import { JobModule } from './modules/job/job.module'
import { ChatModule } from './modules/chat/chat.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(config.getTypeOrmConfig()),
		UserModule,
		JobModule,
		AuthModule,
		ChatModule,
	],
})

export class AppModule {
}
