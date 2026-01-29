import express from 'express';
import {
    fetchAllPosts,
    fetchPostById,
    createPost,
    deletePost,
    updatePost
} from '../controllers/postController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const postRouter = express.Router();

// Public routes
postRouter.get('/posts', fetchAllPosts);
postRouter.get('/posts/:id', fetchPostById);

// Protected routes (Sadece admin)
postRouter.post('/posts', authenticateToken, isAdmin, createPost);
postRouter.delete('/posts/:id', authenticateToken, isAdmin, deletePost);
postRouter.put('/posts/:id', authenticateToken, isAdmin, updatePost);

export default postRouter;