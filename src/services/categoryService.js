// src/services/categoryService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CategoryService {
  async createCategory(userId, data) {
    const { name, description, type, parentId, keywords } = data;
    const slug = this.generateSlug(name);

    return prisma.$transaction(async (tx) => {
      // Criar categoria
      const category = await tx.category.create({
        data: {
          name,
          slug,
          description,
          type,
          parentId,
          userId,
        },
      });

      // Adicionar palavras-chave se fornecidas
      if (keywords && keywords.length > 0) {
        await tx.categoryKeyword.createMany({
          data: keywords.map(k => ({
            categoryId: category.id,
            word: k.word.toLowerCase(),
            weight: k.weight || 1.0
          }))
        });
      }

      return category;
    });
  }

  async suggestCategories(content, type, userId, limit = 5) {
    // Tokenização básica do conteúdo
    const words = content.toLowerCase()
      .split(/\W+/)
      .filter(w => w.length > 3);

    // Buscar todas as palavras-chave para o tipo de categoria
    const categoryKeywords = await prisma.categoryKeyword.findMany({
      where: {
        category: {
          userId,
          type,
        }
      },
      include: {
        category: true
      }
    });

    // Calcular pontuação para cada categoria
    const scores = new Map();
    
    categoryKeywords.forEach(keyword => {
      const matchCount = words.filter(w => w === keyword.word).length;
      if (matchCount > 0) {
        const score = matchCount * keyword.weight;
        const currentScore = scores.get(keyword.category.id) || 0;
        scores.set(keyword.category.id, currentScore + score);
      }
    });

    // Ordenar categorias por pontuação
    const rankedCategories = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([categoryId]) => 
        categoryKeywords.find(k => k.category.id === categoryId).category
      );

    return rankedCategories;
  }

  async incrementCategoryUse(categoryId) {
    return prisma.category.update({
      where: { id: categoryId },
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
}

module.exports = new CategoryService();