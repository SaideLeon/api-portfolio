// src/services/analyticsService.js
class AnalyticsService {
  async trackPageView(userId, data) {
    return prisma.analytics.create({
      data: {
        ...data,
        userId
      }
    });
  }

  async getVisitorStats(userId, startDate, endDate) {
    const analytics = await prisma.analytics.groupBy({
      by: ['pageView'],
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        id: true
      }
    });

    return analytics;
  }
}
module.exports = new AnalyticsService();