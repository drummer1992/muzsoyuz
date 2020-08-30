import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from './config'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { FeedModule } from './feed/feed.module'
import { AppController } from './app.controller'

@Module({
	imports    : [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(config.getTypeOrmConfig()),
		UsersModule,
		FeedModule,
		AuthModule,
	],
	controllers: [AppController]
})

export class AppModule {}
