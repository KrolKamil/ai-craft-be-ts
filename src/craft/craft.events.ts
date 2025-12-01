import { Ownership, Location, Settings } from './craft.model';

export interface DomainEvent {
    readonly deviceId: string;
}

export class DeviceCreated implements DomainEvent {
    constructor(
        readonly deviceId: string,
        readonly ownership: Ownership,
        readonly location: Location | null,
        readonly settings: Settings,
    ) {}
}

export class OwnershipUpdated implements DomainEvent {
    constructor(
        readonly deviceId: string,
        readonly ownership: Ownership,
    ) {}
}

export class LocationUpdated implements DomainEvent {
    constructor(
        readonly deviceId: string,
        readonly location: Location | null,
    ) {}
}

export class SettingsUpdated implements DomainEvent {
    constructor(
        readonly deviceId: string,
        readonly settings: Settings,
    ) {}
}
