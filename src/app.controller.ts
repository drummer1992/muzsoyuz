import {
	Controller,
	Request,
	Post,
	UseGuards,
	UseInterceptors,
	Inject,
	UsePipes,
	ValidationPipe,
	Body,
} from '@nestjs/common'
import { LoggingInterceptor } from './logging/logging.interceptor'
import { LocalAuthGuard } from './auth/guards/local-auth.guard'
import { AuthService } from './auth/auth.service'
import { UsersService } from './users/users.service'
import { AuthDto } from './dto/user.dto'

@Controller()
@UseInterceptors(LoggingInterceptor)
export class AppController {
	@Inject()
	private readonly authService: AuthService
	@Inject()
	private readonly usersService: UsersService

	@UseGuards(LocalAuthGuard)
	@Post('auth/login')
	login(@Request() req) {
		return this.authService.login(req.user)
	}

	@Post('auth/register')
	@UsePipes(ValidationPipe)
	async register(@Body() data: AuthDto): Promise<object> {
		const user = await this.authService.register(data)

		const id = await this.usersService.createProfile(user)

		return this.authService.login({ email: data.email, id })
	}
}