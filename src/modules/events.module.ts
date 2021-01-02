import { Module } from '@nestjs/common';
import { EventsGateway } from '../events/events.gateway';

@Module({
	providers: [EventsGateway],
})
export class EventsModule {}