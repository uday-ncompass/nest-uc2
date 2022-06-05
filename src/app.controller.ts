import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { threadId } from 'worker_threads';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(){
    return this.appService.getHello()
  }
}
