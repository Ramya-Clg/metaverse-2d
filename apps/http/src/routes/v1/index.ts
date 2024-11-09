import { Router } from 'express';
import { userRouter } from './user';
import { spaceRouter } from './space';
import { adminRouter } from './admin';
import { SignupSchema } from '../../types';
import jwt from 'jsonwebtoken';
import client from '@repo/db/client';
import { hash, compare } from '../../scrypt';
const secret = process.env.JWT_SECRET;
export const router = Router();

router.post('/signup', async (req, res) => {
    const parsedDate = SignupSchema.safeParse(req.body);
    if (!parsedDate.success) {
        res.status(400).json({
            msg: 'Validation failed',
        });
        return;
    }
    try {
        const hashedPassword = await hash(parsedDate.data.password, 10);
        const user = await client.user.create({
            data: {
                username: parsedDate.data.userName,
                password: hashedPassword,
                role: parsedDate.data.type == 'admin' ? 'Admin' : 'User',
            }
        });
        res.json({
            userId: user.id,
        });
        return;
    } catch (e) {
        res.status(400).json({});
        return;
    }
});

router.post('/signin', async (req, res) => {
    const parsedDate = SignupSchema.safeParse(req.body);
    if (!parsedDate.success) {
        res.status(403).json({
            msg: 'Validation failed',
        });
        return;
    }
    try {
        const user = await client.user.findUnique({
            where: {
                username: parsedDate.data.userName,
            }
        });
        if (!user) {
            res.status(400).json({
                msg: 'User not found',
            });
            return;
        }
        if (!compare(parsedDate.data.password, user.password)) {
            res.status(400).json({
                msg: 'Password incorrect',
            });
            return;
        }
        const token = jwt.sign({
            userId: user.id,
            role: user.role
        }, secret!);

        res.json({
            token
        });
        return;
    } catch (e) {
        res.status(400).json({});
        return;
    }
});

router.get('/elements', (req, res) => {

});

router.get('/avatars', (req, res) => {

});

router.use('/user', userRouter);
router.use('/space', spaceRouter);
router.use('admin', adminRouter);