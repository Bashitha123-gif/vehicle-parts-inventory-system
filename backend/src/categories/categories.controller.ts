import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';

import { CreateCategoryDto } from './dto/create-category.dto';

import { UpdateCategoryDto } from './dto/update-category.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  // CREATE

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  // GET ALL

  @Get()
  findAll() {
    return this.service.findAll();
  }

  // GET ONE

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // UPDATE

  @Patch(':id')
  update(
    @Param('id') id: string,

    @Body() dto: UpdateCategoryDto,
  ) {
    return this.service.update(id, dto);
  }

  // DELETE

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
