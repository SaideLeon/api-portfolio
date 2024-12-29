// routes/blog.js
/**
 * Gestão do Blog (se aplicável)
 */
router.get('/posts', blogController.list);                  // Listar posts
router.get('/posts/:id', blogController.get);              // Obter post específico
router.post('/posts', auth, blogController.create);        // Criar post
router.put('/posts/:id', auth, blogController.update);     // Atualizar post
router.delete('/posts/:id', auth, blogController.delete);  // Deletar post

