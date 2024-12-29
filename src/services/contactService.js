// src/services/contactService.js
class ContactService {
  async createMessage(userId, data) {
    return prisma.message.create({
      data: {
        ...data,
        userId
      }
    });
  }

  async listMessages(userId, filters) {
    return prisma.message.findMany({
      where: {
        userId,
        ...(filters.status && { status: filters.status })
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
module.exports = {
  contactService: new ContactService()
};