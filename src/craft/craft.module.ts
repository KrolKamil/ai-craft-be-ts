import { Module, Provider } from '@nestjs/common';
import { DeviceConfigurationService } from './craft.service';
import { DeviceRepository } from './craft.repository';
import { DeviceConfigurationController } from './craft.controller';

export const DeviceRepositoryProvider: Provider = {
    provide: DeviceRepository,
    useFactory: () => {
        throw new Error('DeviceRepository provider not implemented');
    },
};

@Module({
    controllers: [DeviceConfigurationController],
    providers: [DeviceConfigurationService, DeviceRepositoryProvider],
    exports: [DeviceConfigurationService, DeviceRepository],
})
export class CraftModule {}
