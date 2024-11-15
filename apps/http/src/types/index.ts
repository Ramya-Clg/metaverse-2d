import { z } from 'zod';

export const SignupSchema = z.object({
    userName: z.string().email(),
    password: z.string().min(8),
    type: z.enum(['admin', 'user']),
});

export const SigninSchema = z.object({
    userName: z.string().email(),
    password: z.string().min(8),
});

export const UpdateMetadataSchema = z.object({
    avatarId: z.string()
});

export const CreateSpaceSchema = z.object({
    name: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId: z.string(),
});

export const AddElementSchema = z.object({
    elementId: z.string(),
    spaceId: z.string(),
    x: z.number(),
    y: z.number(),
});

export const CreateElementSchema = z.object({
    imageUrl: z.string(),
    static: z.boolean(),
    width: z.number(),
    height: z.number(),
});

export const UpdateElementSchema = z.object({
    imageUrl: z.string(),
});

export const CreateAvatarSchema = z.object({
    name: z.string(),
    imageUrl: z.string(),
});

export const CreateMapSchema = z.object({
    thumbnail: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    defaultElements: z.array(z.object({
        elementId: z.string(),
        x: z.number(),
        y: z.number(),
    }))
})

export const DeleteElementSchema = z.object({
    id: z.string()
})

declare global {
    namespace Express {
        export interface Request {
            role?: string;
            userId?: string;
        }
    }
}