import { Router } from 'express';
import { UpdateMetadataSchema } from '../../types';
export const userRouter = Router();
import client from '@repo/db/client'; 
import { userMiddleware } from '../../middleware/user';

userRouter.post('/metadata',userMiddleware, async (req,res)=>{
    const parsedData = UpdateMetadataSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            msg: 'Validation failed',
        });
        return;
    }
    await client.user.update({
        where:{
            id: req.userId
        },
        data:{
            avatarId: parsedData.data.avatarId
        }
    })
    res.json({msg:"metadata Updated"})
})

userRouter.get('/metadata/bulk',(req,res)=>{
 const parsedDate = 
})