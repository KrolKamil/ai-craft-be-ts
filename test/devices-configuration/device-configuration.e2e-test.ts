import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { DeviceConfigurationModule } from '../../src/devices-configuration/device.configuration.module';
import { v4 as uuidv4 } from 'uuid';
import { mainConfig } from '../../src/main';

describe('Configuration process (e2e)', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [DeviceConfigurationModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        mainConfig(app);
        await app.init();
    });

    it('should create a new device configuration', () => {
        const deviceId = uuidv4();
        return request(app.getHttpServer())
            .put(`/devices/${deviceId}`)
            .send({
                ownership: {
                    operator: 'operator-1',
                    provider: 'provider-1',
                },
                location: {
                    street: 'Rakietowa',
                    houseNumber: '1A',
                    city: 'Wrocław',
                    postalCode: '54-621',
                    state: null,
                    country: 'POL',
                    coordinates: {
                        longitude: 51.09836221719513,
                        latitude: 16.931752852309156,
                    },
                },
            })
            .expect(200)
            .expect({
                deviceId,
                ownership: {
                    operator: 'operator-1',
                    provider: 'provider-1',
                },
                location: {
                    street: 'Rakietowa',
                    houseNumber: '1A',
                    city: 'Wrocław',
                    postalCode: '54-621',
                    state: null,
                    country: 'POL',
                    coordinates: {
                        longitude: 51.09836221719513,
                        latitude: 16.931752852309156,
                    },
                },
                settings: {
                    autoStart: false,
                    remoteControl: false,
                    billing: false,
                    reimbursement: false,
                    showOnMap: false,
                    publicAccess: false,
                },
                openingHours: {
                    alwaysOpen: true,
                    opened: null,
                },
                violations: {
                    operatorNotAssigned: false,
                    providerNotAssigned: false,
                    locationMissing: false,
                    showOnMapButMissingLocation: false,
                    showOnMapButNoPublicAccess: false,
                },
            });
    });
});
