// src/services/storeService.js
class StoreService {
  async listProducts(filters, pagination) {
    const where = {
      status: filters.status || 'ACTIVE',
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.minPrice && { price: { gte: filters.minPrice } }),
      ...(filters.maxPrice && { price: { lte: filters.maxPrice } })
    };

    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: true,
          tags: true,
          media: true,
          variants: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit
      })
    ]);

    return {
      data: products,
      pagination: {
        total,
        pages: Math.ceil(total / pagination.limit),
        current: pagination.page,
        hasNext: total > pagination.page * pagination.limit
      }
    };
  }

  async createOrder(userId, orderData) {
    const orderNumber = this.generateOrderNumber();
    
    return prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerEmail: orderData.customerEmail,
          customerName: orderData.customerName,
          shippingAddress: orderData.shippingAddress,
          billingAddress: orderData.billingAddress,
          subtotal: orderData.subtotal,
          shipping: orderData.shipping,
          tax: orderData.tax,
          total: orderData.total,
          items: {
            create: orderData.items.map(item => ({
              name: item.name,
              sku: item.sku,
              quantity: item.quantity,
              price: item.price,
              productId: item.productId
            }))
          },
          statusHistory: {
            create: {
              status: 'PENDING',
              note: 'Order created'
            }
          }
        },
        include: {
          items: true,
          statusHistory: true
        }
      });

      // Update product inventory
      for (const item of orderData.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            inventory: {
              decrement: item.quantity
            }
          }
        });
      }

      return order;
    });
  }
}
module.exports = {
  storeService: new StoreService()
};