import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
const secret = process.env.JWT_SECRET;

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers['authorization'];
    const token = header?.split(' ')[1];
    if (!token) {
        res.status(403).json({
            msg: 'Unauthorized',
        });
        return;
    }
    try {
        const decoded = jwt.verify(token, secret!) as { role: string, userId: string };
        req.role = decoded.role;
        req.userId = decoded.userId;
        next(); 
    } catch (e) {
        res.status(401).json({
            msg: 'Unauthorized',
        });
        return;
    }
};