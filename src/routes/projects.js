// routes/projects.js
/**
 * Gestão de Projetos/Trabalhos
 */
router.get('/projects', projectController.list);            // Listar projetos
router.get('/projects/:id', projectController.get);         // Obter projeto específico
router.post('/projects', auth, projectController.create);   // Criar projeto
router.put('/projects/:id', auth, projectController.update);// Atualizar projeto
router.delete('/projects/:id', auth, projectController.delete); // Deletar projeto
router.post('/projects/:id/images', auth, projectController.uploadImages); // Upload de imagens
