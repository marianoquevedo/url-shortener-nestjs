import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { ApiOperation } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary:
      'Basic healthcheck endpoint. Would be used by container orchestration tools to check the status of the service.',
  })
  check() {
    return this.health.check([
      () =>
        Promise.resolve({
          self: {
            status: 'up',
          },
        }),
    ]);
  }
}
