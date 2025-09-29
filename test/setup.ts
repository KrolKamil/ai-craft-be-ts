import { config } from 'dotenv';
import 'reflect-metadata';
import { beforeAll } from 'vitest';

// Load environment variables from .env file
config();

// Set up global test environment
beforeAll(() => {
    // Add any global test setup here
});
