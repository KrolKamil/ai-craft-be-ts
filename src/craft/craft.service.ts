import { Injectable } from '@nestjs/common';
import { DeviceRepository } from './craft.repository';
import { DeviceConfigurationEditor } from './device-configuration-editor';
import {
    DeviceConfiguration,
    Ownership,
    Location,
    Settings,
} from './craft.model';

@Injectable()
export class DeviceConfigurationService {
    constructor(private readonly repository: DeviceRepository) {}

    async getDevice(deviceId: string): Promise<DeviceConfiguration | null> {
        const device = await this.repository.findById(deviceId);
        return device?.toDeviceConfiguration() || null;
    }

    async createDevice(deviceId: string): Promise<DeviceConfiguration> {
        const device =
            DeviceConfigurationEditor.newDeviceConfiguration(deviceId);
        await this.repository.save(device);
        return device.toDeviceConfiguration();
    }

    async updateOwnership(
        deviceId: string,
        ownership: Ownership,
    ): Promise<DeviceConfiguration | null> {
        const device = await this.repository.findById(deviceId);
        if (!device) {
            return null;
        }

        device.assignOwnership(ownership);
        await this.repository.save(device);
        return device.toDeviceConfiguration();
    }

    async updateLocation(
        deviceId: string,
        location: Location | null,
    ): Promise<DeviceConfiguration | null> {
        const device = await this.repository.findById(deviceId);
        if (!device) {
            return null;
        }

        device.updateLocation(location);
        await this.repository.save(device);
        return device.toDeviceConfiguration();
    }

    async updateSettings(
        deviceId: string,
        settings: Settings,
    ): Promise<DeviceConfiguration | null> {
        const device = await this.repository.findById(deviceId);
        if (!device) {
            return null;
        }

        device.updateSettings(settings);
        await this.repository.save(device);
        return device.toDeviceConfiguration();
    }

    async findDevicesByOperator(
        operator: string,
    ): Promise<DeviceConfiguration[]> {
        const devices = await this.repository.findByOperator(operator);
        return devices.map((device) => device.toDeviceConfiguration());
    }
}
