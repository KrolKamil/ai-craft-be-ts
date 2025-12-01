export class Ownership {
    constructor(
        readonly operator: string | null,
        readonly provider: string | null,
    ) {
        if (
            (operator === null && provider !== null) ||
            (operator !== null && provider === null)
        ) {
            throw new Error('Ownership must be either owned or unowned');
        }
    }

    static unowned(): Ownership {
        return new Ownership(null, null);
    }

    static of(operator: string, provider: string): Ownership {
        return new Ownership(operator, provider);
    }

    isUnowned(): boolean {
        return this.operator === null && this.provider === null;
    }

    equals(ownership: Ownership): boolean {
        return (
            this.operator === ownership.operator &&
            this.provider === ownership.provider
        );
    }
}

export class Coordinates {
    constructor(
        readonly longitude: number,
        readonly latitude: number,
    ) {
        if (longitude < -180 || longitude > 180) {
            throw new Error('Longitude must be between -180 and 180');
        }
        if (latitude < -90 || latitude > 90) {
            throw new Error('Latitude must be between -90 and 90');
        }
    }

    equals(coordinates: Coordinates): boolean {
        return (
            this.longitude === coordinates.longitude &&
            this.latitude === coordinates.latitude
        );
    }
}

export class Location {
    constructor(
        readonly street: string | null,
        readonly houseNumber: string | null,
        readonly city: string | null,
        readonly postalCode: string | null,
        readonly country: string | null,
        readonly coordinates: Coordinates,
    ) {}

    static of(
        street: string | null,
        houseNumber: string | null,
        city: string | null,
        postalCode: string | null,
        country: string | null,
        coordinates: Coordinates,
    ): Location {
        return new Location(
            street,
            houseNumber,
            city,
            postalCode,
            country,
            coordinates,
        );
    }

    equals(location: Location): boolean {
        return (
            this.street === location.street &&
            this.houseNumber === location.houseNumber &&
            this.city === location.city &&
            this.postalCode === location.postalCode &&
            this.country === location.country &&
            this.coordinates.equals(location.coordinates)
        );
    }
}

export class OpeningHours {
    private constructor(readonly alwaysOpen: boolean) {}

    static alwaysOpened(): OpeningHours {
        return new OpeningHours(true);
    }

    equals(openingHours: OpeningHours): boolean {
        return this.alwaysOpen === openingHours.alwaysOpen;
    }
}

export class Settings {
    constructor(
        readonly autoStart: boolean,
        readonly remoteControl: boolean,
        readonly billing: boolean,
        readonly reimbursement: boolean,
        readonly showOnMap: boolean,
        readonly publicAccess: boolean,
    ) {}

    static defaultSettings(): Settings {
        return new Settings(false, false, false, false, false, false);
    }

    static updated(
        autoStart: boolean | null = null,
        remoteControl: boolean | null = null,
        billing: boolean | null = null,
        reimbursement: boolean | null = null,
        showOnMap: boolean | null = null,
        publicAccess: boolean | null = null,
    ): Settings {
        const defaults = Settings.defaultSettings();
        return new Settings(
            autoStart ?? defaults.autoStart,
            remoteControl ?? defaults.remoteControl,
            billing ?? defaults.billing,
            reimbursement ?? defaults.reimbursement,
            showOnMap ?? defaults.showOnMap,
            publicAccess ?? defaults.publicAccess,
        );
    }

    equals(settings: Settings): boolean {
        return (
            this.autoStart === settings.autoStart &&
            this.remoteControl === settings.remoteControl &&
            this.billing === settings.billing &&
            this.reimbursement === settings.reimbursement &&
            this.showOnMap === settings.showOnMap &&
            this.publicAccess === settings.publicAccess
        );
    }
}

export class Violations {
    constructor(
        readonly operatorNotAssigned: boolean,
        readonly providerNotAssigned: boolean,
        readonly locationMissing: boolean,
        readonly showOnMapButMissingLocation: boolean,
        readonly showOnMapButNoPublicAccess: boolean,
    ) {}

    static builder(): ViolationsBuilder {
        return new ViolationsBuilder();
    }

    static none(): Violations {
        return new ViolationsBuilder().build();
    }
}

class ViolationsBuilder {
    private operatorNotAssigned: boolean = false;
    private providerNotAssigned: boolean = false;
    private locationMissing: boolean = false;
    private showOnMapButMissingLocation: boolean = false;
    private showOnMapButNoPublicAccess: boolean = false;

    withOperatorNotAssigned(value: boolean = true): ViolationsBuilder {
        this.operatorNotAssigned = value;
        return this;
    }

    withProviderNotAssigned(value: boolean = true): ViolationsBuilder {
        this.providerNotAssigned = value;
        return this;
    }

    withLocationMissing(value: boolean = true): ViolationsBuilder {
        this.locationMissing = value;
        return this;
    }

    withShowOnMapButMissingLocation(value: boolean = true): ViolationsBuilder {
        this.showOnMapButMissingLocation = value;
        return this;
    }

    withShowOnMapButNoPublicAccess(value: boolean = true): ViolationsBuilder {
        this.showOnMapButNoPublicAccess = value;
        return this;
    }

    build(): Violations {
        return new Violations(
            this.operatorNotAssigned,
            this.providerNotAssigned,
            this.locationMissing,
            this.showOnMapButMissingLocation,
            this.showOnMapButNoPublicAccess,
        );
    }
}

export class DeviceConfiguration {
    constructor(
        readonly deviceId: string,
        readonly ownership: Ownership,
        readonly location: Location | null,
        readonly settings: Settings,
        readonly openingHours: OpeningHours,
        readonly violations: Violations,
    ) {}

    static newDevice(deviceId: string): DeviceConfiguration {
        return new DeviceConfiguration(
            deviceId,
            Ownership.unowned(),
            null,
            Settings.defaultSettings(),
            OpeningHours.alwaysOpened(),
            Violations.none(),
        );
    }
}
