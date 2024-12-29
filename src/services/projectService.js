// src/services/projectService.js
class ProjectService {
  async listProjects(filters, pagination) {
    const where = {
      status: filters.status || 'PUBLISHED',
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.featured !== undefined && { featured: filters.featured })
    };

    const [total, projects] = await prisma.$transaction([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        include: {
          category: true,
          tags: true,
          media: true
        },
        orderBy: [
          { featured: 'desc' },
          { order: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit
      })
    ]);

    return {
      data: projects,
      pagination: {
        total,
        pages: Math.ceil(total / pagination.limit),
        current: pagination.page,
        hasNext: total > pagination.page * pagination.limit
      }
    };
  }

  async createProject(userId, data) {
    const slug = this.generateSlug(data.title);
    
    return prisma.project.create({
      data: {
        ...data,
        slug,
        userId,
        tags: {
          connect: data.tagIds?.map(id => ({ id })) || []
        }
      },
      include: {
        category: true,
        tags: true,
        media: true
      }
    });
  }
}
module.exports = {
  projectService: new ProjectService()
};