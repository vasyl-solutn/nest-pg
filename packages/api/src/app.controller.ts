import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('data')
  async getData() {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return this.appService.getHello();
  }
}
