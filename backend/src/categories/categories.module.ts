import { Module } from '@nestjs/common';

import { CategoryService } from './categories.service';

import { CategoryController } from './categories.controller';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],

  controllers: [CategoryController],

  providers: [CategoryService],
})
export class CategoriesModule {}
