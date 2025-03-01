import { Ownership, Settings, Location, OpeningHours } from "./device.configuration.model";

export interface DomainEvent {
    deviceId: string;
}

export class LocationUpdated implements DomainEvent {
    constructor(
        readonly deviceId: string,
        readonly location: Location | null
    ) {}
}

export class OpeningHoursUpdated implements DomainEvent {
    constructor(
        readonly deviceId: string,
        readonly openingHours: OpeningHours
    ) {}
}

export class OwnershipUpdated implements DomainEvent {
    constructor(
        readonly deviceId: string,
        readonly ownership: Ownership
    ) {}
}

export class SettingsUpdated implements DomainEvent {
    constructor(
        readonly deviceId: string,
        readonly settings: Settings
    ) {}
}