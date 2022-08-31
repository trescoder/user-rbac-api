import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export class Page<T> {
  items: T[];

  count: number;
}

export enum SortDirection {
  asc = 'ASC',
  desc = 'DESC',
}

export class PaginationOptions<Entity> {
  @ApiProperty({
    description: `Current page number, 0 indexed.`,
  })
  pageNumber: number;

  @ApiProperty({
    description: `Items per page.`,
  })
  pageSize: number;

  @ApiProperty({
    description: `Sort results by this column.`,
  })
  sortByColumn?: keyof Entity;

  @ApiProperty({
    description: `Sort direction ASC or DESC.`,
    type: SortDirection,
  })
  sortDirection = SortDirection.desc;

  constructor(
    pageNumber: number,
    pageSize: number,
    sortByColumn?: keyof Entity,
    sortDirection = SortDirection.desc,
  ) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.sortByColumn = sortByColumn;
    this.sortDirection = sortDirection;
  }
}

export function WithPagination() {
  return applyDecorators(
    ApiQuery({
      name: 'pageNumber',
      description: 'Current page number, 0 indexed.',
      type: 'number',
    }),
    ApiQuery({
      name: 'pageSize',
      description: 'Items per page.',
      type: 'number',
    }),
    ApiQuery({
      name: 'sortByColumn',
      description: 'Sort results by this column.',
      required: false,
    }),
    ApiQuery({
      name: 'sortDirection',
      description: 'Sort direction ASC or DESC.',
      required: false,
    }),
  );
}
