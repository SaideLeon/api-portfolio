// routes/auth.js
/**
 * Autenticação e Gestão de Usuários
 */
router.post('/auth/register', authController.register);      // Registro de novo usuário
router.post('/auth/login', authController.login);           // Login
router.post('/auth/forgot-password', authController.forgot); // Recuperação de senha
router.put('/auth/reset-password', authController.reset);   // Reset de senha
router.get('/auth/me', auth, authController.getProfile);    // Dados do usuário logado
router.put('/auth/me', auth, authController.updateProfile); 