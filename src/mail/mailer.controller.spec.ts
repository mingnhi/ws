import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from './mailer.service';

describe('MailerController', () => {
  let controller: MailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [MailService],
    }).compile();

    controller = module.get<MailController>(MailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
