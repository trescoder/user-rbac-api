import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/auth/jwt-strategy/public.decorator';
import { AllowedRoles } from 'src/auth/roles.decorator';
import { Roles } from 'src/roles';
import {
  PaginationOptions,
  SortDirection,
  WithPagination,
} from 'src/shared/decorators/with-pagination';
import { PostRepositoryService } from 'src/shared/repositories/post-repository/post-repository.service';
import { CreateAccountDTO } from './dto/create-account.dto';
import { CreateLikeDTO } from './dto/create-like.dto';
import { CreatePostDTO } from './dto/create-post.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { DeletePostDto } from './dto/delete-post.dto';
import { PostPageDto } from './dto/post-page.dto';
import { PostDTO } from './dto/post.dto';
import { ProfileDTO } from './dto/profile.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@AllowedRoles(Roles.admin, Roles['semi-admin'], Roles.user)
export class UserController {
  constructor(
    private userService: UserService,
    private postService: PostRepositoryService,
  ) {}

  @ApiOkResponse({ description: 'User profile', type: ProfileDTO })
  @Get('profile')
  async profile(@Req() req) {
    // req.user hold whatever the jwt strategy returns, in this case is the user email and the user id
    return this.userService.getUserProfile(req.user.id);
  }

  @Post('sign-up')
  @Public() // this will be use by the jwt guard to determine if it is a public route or not
  async signIn(@Body() body: CreateAccountDTO) {
    return this.userService.createAccount(body);
  }

  @WithPagination()
  @ApiOkResponse({
    description: 'Page of asset records.',
    type: PostPageDto,
  })
  @Get()
  async listPosts(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
    @Query('sortByColumn') sortByColumn: string,
    @Query('sortDirection') sortDirection: SortDirection,
  ) {
    return await this.userService.findAndPaginatePosts(
      new PaginationOptions(
        pageNumber,
        pageSize,
        sortByColumn as never,
        sortDirection,
      ),
    );
  }

  @ApiOkResponse({ type: PostDTO, description: 'A post.' })
  @ApiParam({ name: 'id' })
  @Get('get-post/:id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    return new PostDTO(await this.postService.getPost(id));
  }

  @ApiCreatedResponse({ description: 'New post created.', type: PostDTO })
  @Post('add-post')
  async addPost(@Req() req, @Body() body: CreatePostDTO) {
    return this.userService.addPost(req.user, body.content);
  }

  @ApiOkResponse({ description: 'Post updated successfully.' })
  @ApiBody({ type: UpdatePostDto })
  @Put('update-post')
  async updatePost(@Body() body) {
    return new PostDTO(
      await this.userService.updatePost(body.postId, body.content),
    );
  }

  // TODO Unified response, fix it. Also, create a resonse dto and decorate this method with @ApiCreatedResponse
  @Post('add-like')
  async addLike(@Body() body: CreateLikeDTO) {
    return this.userService.addLike(body);
  }

  @ApiBody({ type: DeletePostDto })
  @Delete('delete-post')
  async deletePost(@Body() body: DeletePostDto) {
    return this.userService.deletePost(body.postId);
  }

  @Delete('delete-account')
  async deleteAccount(@Body() body: DeleteAccountDto) {
    return this.userService.deleteAccount(body.accountId);
  }
}
