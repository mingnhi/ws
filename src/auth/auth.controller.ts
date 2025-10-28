import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Render,
  Res,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from './local.auth.guard';
import { JwtAuthGuard } from './jwt.auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('login')
  @Render('login')
  showLoginPage() {
    return {};
  }

  @Get('register')
  @Render('register')
  showRegisterPage() {
    return {};
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @Render('profile')
  async profile(@Request() req: any) {
    const user = await this.userService.findById(req.user.id);
    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateprofile')
  async updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto, // Dữ liệu sửa hồ sơ
    @Res() res: Response,
  ) {
    try {
      // Cập nhật thông tin hồ sơ người dùng
      const updatedUser = await this.userService.updateProfile(
        req.user.id,
        updateProfileDto,
      );
      res.cookie('message', 'Cập nhật thông tin thành công!', {
        httpOnly: false,
        maxAge: 5000,
      });
      return res.redirect('/auth/profile');
    } catch (error) {
      res.cookie('error', 'Có lỗi khi cập nhật hồ sơ. Vui lòng thử lại.', {
        httpOnly: false,
        maxAge: 5000,
      });
      return res.redirect('/auth/profile');
    }
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      await this.authService.register(registerDto);
      res.cookie('message', 'Đăng ký thành công! Vui lòng đăng nhập.', {
        httpOnly: false,
        maxAge: 5000,
      });
      return res.redirect('/auth/login');
    } catch (error) {
      res.cookie('error', error.message, { httpOnly: false, maxAge: 5000 });
      return res.redirect('/auth/register');
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const { user, accessToken, refresh_token } =
        await this.authService.login(loginDto);

      // Lưu userId vào cookie
      res.cookie('userId', user.id, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Lưu token vào cookie
      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.cookie('refreshToken', refresh_token, { httpOnly: true });

      // Chuyển hướng dựa trên role
      if (user.role === 'admin') {
        return res.redirect('/admin');
      } else {
        return res.redirect('/home');
      }
    } catch (error) {
      res.cookie(
        'error',
        'Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu.',
        {
          httpOnly: false,
          maxAge: 5000,
        },
      );
      return res.redirect('/auth/login');
    }
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('userId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.redirect('/home');
  }

  @Post('refresh')
  async refreshToken(@Request() req, @Res() res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new UnauthorizedException('No refresh token provided');
      }
      const user = await this.authService.verifyRefreshToken(refreshToken);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const payload = { email: user.email, sub: user.id };
      const newAccessToken = this.jwtService.sign(payload);
      res.cookie('accessToken', newAccessToken, { httpOnly: true });
      return res.redirect(req.headers.referer || '/home');
    } catch (error) {
      res.cookie('error', 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', {
        httpOnly: false,
        maxAge: 5000,
      });
      return res.redirect('/auth/login');
    }
  }
}
