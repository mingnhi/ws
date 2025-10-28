import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { HomeService } from './home.service';
import { UserService } from '../user/user.service';
import { Request, Response } from 'express';
import { User } from '../user/user.entity'; // Thêm dòng này để import User entity

@Controller('home')
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
    private readonly userService: UserService,
  ) {
    console.log('HomeController initialized');
  }

  @Get()
  @Render('home')
  async getHomePage(@Req() req: Request, @Res() res: Response) {
    console.log('Truy cập tuyến đường /home');
    const data = await this.homeService.getHomePageData();

    const userId =
      req.cookies && req.cookies['userId'] ? req.cookies['userId'] : null;
    let user: User | null = null; // Bây giờ User đã được nhận diện
    if (userId && !isNaN(parseInt(userId))) {
      user = await this.userService.findById(parseInt(userId));
      if (!user) {
        res.clearCookie('userId');
      }
    }

    return { ...data, title: 'Trang chủ', user };
  }
}
