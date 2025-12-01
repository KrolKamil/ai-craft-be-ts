import {
    DomainEvent,
    DeviceCreated,
    OwnershipUpdated,
    LocationUpdated,
    SettingsUpdated,
} from './craft.events';
import {
    Ownership,
    Location,
    Settings,
    OpeningHours,
    DeviceConfiguration,
    Violations,
} from './craft.model';

export class DeviceConfigurationEditor {
    private events: DomainEvent[] = [];

    constructor(
        readonly deviceId: string,
        private ownership: Ownership,
        private location: Location | null,
        private openingHours: OpeningHours,
        private settings: Settings,
    ) {}

    static newDeviceConfiguration(deviceId: string): DeviceConfigurationEditor {
        const editor = new DeviceConfigurationEditor(
            deviceId,
            Ownership.unowned(),
            null,
            OpeningHours.alwaysOpened(),
            Settings.defaultSettings(),
        );

        editor.events.push(
            new DeviceCreated(
                deviceId,
                editor.ownership,
                editor.location,
                editor.settings,
            ),
        );

        return editor;
    }

    static fromConfiguration(
        configuration: DeviceConfiguration,
    ): DeviceConfigurationEditor {
        return new DeviceConfigurationEditor(
            configuration.deviceId,
            configuration.ownership,
            configuration.location,
            configuration.openingHours,
            configuration.settings,
        );
    }

    assignOwnership(ownership: Ownership): void {
        this.ensureCanAssignOwnership(ownership);

        if (!this.ownership.equals(ownership)) {
            this.ownership = ownership;
            this.events.push(new OwnershipUpdated(this.deviceId, ownership));

            if (ownership.isUnowned()) {
                this.resetToDefaults();
            }
        }
    }

    updateLocation(location: Location | null): void {
        if (!this.locationsEqual(location)) {
            this.location = location;
            this.events.push(new LocationUpdated(this.deviceId, location));
        }
    }

    updateSettings(settings: Settings): void {
        if (!this.settings.equals(settings)) {
            this.settings = settings;
            this.events.push(new SettingsUpdated(this.deviceId, settings));
        }
    }

    getUncommittedEvents(): DomainEvent[] {
        return [...this.events];
    }

    markEventsAsCommitted(): void {
        this.events = [];
    }

    private checkViolations(): Violations {
        const builder = Violations.builder();

        if (!this.ownership.isUnowned()) {
            if (!this.ownership.operator) {
                builder.withOperatorNotAssigned();
            }
            if (!this.ownership.provider) {
                builder.withProviderNotAssigned();
            }
        }

        if (!this.location) {
            builder.withLocationMissing();
        }

        if (this.settings.showOnMap && !this.location) {
            builder.withShowOnMapButMissingLocation();
        }

        if (this.settings.showOnMap && !this.settings.publicAccess) {
            builder.withShowOnMapButNoPublicAccess();
        }

        return builder.build();
    }

    toDeviceConfiguration(): DeviceConfiguration {
        const violations = this.checkViolations();
        return new DeviceConfiguration(
            this.deviceId,
            this.ownership,
            this.location,
            this.settings,
            this.openingHours,
            violations,
        );
    }

    private ensureCanAssignOwnership(ownership: Ownership): void {
        if (
            !ownership.isUnowned() &&
            (ownership.operator === null || ownership.provider === null)
        ) {
            throw new Error(
                'Owned devices must have both operator and provider set',
            );
        }
    }

    private locationsEqual(newLocation: Location | null): boolean {
        if (this.location === null && newLocation === null) {
            return true;
        }
        if (this.location === null || newLocation === null) {
            return false;
        }
        return this.location.equals(newLocation);
    }

    private resetToDefaults(): void {
        this.location = null;
        this.settings = Settings.defaultSettings();
        this.events.push(new LocationUpdated(this.deviceId, null));
        this.events.push(new SettingsUpdated(this.deviceId, this.settings));
    }
}
