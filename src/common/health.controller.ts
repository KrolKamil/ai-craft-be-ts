import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
    @Get()
    @ApiOperation({ summary: 'Check service health' })
    @ApiResponse({ status: 200, description: 'Service is healthy' })
    @ApiResponse({ status: 503, description: 'Service is unhealthy' })
    check() {
        const memUsage = process.memoryUsage();
        const heapUsed = memUsage.heapUsed;
        const heapTotal = memUsage.heapTotal;
        const rss = memUsage.rss;

        const isHealthy =
            heapUsed < 250 * 1024 * 1024 && rss < 250 * 1024 * 1024;

        return {
            status: isHealthy ? 'ok' : 'error',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                heapUsed: Math.round(heapUsed / 1024 / 1024) + 'MB',
                heapTotal: Math.round(heapTotal / 1024 / 1024) + 'MB',
                rss: Math.round(rss / 1024 / 1024) + 'MB',
            },
            checks: {
                memory_heap: {
                    status: heapUsed < 250 * 1024 * 1024 ? 'up' : 'down',
                    heapUsed: Math.round(heapUsed / 1024 / 1024) + 'MB',
                },
                memory_rss: {
                    status: rss < 250 * 1024 * 1024 ? 'up' : 'down',
                    rss: Math.round(rss / 1024 / 1024) + 'MB',
                },
            },
        };
    }
}
