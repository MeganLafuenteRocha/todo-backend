import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from 'src/contexts/tasks/category/application/category.service';
import { CreateCategoryDto } from 'src/contexts/tasks/category/application/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/contexts/tasks/category/application/dto/update-category.dto';
import { JwtAuthGuard } from 'src/contexts/identity-access/auth/infrastructure/jwt-auth.guard';
import { CurrentUser } from 'src/contexts/identity-access/auth/infrastructure/current-user.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Categories')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Listar categorías del usuario' })
  findAll(@CurrentUser() user: { id: string }) {
    return this.categoryService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  findOne(@Param('id') id: string) {
    return this.categoryService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una categoría' })
  @ApiCreatedResponse({ description: 'Categoría creada' })
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateCategoryDto) {
    return this.categoryService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Categoría actualizada' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Categoría eliminada' })
  delete(@Param('id') id: string) {
    return this.categoryService.deleteItem(id);
  }
}
