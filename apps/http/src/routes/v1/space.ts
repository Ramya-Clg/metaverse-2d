import { Router } from 'express';
import { CreateSpaceSchema } from '../../types';
import client from '@repo/db/client';
import { userMiddleware } from '../../middleware/user';
export const spaceRouter = Router();

spaceRouter.post("/", userMiddleware, async (req, res) => {
    console.log("endopibnt")
    const parsedData = CreateSpaceSchema.safeParse(req.body)
    if (!parsedData.success) {
        console.log(JSON.stringify(parsedData))
        res.status(400).json({ message: "Validation failed" })
        return
    }

    if (!parsedData.data.mapId) {
        const space = await client.space.create({
            data: {
                name: parsedData.data.name,
                width: parseInt(parsedData.data.dimensions.split("x")[0]),
                height: parseInt(parsedData.data.dimensions.split("x")[1]),
                creatorId: req.userId!
            }
        });
        res.json({ spaceId: space.id })
        return;
    }

    const map = await client.map.findUnique({
        where: {
            id: parsedData.data.mapId
        }, select: {
            mapElements: true,
            width: true,
            height: true
        }
    })
    if (!map) {
        res.status(400).json({ message: "Map not found" })
        return;
    }
    let space = await client.$transaction(async () => {
        const space = await client.space.create({
            data: {
                name: parsedData.data.name,
                width: map.width,
                height: map.height,
                creatorId: req.userId!,
            }
        });
        await client.spaceElements.createMany({
            data: map.mapElements.map(element => ({
                elementId: element.elementId,
                spaceId: space.id,
                x: map.width,
                y: map.height
            }))
        })
        return space;
    })
    res.json({ spaceId: space.id })
    return; 
})


spaceRouter.delete('/:spaceId', (req, res) => {

})

spaceRouter.post('/element', (req, res) => {

})

spaceRouter.delete('/element', (req, res) => {

})

spaceRouter.get('/all', (req, res) => {

})

spaceRouter.get('/:spaceId', (req, res) => {

})


