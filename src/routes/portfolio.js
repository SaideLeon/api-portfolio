// routes/portfolio.js
/**
 * Gestão do Portfólio
 */
router.get('/portfolio', portfolioController.getPublic);     // Visualização pública
router.get('/portfolio/admin', auth, portfolioController.getAdmin); // Visualização admin
router.put('/portfolio/info', auth, portfolioController.updateInfo); // Atualizar informações
router.put('/portfolio/design', auth, portfolioController.updateDesign); // Atualizar design
router.put('/portfolio/seo', auth, portfolioController.updateSEO); // Atualizar SEO

