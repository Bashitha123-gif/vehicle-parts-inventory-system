import { Module } from '@nestjs/common';

import { BrandController } from './brands.controller';
import { BrandService } from './brands.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],
})
export class BrandsModule {}