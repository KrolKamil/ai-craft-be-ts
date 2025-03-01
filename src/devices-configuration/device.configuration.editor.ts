import { Ownership, Settings, Location, OpeningHours, DeviceConfiguration, Violations } from "./device.configuration.model";
import { DomainEvent, LocationUpdated, OpeningHoursUpdated, OwnershipUpdated, SettingsUpdated } from "./device.configuration.events";

export class DeviceConfigurationEditor {

    constructor(
        readonly deviceId: string,
        readonly events: DomainEvent[],
        private ownership: Ownership,
        private location: Location | null,
        private openingHours: OpeningHours,
        private settings: Settings,
    ) { }

    static newDeviceConfiguration(deviceId: string): DeviceConfigurationEditor {
        return new DeviceConfigurationEditor(
            deviceId,
            [],
            Ownership.unowned(),
            null,
            OpeningHours.alwaysOpened(),
            Settings.defaultSettings()
        );
    }

    resetToDefaults(): void {
        this.updateLocation(null);
        this.updateOpeningHours(OpeningHours.alwaysOpened());
        this.updateSettings(Settings.defaultSettings());
    }

    assignTo(ownership: Ownership): void {
        if (!this.ownership.equals(ownership)) {
            this.ownership = ownership;
            this.events.push(new OwnershipUpdated(this.deviceId, ownership));
            
            if (ownership.isUnowned()) {
                this.resetToDefaults();
            }
        }
    }

    updateLocation(location: Location | null): void {
        if (!Location.equals(this.location, location)) {
            this.location = location;
            this.events.push(new LocationUpdated(this.deviceId, location));
        }
    }

    updateOpeningHours(openingHours: OpeningHours): void {
        if (!this.openingHours.equals(openingHours)) {
            this.openingHours = openingHours;
            this.events.push(new OpeningHoursUpdated(this.deviceId, openingHours));
        }
    }

    updateSettings(settings: Settings): void {
        const merged = this.settings.merge(settings);
        if (!this.settings.equals(merged)) {
            this.settings = merged;
            this.events.push(new SettingsUpdated(this.deviceId, this.settings));
        }
    }

    private checkViolations(): Violations {
        return {
            operatorNotAssigned: this.ownership.operator === null,
            providerNotAssigned: this.ownership.provider === null,
            locationMissing: this.location === null,
            showOnMapButMissingLocation: this.settings.showOnMap && this.location === null,
            showOnMapButNoPublicAccess: this.settings.showOnMap && !this.settings.publicAccess
        } as Violations;
    }

    toDeviceConfiguration(): DeviceConfiguration {
        const violations = this.checkViolations();
        return new DeviceConfiguration(
            this.deviceId,
            this.ownership,
            this.location,
            this.settings,
            this.openingHours,
            violations
        );
    }

}