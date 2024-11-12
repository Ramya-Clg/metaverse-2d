import { Router } from 'express';
import { CreateSpaceSchema } from '../../types';
import client from '@repo/db/client';
import { userMiddleware } from '../../middleware/user';
export const spaceRouter = Router();

spaceRouter.post('/',userMiddleware, async(req,res)=>{
    const parsedData = CreateSpaceSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            msg: 'Validation failed',
        });
        return;
    }
    if(!parsedData.data.mapId){
        await client.space.create({
            data: {
                name: parsedData.data.name,
                width: parsedData.data.dimensions.split("x")[0],
                height: parsedData.data.dimensions.split("x")[1],
                creatorId: req.userId!,
            }
            }
        })
        res.json({
            msg: "Space created"
        })
        return;
    }
})

spaceRouter.delete('/:spaceId',(req,res)=>{

})

spaceRouter.post('/element',(req,res)=>{

})

spaceRouter.delete('/element',(req,res)=>{

})

spaceRouter.get('/all',(req,res)=>{

})

spaceRouter.get('/:spaceId',(req,res)=>{
    
})


