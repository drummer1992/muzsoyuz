import {
	Body,
	Controller,
	Get,
	Inject,
	Patch, Post, Req, UseGuards,
	UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common'
import { UserDto } from '../dto/user.dto'
import { UserService } from './user.service'
import { LoggingInterceptor } from '../logging/logging.interceptor'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { WorkdayDto, WorkdayFilterDto } from '../dto/workday.dto'

@UseInterceptors(LoggingInterceptor)
@Controller('user')
export class UserController {
	@Inject()
	private readonly userService: UserService

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Req() { user }) {
		return this.userService.getProfile(user.id)
	}

	@UseGuards(JwtAuthGuard)
	@Patch('profile')
	updateProfile(@Req() { user }, @Body() data: UserDto) {
		return this.userService.updateProfile(user.id, data)
	}

	@UseGuards(JwtAuthGuard)
	@Post('workday')
	@UsePipes(ValidationPipe)
	markWorkingDay(@Req() { user }, @Body() data: WorkdayDto) {
		return this.userService.markWorkingDay(user, data)
	}

	@Post('findByBusyness')
	@UsePipes(ValidationPipe)
	findUsersByBusyness(@Body() filter: WorkdayFilterDto) {
		return this.userService.findUsersByBusyness(filter)
	}
}
