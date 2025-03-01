import { Injectable } from '@nestjs/common';
import { DeviceConfigurationEditor } from './device.configuration.editor';

@Injectable()
export class DeviceRepository {
    private readonly devices: Map<string, DeviceConfigurationEditor> =
        new Map();

    findOne(deviceId: string): Promise<DeviceConfigurationEditor | null> {
        return Promise.resolve(this.devices.get(deviceId) ?? null);
    }

    save(device: DeviceConfigurationEditor): Promise<void> {
        this.devices.set(device.deviceId, device);
        return Promise.resolve();
    }
}
