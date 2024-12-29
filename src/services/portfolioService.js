// src/services/portfolioService.js
class PortfolioService {
  async getPublicPortfolio(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        profession: true,
        bio: true,
        socialLinks: true,
        projects: {
          where: { 
            status: 'PUBLISHED',
            featured: true
          },
          include: {
            category: true,
            tags: true,
            media: true
          }
        }
      }
    });
  }

  async updatePortfolioInfo(userId, data) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        profession: data.profession,
        bio: data.bio,
        socialLinks: data.socialLinks
      }
    });
  }
}

module.exports = {
  portfolioService: new PortfolioService()
};