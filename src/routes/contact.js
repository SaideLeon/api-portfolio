// routes/contact.js
/**
 * Formulário de Contato e Mensagens
 */
router.post('/contact', contactController.send);           // Enviar mensagem
router.get('/messages', auth, contactController.list);     // Listar mensagens recebidas
router.put('/messages/:id/read', auth, contactController.markAsRead); // Marcar como lida
