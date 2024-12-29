// routes/analytics.js
/**
 * Analytics e Métricas
 */
router.get('/analytics/visitors', auth, analyticsController.getVisitors); // Visitantes
router.get('/analytics/pageviews', auth, analyticsController.getPageviews); // Visualizações
router.get('/analytics/sources', auth, analyticsController.getSources);   // Fontes de tráfego
router.get('/analytics/popular', auth, analyticsController.getPopular);   // Conteúdo popular
