import { DeviceConfigurationEditor } from './device-configuration-editor';

export abstract class DeviceRepository {
    abstract save(device: DeviceConfigurationEditor): Promise<void>;
    abstract findById(
        deviceId: string,
    ): Promise<DeviceConfigurationEditor | null>;
    abstract findByOperator(
        operator: string,
    ): Promise<DeviceConfigurationEditor[]>;
}
