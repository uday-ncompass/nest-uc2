import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Session, Response, NotFoundException, UseInterceptors, ClassSerializerInterceptor, forwardRef, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';


@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
    ) {}

 
  @Post('/signup')
  async create(@Request() req, @Body() createUserDto: CreateUserDto, @Response() res) {
    const data= await this.userService.create(createUserDto);
    if(data) {
      return this.SuccessResponse(res, 'User Created', data);
    } else {
      throw new NotFoundException(`User can't be created`);
    }
  }
  
  @Get('/getall')
  async findAll(@Response() res,@Session() session: Record<string, any>) {
    const data=await this.userService.findAll();
    if(data.length>0) {
      return this.SuccessResponse(res, 'Users Found', data);
    } else {
      throw new NotFoundException('No Users Found');
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/getone')
  async findOne(@Param('id') id: string, @Response() res) {
    const data= await this.userService.findOne(+id);
    if(data) {
      return this.SuccessResponse(res, 'User Found', data);
    } else {
      throw new NotFoundException('User Not Found');
    }
  }

  @Patch('/update')
  @UseGuards(AuthenticatedGuard)
  update( @Body() updateUserDto: UpdateUserDto, @Session() session: Record<string, any>) {
    const isAdmin = session.passport.user.isAdmin;
    const id = session.passport.user.id
    return this.userService.update(+id, isAdmin,updateUserDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/delete/')
  async remove( @Response() res,@Session() session: Record<string, any>) {
    const id = session.passport.user.id
    const user = await this.userService.findOne(+id);
    const data=await this.userService.remove(+id);
    if(data.affected) {
      session.destroy()
      return this.SuccessResponse(res, 'User Deleted', user);
    } else {
      throw new NotFoundException('No User Found');
    }
  }


  @Post('/login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req){
    return this.authService.login(req.user)
  }

  SuccessResponse(res,message,data) {
    res.status(200).json({
      success:true,
      message: message,
      data: data
    }) 
  }
}
