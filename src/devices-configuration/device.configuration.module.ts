import { Module } from '@nestjs/common';
import { DeviceConfigurationController } from './device.configuration.controller';
import { DeviceConfigurationService } from './device.configuration.service';
import { DeviceRepository } from './device.configuration.repository';

@Module({
    imports: [],
    controllers: [DeviceConfigurationController],
    providers: [DeviceConfigurationService, DeviceRepository],
})
export class DeviceConfigurationModule {}
