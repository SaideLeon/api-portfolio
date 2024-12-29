// src/services/authService.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

class AuthService {
  async register(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        profession: true,
        bio: true,
        avatar: true,
        socialLinks: true,
        role: true,
        createdAt: true
      }
    });

    const token = this.generateToken(user.id);
    return { user, token };
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Invalid password');

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    const token = this.generateToken(user.id);
    return { token, user: { ...user, password: undefined } };
  }

  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
  }
}














module.exports = {
  authService: new AuthService()
};