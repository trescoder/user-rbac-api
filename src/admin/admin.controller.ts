import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AllowedRoles } from 'src/auth/roles.decorator';
import { Roles } from 'src/roles';
import { AdminService } from './admin.service';

@AllowedRoles(Roles['semi-admin'], Roles.admin)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('get-user/:id')
  async getUsersData(@Param('id', ParseIntPipe) id) {
    return await this.adminService.getUserData(id);
  }
}
