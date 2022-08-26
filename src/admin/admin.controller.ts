import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AllowedRoles } from 'src/auth/roles.decorator';
import { Roles } from 'src/roles';
import { AdminService } from './admin.service';

@AllowedRoles(Roles['semi-admin'], Roles.admin)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('get-user/:id')
  async getUsersData(@Param('id', ParseIntPipe) id, @Res() res: Response) {
    const { status, data } = await this.adminService.getUserData(id);
    return res.status(status).json(data);
  }
}
