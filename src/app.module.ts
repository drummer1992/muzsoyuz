import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from './config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './users/user.module'
import { FeedModule } from './feed/feed.module'

@Module({
	imports    : [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(config.getTypeOrmConfig()),
		UserModule,
		FeedModule,
		AuthModule,
	],
})

export class AppModule {}
