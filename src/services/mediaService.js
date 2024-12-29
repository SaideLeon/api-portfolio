// src/services/mediaService.js
class MediaService {
  async uploadMedia(userId, fileData) {
    return prisma.mediaItem.create({
      data: {
        ...fileData,
        userId
      }
    });
  }

  async listMedia(userId, filters) {
    return prisma.mediaItem.findMany({
      where: {
        userId,
        ...(filters.mimeType && { mimeType: filters.mimeType })
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Helper functions
  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  generateOrderNumber() {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = {
  mediaService: new MediaService()
};