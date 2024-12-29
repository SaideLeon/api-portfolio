// routes/store.js
/**
 * E-commerce (se aplicável)
 */
router.get('/products', storeController.list);             // Listar produtos
router.get('/products/:id', storeController.get);          // Obter produto específico
router.post('/products', auth, storeController.create);    // Criar produto
router.put('/products/:id', auth, storeController.update); // Atualizar produto
router.delete('/products/:id', auth, storeController.delete); // Deletar produto
router.post('/orders', auth, storeController.createOrder); // Criar pedido
router.get('/orders', auth, storeController.listOrders);   // Listar pedidos