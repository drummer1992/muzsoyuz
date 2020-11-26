import { Module } from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import { UserModule } from './user.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from '../services/auth/strategy/local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from '../services/auth/strategy/jwt.strategy'
import { FacebookStrategy } from '../services/auth/strategy/facebook.strategy'
import { GoogleStrategy } from '../services/auth/strategy/google.strategy'
import { AuthController } from '../controllers/auth.controller'

@Module({
	imports    : [
		UserModule,
		PassportModule,
		JwtModule.register({
			secret     : process.env.JWT_SECRET,
			signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
		}),
	],
	providers  : [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		FacebookStrategy,
		GoogleStrategy,
	],
	controllers: [AuthController],
})
export class AuthModule {
}
