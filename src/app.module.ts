import { Module } from '@nestjs/common';
import { DeviceConfigurationModule } from './devices-configuration/device.configuration.module';

@Module({
    imports: [DeviceConfigurationModule],
})
export class AppModule {}
