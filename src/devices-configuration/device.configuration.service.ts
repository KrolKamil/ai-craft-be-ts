import { Injectable } from '@nestjs/common';
import { DeviceRepository } from './device.configuration.repository';
import {
    DeviceConfiguration,
    UpdateDevice,
} from './device.configuration.model';
import { DeviceConfigurationEditor } from './device.configuration.editor';

@Injectable()
export class DeviceConfigurationService {
    constructor(private readonly repository: DeviceRepository) {}

    async getDevice(deviceId: string): Promise<DeviceConfiguration | null> {
        const device = await this.repository.findOne(deviceId);
        return device?.toDeviceConfiguration() || null;
    }

    async createNewDevice(
        deviceId: string,
        update: UpdateDevice,
    ): Promise<DeviceConfiguration> {
        const device =
            DeviceConfigurationEditor.newDeviceConfiguration(deviceId);
        update.apply(device);
        await this.repository.save(device);
        return device.toDeviceConfiguration();
    }

    async updateDevice(
        deviceId: string,
        update: UpdateDevice,
    ): Promise<DeviceConfiguration | null> {
        const device = await this.repository.findOne(deviceId);
        if (!device) {
            return null;
        }

        update.apply(device);
        await this.repository.save(device);
        return device.toDeviceConfiguration();
    }
}
