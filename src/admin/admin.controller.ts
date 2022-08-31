import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Public } from 'src/auth/jwt-strategy/public.decorator';
import { AllowedRoles } from 'src/auth/roles.decorator';
import { Roles } from 'src/roles';
import { AdminService } from './admin.service';

@AllowedRoles(Roles['semi-admin'], Roles.admin)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Public()
  @Get('create-admin')
  async createAdmin() {
    return this.adminService.createAdminUser();
  }

  @Get('get-user/:id')
  async getUsersData(@Param('id', ParseIntPipe) id) {
    return this.adminService.getUserData(id);
  }
}
