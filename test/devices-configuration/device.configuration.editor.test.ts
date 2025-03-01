import 'reflect-metadata';
import { DeviceConfigurationEditor } from '../../src/devices-configuration/device.configuration.editor';
import { StationConfigurationFixture } from './device.configuration.fixtures';
import {
    Settings,
    Ownership,
} from '../../src/devices-configuration/device.configuration.model';

describe('DeviceConfigurationEditor', () => {
    const deviceId = 'test-device-id';

    describe('new device configuration', () => {
        it('should have default settings', () => {
            const device =
                DeviceConfigurationEditor.newDeviceConfiguration(deviceId);
            const config = device.toDeviceConfiguration();

            expect(config.settings).toEqual(Settings.defaultSettings());
            expect(config.violations.operatorNotAssigned).toBeTruthy();
            expect(config.violations.providerNotAssigned).toBeTruthy();
        });

        it('should have unowned ownership', () => {
            const device =
                DeviceConfigurationEditor.newDeviceConfiguration(deviceId);
            const config = device.toDeviceConfiguration();

            expect(config.ownership).toEqual(Ownership.unowned());
        });

        it('should have no location', () => {
            const device =
                DeviceConfigurationEditor.newDeviceConfiguration(deviceId);
            const config = device.toDeviceConfiguration();

            expect(config.location).toBeNull();
            expect(config.violations.locationMissing).toBeTruthy();
        });
    });

    describe('settings management', () => {
        it('should override settings', () => {
            const device =
                DeviceConfigurationEditor.newDeviceConfiguration(deviceId);

            device.updateSettings(StationConfigurationFixture.publicSettings);
            const config = device.toDeviceConfiguration();

            expect(config.settings).toEqual(
                StationConfigurationFixture.publicSettings,
            );
        });

        it('should merge settings', () => {
            const device =
                DeviceConfigurationEditor.newDeviceConfiguration(deviceId);

            device.updateSettings(StationConfigurationFixture.publicSettings);
            device.updateSettings(StationConfigurationFixture.autoStartOnly);
            const config = device.toDeviceConfiguration();

            const expectedSettings = Settings.of({
                autoStart: true,
                remoteControl: false,
                billing: false,
                reimbursement: false,
                showOnMap: true,
                publicAccess: true,
            });
            expect(config.settings).toEqual(expectedSettings);
        });
    });

    describe('ownership management', () => {
        it('should assign to owner', () => {
            const device =
                DeviceConfigurationEditor.newDeviceConfiguration(deviceId);

            device.assignTo(StationConfigurationFixture.someOwnership);
            const config = device.toDeviceConfiguration();

            expect(config.ownership).toEqual(
                StationConfigurationFixture.someOwnership,
            );
        });

        it('should reset to defaults when ownership is set to unowned', () => {
            const device =
                DeviceConfigurationEditor.newDeviceConfiguration(deviceId);
            device.assignTo(StationConfigurationFixture.someOwnership);
            device.updateLocation(StationConfigurationFixture.someLocation);
            device.updateSettings(StationConfigurationFixture.publicSettings);

            device.assignTo(Ownership.unowned());
            const config = device.toDeviceConfiguration();

            expect(config.ownership).toEqual(Ownership.unowned());
            expect(config.location).toBeNull();
            expect(config.settings).toEqual(Settings.defaultSettings());
        });
    });

    describe('location management', () => {
        it('should update location', () => {
            const device =
                DeviceConfigurationEditor.newDeviceConfiguration(deviceId);

            device.updateLocation(StationConfigurationFixture.someLocation);
            const config = device.toDeviceConfiguration();

            expect(config.location).toEqual(
                StationConfigurationFixture.someLocation,
            );
        });

        it('should override location', () => {
            const device =
                DeviceConfigurationEditor.newDeviceConfiguration(deviceId);
            device.updateLocation(StationConfigurationFixture.someLocation);

            device.updateLocation(
                StationConfigurationFixture.someOtherLocation,
            );
            const config = device.toDeviceConfiguration();

            expect(config.location).toEqual(
                StationConfigurationFixture.someOtherLocation,
            );
        });
    });
});
