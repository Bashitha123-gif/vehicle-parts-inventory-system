import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandQueryDto } from './dto/brand-query.dto';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBrandDto) {
    const existing = await this.prisma.brand.findFirst({
      where: {
        name: {
          equals: dto.name,
          mode: 'insensitive',
        },
      },
    });

    if (existing) {
      throw new ConflictException('Brand already exists');
    }

    return this.prisma.brand.create({
      data: {
        name: dto.name,
      },
    });
  }

  async findAll(query: BrandQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;

    const where = query.search
      ? {
          name: {
            contains: query.search,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const [brands, total] = await Promise.all([
      this.prisma.brand.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.brand.count({
        where,
      }),
    ]);

    return {
      data: brands,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    return brand;
  }

  async update(id: string, dto: UpdateBrandDto) {
    await this.findOne(id);

    if (dto.name) {
      const existing = await this.prisma.brand.findFirst({
        where: {
          name: {
            equals: dto.name,
            mode: 'insensitive',
          },
          NOT: {
            id,
          },
        },
      });

      if (existing) {
        throw new ConflictException('Brand already exists');
      }
    }

    return this.prisma.brand.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.brand.delete({
      where: { id },
    });
  }
}