// .src/services/tagService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TagService {
  async createTag(userId, name, type) {
    const slug = this.generateSlug(name);
    
    return prisma.tag.create({
      data: {
        name,
        slug,
        type,
        userId
      }
    });
  }

  async getRecommendedTags(content, type, userId, limit = 5) {
    // Encontrar tags existentes que correspondam ao conteúdo
    const words = content.toLowerCase().split(/\W+/);
    
    const existingTags = await prisma.tag.findMany({
      where: {
        OR: [
          { type },
          { type: 'GENERAL' }
        ],
        userId,
        name: {
          in: words
        }
      },
      orderBy: {
        useCount: 'desc'
      },
      take: limit
    });

    // Analisar frequência de palavras para sugerir novas tags
    const wordFrequency = this.analyzeWordFrequency(words);
    const suggestedTags = this.getSuggestedTags(wordFrequency, existingTags, limit);

    return {
      existing: existingTags,
      suggested: suggestedTags
    };
  }

  async incrementTagUse(tagId) {
    return prisma.tag.update({
      where: { id: tagId },
      data: {
        useCount: {
          increment: 1
        }
      }
    });
  }

  // Funções auxiliares
  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
  }

  analyzeWordFrequency(words) {
    const frequency = new Map();
    
    words.forEach(word => {
      if (word.length > 3) { // Ignorar palavras muito curtas
        frequency.set(word, (frequency.get(word) || 0) + 1);
      }
    });

    return frequency;
  }

  getSuggestedTags(frequency, existingTags, limit) {
    const existingNames = new Set(existingTags.map(tag => tag.name.toLowerCase()));
    
    return Array.from(frequency.entries())
      .filter(([word]) => !existingNames.has(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word]) => word);
  }
}

module.exports = new TagService();
