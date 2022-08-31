import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AllowedRoles } from 'src/auth/roles.decorator';
import { Roles } from 'src/roles';
import { ProfileDTO } from 'src/user/dto/profile.dto';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@AllowedRoles(Roles['semi-admin'], Roles.admin)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @ApiOkResponse({ description: 'User profile', type: ProfileDTO })
  @ApiParam({ name: 'id', description: 'User id.' })
  @Get('get-user/:id')
  async getUsersData(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.getUserData(id);
  }
}
