import { Router } from 'express';
import { adminMiddleware } from '../../middleware/admin';
import { AddElementSchema, CreateAvatarSchema, CreateElementSchema, UpdateElementSchema } from '../../types';
import client from '@repo/db/client';
export const adminRouter = Router();

adminRouter.use(adminMiddleware);

adminRouter.post('/element', async (req, res) => {
    const parsedData = CreateElementSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json(parsedData.error);
        return
    }
    const element = await client.element.create({
        data: {
            width: parsedData.data.width,
            height: parsedData.data.height,
            static: parsedData.data.static,
            imageUrl: parsedData.data.imageUrl,
        }
    })
    res.status(200).json({msg:"element created",
        id: element.id,
    })

})

adminRouter.put('/element/:elementId', async(req, res) => {
    const parsedData = UpdateElementSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json("validation failed");
        return
    }
    await client.element.update({
        where: {
            id: req.params.elementId
        },
        data: {
            imageUrl: parsedData.data.imageUrl,
        }
    })
    res.json({msg:"element updated"})
})

adminRouter.post('/avatar',async (req, res) => {
    const parsedData = CreateAvatarSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json("Validation failed");
        return
    }
    const avatar = await client.avatar.create({
        data: {
            name: parsedData.data.name,
            imageUrl: parsedData.data.imageUrl,
        }
    })
    res.json({id: avatar.id, msg: "avatar created"})
})

adminRouter.post('/map', (req, res) => {

})