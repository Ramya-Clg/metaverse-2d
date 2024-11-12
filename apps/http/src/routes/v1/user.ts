import { Router } from 'express';
import { UpdateMetadataSchema } from '../../types';
export const userRouter = Router();
import client from '@repo/db/client';
import { userMiddleware } from '../../middleware/user';

userRouter.post('/metadata', userMiddleware, async (req, res) => {
    const parsedData = UpdateMetadataSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            msg: 'Validation failed',
        });
        return;
    }
    await client.user.update({
        where: {
            id: req.userId
        },
        data: {
            avatarId: parsedData.data.avatarId
        }
    })
    res.json({ msg: "metadata Updated" })
})

userRouter.get('/metadata/bulk', async (req, res) => {
    const userIdString = (req.query.ids || "[]") as string;
    const userIds = (userIdString).slice(0, userIdString?.length).split(',');
    console.log(userIds);
    const metadata = await client.user.findMany({
        where: {
            id: {
                in: userIds
            }
        }, select: {
            avatar: true,
            id: true
        }
    })
    res.json({
        avatars: metadata.map(user => {
            return {
                userId: user.id,
                avatar: user.avatar?.imageUrl
            }
        })
    })
})