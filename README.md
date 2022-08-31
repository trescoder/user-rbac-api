# RBAC API openapi client generation

## How to decorate controllers

1. Use @ApiTags to group all the controller methods inside the controller, if you don't they'll end up inside a big "DefaultService". If you tag your user controller with @ApiTags('User'), your API client will have a UserService with the same methods as your controller.

2. If any of your controller methods uses authentication, you **must** use the appropiate decorator, in this case it's @ApiBearerAuth() because this API uses JWT.

```typescript
@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@AllowedRoles(Roles.admin, Roles['semi-admin'], Roles.user)
export class UserController {
  /*...*/
}
```

## How to decorate controller methods

1. You don't have to decorate the request body with @ApiBody(), if you decorated it with @Body() **and** you annotated the type:

```typescript
//...
class UserController {
  //...

  @Post('sign-up')
  @Public()
  async signIn(
    @Body() body: CreateAccountDTO /* <- don't forget to annotate the body*/,
  ) {
    return this.userService.createAccount(body);
  }

  //...
}
```

2. If didn't use @Body() to access the request body, use the following example:

```typescript
//...
export class AuthController {
  //...

  @ApiBody({
    type: LoginDto,
    description: 'Login credentials.',
  }) // <- Use @ApiBody to annotate the request body.
  @ApiCreatedResponse({ description: 'login successful.', type: TokenDto })
  @Public()
  @UseGuards(LocalGuard)
  @Post('sing-in')
  async login(@Req() req, @Res() res: Response) {
    // req.user is return from the local strategy, it contains the user's email and password
    const token = await this.authService.login(req.user);
    return res.status(200).json(token);
  }

  //...
}
```

3. You have to annotate the response bodies for every controller, depending on the HTTP verb. For GET, PUT, PATCH AND DELETE requests (I don't usually return anything for PUT, PATCH and DELETE requests so I don't annotate their responses), use @ApiOkResponse, for @POST requests use @ApiCreatedResponse:

```typescript
//...
export class AuthController {
  //...

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

  //...
}
```

4. Every property of every class you use for request body or response has to be annotated with @ApiProperty. I recommend you add descriptions to them because your IDE/TextEditor intellisense will include said description when you hover your mouse over those properties. Do not forget to include the type property to the @ApiProperty decorator when the property you're annotating is another DTO.

```typescript
export class PostDTO {
  @ApiProperty({
    description: 'Post content.',
  })
  content: string;

  @ApiProperty({ description: 'Post ID' })
  id: number;

  @ApiProperty({ description: 'Creation Date' })
  creation_date: Date;

  @ApiProperty({ description: 'Post likes', type: LikeDTO })
  likes: LikeDTO;

  constructor(post: PostEntity) {
    this.id = post.id;
    this.content = post.content;
    this.creation_date = post.creation_date;
    this.likes = new LikeDTO(post.likes);
  }
}
```

## How to generate the API client

1. Start your API (npm run start:dev)
2. Run `npm run api` from the "front" directory
3. After that, inside front/src/app there will be a new "api" directory with your API client. This application already imported the generated ApiModule inside the main module and configured JWT authentication. You can now import your API services inside your components, since AuthController was tagged as 'Auth', you can inject the newly generated AuthService to log in:

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../api/api/auth.service';
import { JwtService } from '../auth/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private jwtService: JwtService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  login() {
    this.authService.login(this.form.value).subscribe({
      next: (result) => {
        this.jwtService.saveToken(result.access_token);
        this.router.navigateByUrl('/');
      },
    });
  }
}
```
