// src/services/blogService.js
class BlogService {
  async listPosts(filters, pagination) {
    const where = {
      status: filters.status || 'PUBLISHED',
      ...(filters.categoryId && { categoryId: filters.categoryId })
    };

    const [total, posts] = await prisma.$transaction([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        include: {
          category: true,
          tags: true,
          media: true
        },
        orderBy: { publishedAt: 'desc' },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit
      })
    ]);

    return {
      data: posts,
      pagination: {
        total,
        pages: Math.ceil(total / pagination.limit),
        current: pagination.page,
        hasNext: total > pagination.page * pagination.limit
      }
    };
  }
}
module.exports = {
  blogService: new BlogService()
};