import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategy/local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategy/jwt.strategy'
import { FacebookStrategy } from './strategy/facebook.strategy'
import { GoogleStrategy } from './strategy/google.strategy'

@Module({
	imports  : [
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret     : process.env.JWT_SECRET,
			signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
		}),
	],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		FacebookStrategy,
		GoogleStrategy,
	],
	exports  : [AuthService],
})
export class AuthModule {
}
