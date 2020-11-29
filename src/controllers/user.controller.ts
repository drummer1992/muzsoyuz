import {
	Body,
	Controller,
	Get,
	Inject,
	Patch, Post, Put, Req, UseGuards,
	UsePipes, ValidationPipe,
} from '@nestjs/common'
import { UpdateUserDto } from './dto/user.dto'
import { UserService } from '../services/user.service'
import { JwtAuthGuard } from '../services/auth/guards/jwt-auth.guard'
import { WorkdayDto, WorkdayFilterDto } from './dto/workday.dto'

@Controller('user')
export class UserController {
	@Inject()
	private readonly userService: UserService

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	getProfile(@Req() { user }) {
		return this.userService.getProfile(user.id)
	}

	@Patch('profile')
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	updateProfile(@Req() { user }, @Body() data: UpdateUserDto) {
		return this.userService.updateProfile(user.id, data)
	}

	@Post('workday')
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	createWorkingDay(@Req() { user }, @Body() data: WorkdayDto) {
		return this.userService.createWorkingDay(user.id, data)
	}

	@Put('workday')
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	updateWorkingDay(@Req() { user }, @Body() data: WorkdayDto) {
		return this.userService.updateWorkingDay(user.id, data)
	}

	@Post('findByBusyness')
	@UsePipes(ValidationPipe)
	findUsersByBusyness(@Body() filter: WorkdayFilterDto) {
		return this.userService.findUsersByBusyness(filter)
	}
}
