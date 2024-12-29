const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class MediaService {
  constructor() {
    this.cloudinary = cloudinary;
  }

  /**
   * Upload de Mídia para Cloudinary e Banco de Dados
   * @param {string} userId
   * @param {object} fileData
   * @param {object} options
   */
  async uploadMedia(userId, fileData, options = {}) {
    try {
      // Validações de entrada
      this.validateFileData(fileData);

      // Identificar tipo de mídia e gerar slug
      const resourceType = this.getResourceType(fileData.mimetype);
      const slug = this.generateSlug(fileData.originalname);

      // Upload para Cloudinary
      const uploadResult = await this.uploadToCloudinary(fileData.buffer, {
        folder: `users/${userId}`,
        resource_type: resourceType,
        public_id: slug,
      });

      // Gerar metadados
      const metadata = await this.generateMetadata(uploadResult, resourceType);

      // Registrar no banco de dados
      const mediaItem = await this.createMediaRecord(userId, fileData, uploadResult, metadata, options);

      return mediaItem;
    } catch (error) {
      throw new Error(`Falha no upload: ${error.message}`);
    }
  }

  /**
   * Valida os dados do arquivo
   */
  validateFileData(fileData) {
    if (!fileData || !fileData.mimetype || !fileData.buffer) {
      throw new Error('Dados do arquivo inválidos');
    }
  }

  /**
   * Identifica o tipo de recurso baseado no mimetype
   */
  getResourceType(mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'raw';
  }

  /**
   * Faz o upload do buffer para o Cloudinary
   */
  async uploadToCloudinary(buffer, options) {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  }

  /**
   * Gera metadados para o arquivo
   */
  async generateMetadata(uploadResult, resourceType) {
    const baseMetadata = {
      assetId: uploadResult.asset_id,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
    };

    if (resourceType === 'image') {
      return {
        ...baseMetadata,
        width: uploadResult.width,
        height: uploadResult.height,
        aspectRatio: uploadResult.width / uploadResult.height,
      };
    }

    if (resourceType === 'video') {
      return {
        ...baseMetadata,
        duration: uploadResult.duration,
        width: uploadResult.width,
        height: uploadResult.height,
      };
    }

    return baseMetadata;
  }

  /**
   * Cria um registro no banco de dados
   */
  async createMediaRecord(userId, fileData, uploadResult, metadata, options) {
    return prisma.mediaItem.create({
      data: {
        filename: uploadResult.public_id,
        originalName: fileData.originalname,
        mimeType: fileData.mimetype,
        size: fileData.size,
        url: uploadResult.secure_url,
        metadata,
        userId,
        ...(options.projectId && {
          projects: {
            connect: { id: options.projectId },
          },
        }),
        ...(options.postId && {
          posts: {
            connect: { id: options.postId },
          },
        }),
        ...(options.productId && {
          products: {
            connect: { id: options.productId },
          },
        }),
      },
      include: {
        projects: true,
        posts: true,
        products: true,
      },
    });
  }

  /**
   * Gera um slug baseado no nome do arquivo
   */
  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}

module.exports = new MediaService();
