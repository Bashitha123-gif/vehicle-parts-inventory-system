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

import { Roles } from '../auth/decorators/roles.decorator';

import { Query } from '@nestjs/common';

import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  // CREATE

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  // GET ALL

  @Get()
  findAll(@Query('search') search?:string,
    @Query() query?:PaginationDto
  ) {
    return this.service.findAll(query, search);
  }

  // GET ONE

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // UPDATE

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,

    @Body() dto: UpdateCategoryDto,
  ) {
    return this.service.update(id, dto);
  }

  // DELETE

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  
}
