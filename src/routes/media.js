// routes/media.js
/**
 * Gestão de Mídia
 */
router.post('/media/upload', auth, mediaController.upload);    // Upload de arquivo
router.get('/media/list', auth, mediaController.list);        // Listar arquivos
router.delete('/media/:id', auth, mediaController.delete);    // Deletar arquivo
router.post('/media/optimize', auth, mediaController.optimize);