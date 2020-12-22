import {
	Body,
	Get,
	Inject,
	Post, Req,
	UnauthorizedException,
	UseGuards,
	UsePipes,
	ValidationPipe,
	Controller,
} from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import { UserService } from '../services/user.service'
import { LocalAuthGuard } from '../services/auth/guards/local-auth.guard'
import { AuthDto } from './dto/user.dto'
import { FacebookAuthGuard } from '../services/auth/guards/facebook-auth.guard'
import { GoogleAuthGuard } from '../services/auth/guards/google-auth.guard'

@Controller('auth')
export class AuthController {
	@Inject()
	private readonly authService: AuthService
	@Inject()
	private readonly userService: UserService

	@Post('login')
	@UsePipes(ValidationPipe)
	@UseGuards(LocalAuthGuard)
	async login(@Req() { user }) {
		return {
			token  : this.authService.login({ username: user.email, sub: user.id }),
			profile: await this.userService.getProfileById(user.id),
		}
	}

	@Post('register')
	@UsePipes(ValidationPipe)
	register(@Body() credential: AuthDto) {
		return this.authService.register(credential)
	}

	@Get('oauth/facebook')
	@UseGuards(FacebookAuthGuard)
	oauthFacebook() {
		throw new UnauthorizedException()
	}

	@Get('oauth/google')
	@UseGuards(GoogleAuthGuard)
	oauthGoogle() {
		throw new UnauthorizedException()
	}

	@Get('oauth/google/callback')
	@UseGuards(GoogleAuthGuard)
	oauthGoogleCallback(@Req() { user }) {
		return this.authService.oauthHandler(user)
	}

	@Get('oauth/facebook/callback')
	@UseGuards(FacebookAuthGuard)
	oauthFacebookCallback(@Req() { user }) {
		return this.authService.oauthHandler(user)
	}
}