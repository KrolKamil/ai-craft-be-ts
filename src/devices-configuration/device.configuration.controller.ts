import {
    Controller,
    Put,
    Patch,
    Param,
    Body,
    NotFoundException,
} from '@nestjs/common';
import { DeviceConfigurationService } from './device.configuration.service';
import {
    DeviceConfiguration,
    OpeningHours,
    Ownership,
    Settings,
    Location,
    UpdateDevice,
} from './device.configuration.model';

@Controller('devices')
export class DeviceConfigurationController {
    constructor(private readonly deviceService: DeviceConfigurationService) {}

    @Put(':deviceId')
    async put(
        @Param('deviceId') deviceId: string,
        @Body() update: UpdateDevice,
    ): Promise<DeviceConfiguration> {
        return this.deviceService.createNewDevice(deviceId, update);
    }

    @Patch(':deviceId')
    async patch(
        @Param('deviceId') deviceId: string,
        @Body() update: UpdateDevice,
    ): Promise<DeviceConfiguration> {
        const device = await this.deviceService.updateDevice(deviceId, update);
        if (!device) {
            throw new NotFoundException();
        }
        return device;
    }
}
