import { createUser, getUserByEmail } from '../db/queries.js';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email ve password alanları zorunludur'
            });
        }

        if (!isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz email formatı'
            });
        }

        const userExists = await getUserByEmail(email);

        if (userExists.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Bu email adresi zaten kullanılıyor'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await createUser(name, email, hashedPassword);

        return res.status(201).json({
            success: true,
            message: 'Kullanıcı başarıyla oluşturuldu',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validasyon
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email ve password alanları zorunludur'
            });
        }

        // Kullanıcıyı bul
        const result = await getUserByEmail(email);

        if (!result.rows.length) {
            return res.status(401).json({
                success: false,
                message: 'Email veya şifre hatalı'
            });
        }

        const user = result.rows[0];

        // Şifre kontrolü
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email veya şifre hatalı'
            });
        }

        // JWT Token oluştur
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Başarılı login
        return res.status(200).json({
            success: true,
            message: 'Giriş başarılı',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token: token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
};