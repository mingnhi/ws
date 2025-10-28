import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-categoty.dto';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}
  @Query(() => [Category])
  getCategories() {
    return this.categoryService.findAll();
  }

  @Query(() => Category)
  getCategory(@Args('id', { type: () => Int }) id: number) {
    return this.categoryService.findOne(id);
  }

  @Mutation(() => Category)
  createCategory(@Args('input') input: CreateCategoryDto) {
    return this.categoryService.create(input);
  }

  @Mutation(() => Category)
  updateCategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Args('id', { type: () => Int }) id: number) {
    await this.categoryService.delete(id);
    return true;
  }
}
