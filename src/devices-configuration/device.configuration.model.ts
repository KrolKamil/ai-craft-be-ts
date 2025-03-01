import { Type } from 'class-transformer';
import { DeviceConfigurationEditor } from './device.configuration.editor';

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

    isOwned(): boolean {
        return this.operator !== null && this.provider !== null;
    }

    equals(ownership: Ownership) {
        return (
            this.operator === ownership.operator &&
            this.provider === ownership.provider
        );
    }
}

export class Location {
    constructor(
        readonly street: string | null,
        readonly houseNumber: string | null,
        readonly city: string | null,
        readonly postalCode: string | null,
        readonly state: string | null,
        readonly country: string | null,
        readonly coordinates: Coordinates,
    ) {}

    static equals(some: Location | null, other: Location | null) {
        return some?.equals(other) ?? other === null;
    }

    equals(other: Location | null): boolean {
        if (other === null) return false;

        return (
            this.street === other.street &&
            this.houseNumber === other.houseNumber &&
            this.city === other.city &&
            this.postalCode === other.postalCode &&
            this.state === other.state &&
            this.country === other.country &&
            this.coordinates.equals(other.coordinates)
        );
    }
}

export class Coordinates {
    constructor(
        readonly longitude: number,
        readonly latitude: number,
    ) {}

    equals(other: Coordinates): boolean {
        return (
            this.longitude === other.longitude &&
            this.latitude === other.latitude
        );
    }
}

export class Settings {
    static of(partial: Partial<Settings>) {
        return Object.assign(new Settings(), partial);
    }

    constructor(
        readonly autoStart?: boolean,
        readonly remoteControl?: boolean,
        readonly billing?: boolean,
        readonly reimbursement?: boolean,
        readonly showOnMap?: boolean,
        readonly publicAccess?: boolean,
    ) {}

    static defaultSettings(): Settings {
        return new Settings(false, false, false, false, false, false);
    }

    public merge(other: Settings): Settings {
        return Settings.of({
            autoStart: other.autoStart ?? this.autoStart,
            remoteControl: other.remoteControl ?? this.remoteControl,
            billing: other.billing ?? this.billing,
            reimbursement: other.reimbursement ?? this.reimbursement,
            showOnMap: other.showOnMap ?? this.showOnMap,
            publicAccess: other.publicAccess ?? this.publicAccess,
        });
    }

    equals(merged: Settings): boolean {
        return (
            this.autoStart === merged.autoStart &&
            this.remoteControl === merged.remoteControl &&
            this.billing === merged.billing &&
            this.reimbursement === merged.reimbursement &&
            this.showOnMap === merged.showOnMap &&
            this.publicAccess === merged.publicAccess
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

    isValid(): boolean {
        return (
            !this.operatorNotAssigned &&
            !this.providerNotAssigned &&
            !this.locationMissing &&
            !this.showOnMapButMissingLocation &&
            !this.showOnMapButNoPublicAccess
        );
    }
}

export class OpeningHours {
    constructor(
        readonly alwaysOpen: boolean,
        readonly opened: Week | null,
    ) {}

    static ALWAYS_OPEN = new OpeningHours(true, null);

    static alwaysOpened() {
        return this.ALWAYS_OPEN;
    }

    static openAt(
        monday: OpeningTime,
        tuesday: OpeningTime,
        wednesday: OpeningTime,
        thursday: OpeningTime,
        friday: OpeningTime,
        saturday: OpeningTime,
        sunday: OpeningTime,
    ) {
        return new OpeningHours(
            false,
            new Week(
                monday,
                tuesday,
                wednesday,
                thursday,
                friday,
                saturday,
                sunday,
            ),
        );
    }

    equals(openingHours: OpeningHours): boolean {
        return (
            (this.alwaysOpen === true && openingHours.alwaysOpen === true) ||
            (this.alwaysOpen === false &&
                openingHours.alwaysOpen === false &&
                JSON.stringify(this.opened) ===
                    JSON.stringify(openingHours.opened))
        );
    }
}

export class Week {
    constructor(
        readonly monday: OpeningTime,
        readonly tuesday: OpeningTime,
        readonly wednesday: OpeningTime,
        readonly thursday: OpeningTime,
        readonly friday: OpeningTime,
        readonly saturday: OpeningTime,
        readonly sunday: OpeningTime,
    ) {}
}

export class OpeningTime {}

export class Opened24h implements OpeningTime {}

export class Closed24h implements OpeningTime {}

export class OpenTime implements OpeningTime {
    constructor(readonly time: TimeSpan[]) {}
}

export class TimeSpan {
    constructor(
        readonly open: LocalTime,
        readonly close: LocalTime,
    ) {}
}

export class LocalTime {
    constructor(
        readonly hour:
            | '01'
            | '02'
            | '03'
            | '04'
            | '05'
            | '06'
            | '07'
            | '08'
            | '09'
            | '10'
            | '11'
            | '12'
            | '13'
            | '14'
            | '15'
            | '16'
            | '17'
            | '18'
            | '19'
            | '20'
            | '21'
            | '22'
            | '23'
            | '24',
        readonly minute:
            | '00'
            | '01'
            | '02'
            | '03'
            | '04'
            | '05'
            | '06'
            | '07'
            | '08'
            | '09'
            | '10'
            | '11'
            | '12'
            | '13'
            | '14'
            | '15'
            | '16'
            | '17'
            | '18'
            | '19'
            | '20'
            | '21'
            | '22'
            | '23'
            | '24'
            | '25'
            | '26'
            | '27'
            | '28'
            | '29'
            | '30'
            | '31'
            | '32'
            | '33'
            | '34'
            | '35'
            | '36'
            | '37'
            | '38'
            | '39'
            | '40'
            | '41'
            | '42'
            | '43'
            | '44'
            | '45'
            | '46'
            | '47'
            | '48'
            | '49'
            | '50'
            | '51'
            | '52'
            | '53'
            | '54'
            | '55'
            | '56'
            | '57'
            | '58'
            | '59',
    ) {}
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
}

export class UpdateDevice {
    @Type(() => Ownership)
    readonly ownership?: Ownership;
    @Type(() => Location)
    readonly location?: Location;
    @Type(() => OpeningHours)
    readonly openingHours?: OpeningHours;
    @Type(() => Settings)
    readonly settings?: Settings;

    constructor(partial: Partial<UpdateDevice> = {}) {
        Object.assign(this, partial);
    }

    apply(device: DeviceConfigurationEditor): void {
        if (this.ownership) {
            device.assignTo(this.ownership);
        }
        if (this.location) {
            device.updateLocation(this.location);
        }
        if (this.openingHours) {
            device.updateOpeningHours(this.openingHours);
        }
        if (this.settings) {
            device.updateSettings(this.settings);
        }
    }
}
