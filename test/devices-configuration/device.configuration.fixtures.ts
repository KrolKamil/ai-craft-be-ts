import {
    Settings,
    Location,
    Ownership,
    Coordinates,
} from '../../src/devices-configuration/device.configuration.model';

export class StationConfigurationFixture {
    static readonly someLocation = new Location(
        'Rakietowa',
        '1A',
        'Wrocław',
        '54-621',
        null,
        'POL',
        new Coordinates(51.09836221719513, 16.931752852309156),
    );

    static readonly someOtherLocation = new Location(
        'Żwirki i Wigury',
        '1H',
        'Warszawa',
        '54-202',
        null,
        'PL',
        new Coordinates(51.11745363251369, 16.997318413019084),
    );

    static readonly someOwnership = new Ownership('operator-1', 'provider-1');
    static readonly someOtherOwnership = new Ownership(
        'Devicex.pl',
        'public-devices',
    );

    static readonly publicSettings = Settings.defaultSettings().merge(
        Settings.of({
            publicAccess: true,
            showOnMap: true,
        }),
    );

    static readonly autoStartOnly = Settings.of({
        autoStart: true,
    });
}
