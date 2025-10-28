import { Test, TestingModule } from '@nestjs/testing';
import { OderService } from './order.service';

describe('OderService', () => {
  let service: OderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OderService],
    }).compile();

    service = module.get<OderService>(OderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
