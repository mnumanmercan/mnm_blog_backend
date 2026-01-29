import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    // Token'ı header'dan al
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token bulunamadı'
        });
    }

    try {
        // Token'ı doğrula
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user; // Token'daki user bilgisini request'e ekle
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Geçersiz veya süresi dolmuş token'
        });
    }
};

// Sadece admin kontrolü
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Bu işlem için admin yetkisi gerekli'
        });
    }
    next();
};