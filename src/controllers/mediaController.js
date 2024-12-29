const { z } = require('zod');
const { mediaService } = require('../services/mediaService');

const mediaController = {
  /**
   * Faz o upload de um arquivo de mídia
   */
  async upload(req, res) {
    try {
      // Verificar se um arquivo foi enviado
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      // Validação dos dados enviados na requisição
      const schema = z.object({
        projectId: z.string().uuid().optional(),
        postId: z.string().uuid().optional(),
        productId: z.string().uuid().optional(),
      });

      const options = schema.parse(req.body);

      // Dados do arquivo
      const fileData = {
        buffer: req.file.buffer,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };

      // Upload da mídia
      const media = await mediaService.uploadMedia(req.user.id, fileData, options);

      // Retorno de sucesso
      res.status(201).json(media);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Lista os arquivos de mídia do usuário
   */
  async list(req, res) {
    try {
      // Filtros opcionais para listar mídia
      const schema = z.object({
        mimeType: z.string().optional(),
        projectId: z.string().uuid().optional(),
        postId: z.string().uuid().optional(),
        productId: z.string().uuid().optional(),
        includeProjects: z.boolean().optional(),
        includePosts: z.boolean().optional(),
        includeProducts: z.boolean().optional(),
      });

      const filters = schema.parse(req.query);

      // Recuperar a lista de mídia
      const media = await mediaService.listMedia(req.user.id, filters);

      res.json(media);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Exclui um arquivo de mídia
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Deletar mídia
      await mediaService.deleteMedia(id, req.user.id);

      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Otimiza uma imagem
   */
  async optimize(req, res) {
    try {
      const { id } = req.params;

      // Validação dos parâmetros de otimização
      const schema = z.object({
        width: z.number().positive().optional(),
        height: z.number().positive().optional(),
        quality: z.number().min(1).max(100).optional(),
        format: z.enum(['jpeg', 'png', 'webp']).optional(),
      });

      const options = schema.parse(req.body);

      // Otimizar a mídia
      const optimizedMedia = await mediaService.optimizeMedia(id, req.user.id, options);

      res.json(optimizedMedia);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = mediaController;
