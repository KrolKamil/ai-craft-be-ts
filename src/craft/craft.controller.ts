import {
    Controller,
    Get,
    Param,
    Patch,
    Body,
    NotFoundException,
} from '@nestjs/common';
import { DeviceConfigurationService } from './craft.service';
import {
    DeviceConfiguration,
    Ownership,
    Location,
    Settings,
    Coordinates,
    Violations,
} from './craft.model';

class OwnershipDto {
    operator: string | null;
    provider: string | null;
}

class CoordinatesDto {
    longitude: number;
    latitude: number;
}

class LocationDto {
    street: string | null;
    houseNumber: string | null;
    city: string | null;
    postalCode: string | null;
    country: string | null;
    coordinates: CoordinatesDto;
}

class SettingsDto {
    autoStart?: boolean;
    remoteControl?: boolean;
    billing?: boolean;
    reimbursement?: boolean;
    showOnMap?: boolean;
    publicAccess?: boolean;
}

class UpdateDeviceDto {
    ownership?: OwnershipDto;
    location?: LocationDto;
    settings?: SettingsDto;
}

class DeviceConfigurationDto {
    deviceId: string;
    ownership: {
        operator: string | null;
        provider: string | null;
    };
    location: {
        street: string | null;
        houseNumber: string | null;
        city: string | null;
        postalCode: string | null;
        country: string | null;
        coordinates: {
            longitude: number;
            latitude: number;
        };
    } | null;
    openingHours: {
        alwaysOpen: boolean;
    };
    settings: {
        autoStart: boolean;
        remoteControl: boolean;
        billing: boolean;
        reimbursement: boolean;
        showOnMap: boolean;
        publicAccess: boolean;
    };
    violations: {
        operatorNotAssigned: boolean;
        providerNotAssigned: boolean;
        locationMissing: boolean;
        showOnMapButMissingLocation: boolean;
        showOnMapButNoPublicAccess: boolean;
    };
}

@Controller('devices')
export class DeviceConfigurationController {
    constructor(private readonly deviceService: DeviceConfigurationService) {}

    @Get(':deviceId')
    async getDevice(
        @Param('deviceId') deviceId: string,
    ): Promise<DeviceConfigurationDto> {
        const device = await this.deviceService.getDevice(deviceId);

        if (!device) {
            throw new NotFoundException('Device not found');
        }

        return this.toDto(device);
    }

    @Patch(':deviceId')
    async updateDevice(
        @Param('deviceId') deviceId: string,
        @Body() updateDto: UpdateDeviceDto,
    ): Promise<DeviceConfigurationDto> {
        let device = await this.deviceService.getDevice(deviceId);

        if (!device) {
            throw new NotFoundException('Device not found');
        }

        if (updateDto.ownership) {
            const ownership = Ownership.of(
                updateDto.ownership.operator!,
                updateDto.ownership.provider!,
            );
            device = await this.deviceService.updateOwnership(
                deviceId,
                ownership,
            );
        }

        if (updateDto.location) {
            const coordinates = new Coordinates(
                updateDto.location.coordinates.longitude,
                updateDto.location.coordinates.latitude,
            );
            const location = Location.of(
                updateDto.location.street,
                updateDto.location.houseNumber,
                updateDto.location.city,
                updateDto.location.postalCode,
                updateDto.location.country,
                coordinates,
            );
            device = await this.deviceService.updateLocation(
                deviceId,
                location,
            );
        }

        if (updateDto.settings) {
            const settings = Settings.updated(
                updateDto.settings.autoStart,
                updateDto.settings.remoteControl,
                updateDto.settings.billing,
                updateDto.settings.reimbursement,
                updateDto.settings.showOnMap,
                updateDto.settings.publicAccess,
            );
            device = await this.deviceService.updateSettings(
                deviceId,
                settings,
            );
        }

        return this.toDto(device!);
    }

    private toDto(device: DeviceConfiguration): DeviceConfigurationDto {
        return {
            deviceId: device.deviceId,
            ownership: {
                operator: device.ownership.operator,
                provider: device.ownership.provider,
            },
            location: device.location
                ? {
                      street: device.location.street,
                      houseNumber: device.location.houseNumber,
                      city: device.location.city,
                      postalCode: device.location.postalCode,
                      country: device.location.country,
                      coordinates: {
                          longitude: device.location.coordinates.longitude,
                          latitude: device.location.coordinates.latitude,
                      },
                  }
                : null,
            openingHours: {
                alwaysOpen: device.openingHours.alwaysOpen,
            },
            settings: {
                autoStart: device.settings.autoStart,
                remoteControl: device.settings.remoteControl,
                billing: device.settings.billing,
                reimbursement: device.settings.reimbursement,
                showOnMap: device.settings.showOnMap,
                publicAccess: device.settings.publicAccess,
            },
            violations: {
                operatorNotAssigned: device.violations.operatorNotAssigned,
                providerNotAssigned: device.violations.providerNotAssigned,
                locationMissing: device.violations.locationMissing,
                showOnMapButMissingLocation:
                    device.violations.showOnMapButMissingLocation,
                showOnMapButNoPublicAccess:
                    device.violations.showOnMapButNoPublicAccess,
            },
        };
    }
}
